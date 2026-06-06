package com.naveen.portfolio.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey key;
    private final String issuer;
    private final long adminTokenMinutes;
    private final long downloadTokenMinutes;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.issuer}") String issuer,
            @Value("${app.jwt.admin-token-minutes}") long adminTokenMinutes,
            @Value("${app.jwt.download-token-minutes}") long downloadTokenMinutes
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.issuer = issuer;
        this.adminTokenMinutes = adminTokenMinutes;
        this.downloadTokenMinutes = downloadTokenMinutes;
    }

    public String createAdminToken(String username) {
        return createToken(username, "ADMIN", adminTokenMinutes);
    }

    public String createDownloadToken(Long recruiterId) {
        return createToken(String.valueOf(recruiterId), "DOWNLOAD", downloadTokenMinutes);
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isAdminToken(String token) {
        return "ADMIN".equals(parse(token).get("type", String.class));
    }

    public Long recruiterIdFromDownloadToken(String token) {
        Claims claims = parse(token);
        if (!"DOWNLOAD".equals(claims.get("type", String.class))) {
            throw new IllegalArgumentException("Invalid download token");
        }
        return Long.valueOf(claims.getSubject());
    }

    private String createToken(String subject, String type, long minutes) {
        Instant now = Instant.now();
        return Jwts.builder()
                .issuer(issuer)
                .subject(subject)
                .claim("type", type)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(minutes * 60)))
                .signWith(key)
                .compact();
    }
}

