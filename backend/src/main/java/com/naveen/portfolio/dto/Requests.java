package com.naveen.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class Requests {

    private Requests() {
    }

    public record ResumeOtpRequest(
            @NotBlank(message = "Full name is required")
            @Size(min = 2, max = 150, message = "Full name must be between 2 and 150 characters")
            @Pattern(regexp = "^[A-Za-z][A-Za-z .'-]*$", message = "Full name contains invalid characters")
            String fullName,

            @NotBlank(message = "Phone number is required")
            @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
            String phone,

            @Email(message = "Invalid email address")
            @NotBlank(message = "Email is required")
            String email,

            @NotBlank(message = "Company name is required")
            @Size(max = 180, message = "Company name must be 180 characters or fewer")
            String companyName,

            @NotBlank(message = "Designation is required")
            @Size(max = 120, message = "Designation must be 120 characters or fewer")
            String designation,

            @NotBlank(message = "Reason for download is required")
            @Size(max = 1000, message = "Reason must be 1000 characters or fewer")
            String reason
    ) {
    }

    public record VerifyOtpRequest(
            @NotNull(message = "Recruiter request id is required")
            Long recruiterId,

            @NotBlank(message = "OTP is required")
            @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be 6 digits")
            String otp
    ) {
    }

    public record AdminLoginRequest(@NotBlank String username, @NotBlank String password) {
    }

    public record ContactRequest(@NotBlank String fullName, @Email @NotBlank String email, @NotBlank String message) {
    }

    public record VisitRequest(@NotBlank String path) {
    }
}
