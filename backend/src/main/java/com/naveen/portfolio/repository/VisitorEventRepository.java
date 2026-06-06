package com.naveen.portfolio.repository;

import com.naveen.portfolio.entity.VisitorEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitorEventRepository extends JpaRepository<VisitorEvent, Long> {
}

