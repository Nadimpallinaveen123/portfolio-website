package com.naveen.portfolio.repository;

import com.naveen.portfolio.entity.RecruiterDetails;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RecruiterDetailsRepository extends JpaRepository<RecruiterDetails, Long> {

    @Query("""
            select r from RecruiterDetails r
            where :search is null
               or lower(r.fullName) like lower(concat('%', :search, '%'))
               or lower(r.email) like lower(concat('%', :search, '%'))
               or lower(r.companyName) like lower(concat('%', :search, '%'))
               or lower(r.designation) like lower(concat('%', :search, '%'))
            order by r.createdDate desc
            """)
    List<RecruiterDetails> search(@Param("search") String search);

    long countByOtpVerifiedTrue();
}

