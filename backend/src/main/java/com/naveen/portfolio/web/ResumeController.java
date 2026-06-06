package com.naveen.portfolio.web;

import com.naveen.portfolio.dto.Requests.ResumeOtpRequest;
import com.naveen.portfolio.dto.Requests.VerifyOtpRequest;
import com.naveen.portfolio.dto.Responses.OtpRequestedResponse;
import com.naveen.portfolio.dto.Responses.OtpVerifiedResponse;
import com.naveen.portfolio.service.ResumeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/request-otp")
    public OtpRequestedResponse requestOtp(@Valid @RequestBody ResumeOtpRequest request) {
        Long recruiterId = resumeService.requestOtp(request);
        return new OtpRequestedResponse(recruiterId, "OTP sent to recruiter email");
    }

    @PostMapping("/verify-otp")
    public OtpVerifiedResponse verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        String token = resumeService.verifyOtp(request);
        return new OtpVerifiedResponse(token, "OTP verified");
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download(
            @RequestHeader(name = "X-Download-Token", required = false) String downloadToken,
            HttpServletRequest request
    ) {
        if (!StringUtils.hasText(downloadToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Download token missing");
        }

        Resource resource = resumeService.downloadResume(downloadToken, ClientIp.from(request));
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename("NaveenNadimpalli_JFS_updated_resume.pdf")
                        .build()
                        .toString())
                .body(resource);
    }
}

