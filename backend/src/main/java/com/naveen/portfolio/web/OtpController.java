package com.naveen.portfolio.web;

import com.naveen.portfolio.dto.Requests.ResumeOtpRequest;
import com.naveen.portfolio.dto.Requests.VerifyOtpRequest;
import com.naveen.portfolio.dto.Responses.OtpRequestedResponse;
import com.naveen.portfolio.dto.Responses.OtpVerifiedResponse;
import com.naveen.portfolio.service.ResumeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private final ResumeService resumeService;

    public OtpController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/send")
    public OtpRequestedResponse send(@Valid @RequestBody ResumeOtpRequest request) {
        Long recruiterId = resumeService.requestOtp(request);
        return new OtpRequestedResponse(recruiterId, "OTP sent successfully");
    }

    @PostMapping("/verify")
    public OtpVerifiedResponse verify(@Valid @RequestBody VerifyOtpRequest request) {
        String token = resumeService.verifyOtp(request);
        return new OtpVerifiedResponse(token, "OTP verified successfully");
    }
}

