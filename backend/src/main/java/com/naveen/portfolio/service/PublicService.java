package com.naveen.portfolio.service;

import com.naveen.portfolio.dto.Requests.ContactRequest;
import com.naveen.portfolio.dto.Responses.PublicMetricsResponse;
import com.naveen.portfolio.entity.ContactMessage;
import com.naveen.portfolio.entity.VisitorEvent;
import com.naveen.portfolio.repository.ContactMessageRepository;
import com.naveen.portfolio.repository.ResumeDownloadRepository;
import com.naveen.portfolio.repository.VisitorEventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.TransientDataAccessException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

@Service
public class PublicService {

    private static final Logger log = LoggerFactory.getLogger(PublicService.class);

    private final ContactMessageRepository contactRepository;
    private final VisitorEventRepository visitorRepository;
    private final ResumeDownloadRepository downloadRepository;
    private final EmailService emailService;

    public PublicService(
            ContactMessageRepository contactRepository,
            VisitorEventRepository visitorRepository,
            ResumeDownloadRepository downloadRepository,
            EmailService emailService
    ) {
        this.contactRepository = contactRepository;
        this.visitorRepository = visitorRepository;
        this.downloadRepository = downloadRepository;
        this.emailService = emailService;
    }

    @Retryable(
            retryFor = {TransientDataAccessException.class, DataAccessResourceFailureException.class},
            maxAttemptsExpression = "${app.database.retry.max-attempts:3}",
            backoff = @Backoff(
                    delayExpression = "${app.database.retry.initial-delay-ms:1000}",
                    multiplierExpression = "${app.database.retry.multiplier:2.0}",
                    maxDelayExpression = "${app.database.retry.max-delay-ms:8000}"
            )
    )
    public void saveContact(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setFullName(request.fullName().trim());
        message.setEmail(request.email().trim().toLowerCase());
        message.setMessage(request.message().trim());
        contactRepository.save(message);
        emailService.notifyContactAsync(message.getFullName(), message.getEmail(), message.getMessage());
    }

    public void trackVisit(String path, String ipAddress, String userAgent) {
        try {
            VisitorEvent event = new VisitorEvent();
            event.setPath(path);
            event.setIpAddress(ipAddress);
            event.setUserAgent(userAgent);
            visitorRepository.save(event);
        } catch (DataAccessException exception) {
            log.warn("Visitor tracking skipped because database is unavailable: {}", exception.getMostSpecificCause().getMessage());
        }
    }

    public PublicMetricsResponse metrics() {
        try {
            return new PublicMetricsResponse(visitorRepository.count(), downloadRepository.count());
        } catch (DataAccessException exception) {
            log.warn("Public metrics unavailable because database is unavailable: {}", exception.getMostSpecificCause().getMessage());
            return new PublicMetricsResponse(0, 0);
        }
    }
}
