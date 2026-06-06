package com.naveen.portfolio.dto;

import java.time.OffsetDateTime;

public final class Responses {

    private Responses() {
    }

    public record MessageResponse(String message) {
    }

    public record OtpRequestedResponse(Long recruiterId, String message) {
    }

    public record OtpVerifiedResponse(String downloadToken, String message) {
    }

    public record LoginResponse(String token) {
    }

    public record RecruiterResponse(
            Long id,
            String fullName,
            String phone,
            String email,
            String companyName,
            String designation,
            String reason,
            boolean otpVerified,
            OffsetDateTime createdDate
    ) {
    }

    public record DownloadResponse(
            Long id,
            Long recruiterId,
            String recruiterName,
            String recruiterEmail,
            OffsetDateTime downloadTime,
            String ipAddress
    ) {
    }

    public record AdminStatsResponse(
            long totalRecruiters,
            long verifiedRecruiters,
            long totalDownloads,
            long totalVisitors
    ) {
    }

    public record PublicMetricsResponse(long visitors, long downloads) {
    }
}

