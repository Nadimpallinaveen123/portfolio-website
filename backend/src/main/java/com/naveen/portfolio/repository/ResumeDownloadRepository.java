package com.naveen.portfolio.repository;

import com.naveen.portfolio.entity.ResumeDownload;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeDownloadRepository extends JpaRepository<ResumeDownload, Long> {

    List<ResumeDownload> findTop50ByOrderByDownloadTimeDesc();
}

