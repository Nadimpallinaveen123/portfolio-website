package com.naveen.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "recruiter_details")
public class RecruiterDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(nullable = false, length = 180)
    private String companyName;

    @Column(nullable = false, length = 120)
    private String designation;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(length = 255)
    private String otpHash;

    private OffsetDateTime otpExpiresAt;

    @Column(nullable = false)
    private boolean otpVerified = false;

    @Column(nullable = false)
    private OffsetDateTime createdDate = OffsetDateTime.now();

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getOtpHash() {
        return otpHash;
    }

    public void setOtpHash(String otpHash) {
        this.otpHash = otpHash;
    }

    public OffsetDateTime getOtpExpiresAt() {
        return otpExpiresAt;
    }

    public void setOtpExpiresAt(OffsetDateTime otpExpiresAt) {
        this.otpExpiresAt = otpExpiresAt;
    }

    public boolean isOtpVerified() {
        return otpVerified;
    }

    public void setOtpVerified(boolean otpVerified) {
        this.otpVerified = otpVerified;
    }

    public OffsetDateTime getCreatedDate() {
        return createdDate;
    }
}

