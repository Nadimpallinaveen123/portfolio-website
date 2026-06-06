package com.naveen.portfolio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "resume_downloads")
public class ResumeDownload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private RecruiterDetails recruiter;

    @Column(nullable = false)
    private OffsetDateTime downloadTime = OffsetDateTime.now();

    @Column(length = 80)
    private String ipAddress;

    public Long getId() {
        return id;
    }

    public RecruiterDetails getRecruiter() {
        return recruiter;
    }

    public void setRecruiter(RecruiterDetails recruiter) {
        this.recruiter = recruiter;
    }

    public OffsetDateTime getDownloadTime() {
        return downloadTime;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
}

