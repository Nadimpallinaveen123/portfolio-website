package com.naveen.portfolio.service;

import com.naveen.portfolio.dto.Responses.AdminStatsResponse;
import com.naveen.portfolio.dto.Responses.DownloadResponse;
import com.naveen.portfolio.dto.Responses.RecruiterResponse;
import com.naveen.portfolio.entity.AdminUser;
import com.naveen.portfolio.entity.RecruiterDetails;
import com.naveen.portfolio.entity.ResumeDownload;
import com.naveen.portfolio.repository.AdminUserRepository;
import com.naveen.portfolio.repository.RecruiterDetailsRepository;
import com.naveen.portfolio.repository.ResumeDownloadRepository;
import com.naveen.portfolio.repository.VisitorEventRepository;
import com.naveen.portfolio.security.JwtService;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminService {

    private final AdminUserRepository adminUserRepository;
    private final RecruiterDetailsRepository recruiterRepository;
    private final ResumeDownloadRepository downloadRepository;
    private final VisitorEventRepository visitorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminService(
            AdminUserRepository adminUserRepository,
            RecruiterDetailsRepository recruiterRepository,
            ResumeDownloadRepository downloadRepository,
            VisitorEventRepository visitorRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.adminUserRepository = adminUserRepository;
        this.recruiterRepository = recruiterRepository;
        this.downloadRepository = downloadRepository;
        this.visitorRepository = visitorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String login(String username, String password) {
        AdminUser adminUser = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(password, adminUser.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return jwtService.createAdminToken(adminUser.getUsername());
    }

    @Transactional(readOnly = true)
    public List<RecruiterResponse> recruiters(String search) {
        String query = search == null || search.isBlank() ? null : search.trim();
        return recruiterRepository.search(query).stream().map(this::toRecruiterResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<DownloadResponse> downloads() {
        return downloadRepository.findTop50ByOrderByDownloadTimeDesc().stream().map(this::toDownloadResponse).toList();
    }

    public AdminStatsResponse stats() {
        return new AdminStatsResponse(
                recruiterRepository.count(),
                recruiterRepository.countByOtpVerifiedTrue(),
                downloadRepository.count(),
                visitorRepository.count()
        );
    }

    public void deleteRecruiter(Long id) {
        recruiterRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public byte[] exportCsv() {
        StringBuilder builder = new StringBuilder();
        builder.append("ID,Full Name,Phone,Email,Company,Designation,Reason,OTP Verified,Created Date\n");
        for (RecruiterResponse recruiter : recruiters(null)) {
            builder.append(recruiter.id()).append(',')
                    .append(csv(recruiter.fullName())).append(',')
                    .append(csv(recruiter.phone())).append(',')
                    .append(csv(recruiter.email())).append(',')
                    .append(csv(recruiter.companyName())).append(',')
                    .append(csv(recruiter.designation())).append(',')
                    .append(csv(recruiter.reason())).append(',')
                    .append(recruiter.otpVerified()).append(',')
                    .append(recruiter.createdDate()).append('\n');
        }
        return builder.toString().getBytes(StandardCharsets.UTF_8);
    }

    private RecruiterResponse toRecruiterResponse(RecruiterDetails recruiter) {
        return new RecruiterResponse(
                recruiter.getId(),
                recruiter.getFullName(),
                recruiter.getPhone(),
                recruiter.getEmail(),
                recruiter.getCompanyName(),
                recruiter.getDesignation(),
                recruiter.getReason(),
                recruiter.isOtpVerified(),
                recruiter.getCreatedDate()
        );
    }

    private DownloadResponse toDownloadResponse(ResumeDownload download) {
        RecruiterDetails recruiter = download.getRecruiter();
        return new DownloadResponse(
                download.getId(),
                recruiter.getId(),
                recruiter.getFullName(),
                recruiter.getEmail(),
                download.getDownloadTime(),
                download.getIpAddress()
        );
    }

    private String csv(String value) {
        if (value == null) {
            return "";
        }
        return '"' + value.replace("\"", "\"\"") + '"';
    }
}

