package com.naveen.portfolio.service;

import com.naveen.portfolio.dto.Requests.ResumeOtpRequest;
import com.naveen.portfolio.dto.Requests.VerifyOtpRequest;
import com.naveen.portfolio.entity.RecruiterDetails;
import com.naveen.portfolio.entity.ResumeDownload;
import com.naveen.portfolio.repository.RecruiterDetailsRepository;
import com.naveen.portfolio.repository.ResumeDownloadRepository;
import com.naveen.portfolio.security.JwtService;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.TransientDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);

    private final RecruiterDetailsRepository recruiterRepository;
    private final ResumeDownloadRepository downloadRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final String resumeClasspathLocation;

    public ResumeService(
            RecruiterDetailsRepository recruiterRepository,
            ResumeDownloadRepository downloadRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService,
            @Value("${app.resume.classpath-location}") String resumeClasspathLocation
    ) {
        this.recruiterRepository = recruiterRepository;
        this.downloadRepository = downloadRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.resumeClasspathLocation = resumeClasspathLocation;
    }

    @Retryable(
            retryFor = {TransientDataAccessException.class, DataAccessResourceFailureException.class},
            maxAttemptsExpression = "${app.database.retry.max-attempts:3}",
            backoff = @Backoff(
                    delayExpression = "${app.database.retry.initial-delay-ms:1000}",
                    multiplierExpression = "${app.database.retry.multiplier:2.0}",
                    maxDelayExpression = "${app.database.retry.max-delay-ms:8000}"
            )
    )
    @Transactional
    public Long requestOtp(ResumeOtpRequest request) {
        log.info("OTP request received for email={} company={}", request.email(), request.companyName());
        String otp = "%06d".formatted(secureRandom.nextInt(1_000_000));

        RecruiterDetails recruiter = new RecruiterDetails();
        recruiter.setFullName(request.fullName().trim());
        recruiter.setPhone(request.phone().trim());
        recruiter.setEmail(request.email().trim().toLowerCase());
        recruiter.setCompanyName(request.companyName().trim());
        recruiter.setDesignation(request.designation().trim());
        recruiter.setReason(request.reason().trim());
        recruiter.setOtpHash(passwordEncoder.encode(otp));
        recruiter.setOtpExpiresAt(OffsetDateTime.now().plusMinutes(5));

        RecruiterDetails saved = recruiterRepository.save(recruiter);
        emailService.sendOtpAsync(saved.getEmail(), otp);
        log.info("OTP generated and queued for recruiterId={}", saved.getId());
        return saved.getId();
    }

    @Retryable(
            retryFor = {TransientDataAccessException.class, DataAccessResourceFailureException.class},
            maxAttemptsExpression = "${app.database.retry.max-attempts:3}",
            backoff = @Backoff(
                    delayExpression = "${app.database.retry.initial-delay-ms:1000}",
                    multiplierExpression = "${app.database.retry.multiplier:2.0}",
                    maxDelayExpression = "${app.database.retry.max-delay-ms:8000}"
            )
    )
    @Transactional
    public String verifyOtp(VerifyOtpRequest request) {
        RecruiterDetails recruiter = recruiterRepository.findById(request.recruiterId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recruiter request not found"));

        if (recruiter.getOtpExpiresAt() == null || recruiter.getOtpExpiresAt().isBefore(OffsetDateTime.now())) {
            log.warn("Expired OTP verification attempt for recruiterId={}", recruiter.getId());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired");
        }

        if (!passwordEncoder.matches(request.otp(), recruiter.getOtpHash())) {
            log.warn("Failed OTP verification attempt for recruiterId={}", recruiter.getId());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP Verification Failed");
        }

        recruiter.setOtpVerified(true);
        recruiter.setOtpHash(null);
        recruiter.setOtpExpiresAt(null);
        emailService.notifyOwnerAsync(recruiter);
        log.info("OTP verified for recruiterId={}", recruiter.getId());
        return jwtService.createDownloadToken(recruiter.getId());
    }

    @Retryable(
            retryFor = {TransientDataAccessException.class, DataAccessResourceFailureException.class},
            maxAttemptsExpression = "${app.database.retry.max-attempts:3}",
            backoff = @Backoff(
                    delayExpression = "${app.database.retry.initial-delay-ms:1000}",
                    multiplierExpression = "${app.database.retry.multiplier:2.0}",
                    maxDelayExpression = "${app.database.retry.max-delay-ms:8000}"
            )
    )
    @Transactional
    public Resource downloadResume(String token, String ipAddress) {
        Long recruiterId = jwtService.recruiterIdFromDownloadToken(token);
        RecruiterDetails recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recruiter request not found"));

        if (!recruiter.isOtpVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "OTP verification required");
        }

        ResumeDownload resumeDownload = new ResumeDownload();
        resumeDownload.setRecruiter(recruiter);
        resumeDownload.setIpAddress(ipAddress);
        downloadRepository.save(resumeDownload);

        Resource resource = new ClassPathResource(resumeClasspathLocation);
        if (!resource.exists()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume file not found");
        }
        return resource;
    }
}
