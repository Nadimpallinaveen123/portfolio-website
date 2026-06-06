package com.naveen.portfolio.service;

import com.naveen.portfolio.entity.RecruiterDetails;
import com.naveen.portfolio.exception.EmailDeliveryException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromEmail;
    private final String mailPassword;
    private final String ownerEmail;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username:}") String fromEmail,
            @Value("${spring.mail.password:}") String mailPassword,
            @Value("${app.owner-email:}") String ownerEmail
    ) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
        this.mailPassword = mailPassword;
        this.ownerEmail = ownerEmail;
    }

    public void sendOtp(String to, String otp) {
        sendRequired(
                to,
                "OTP for Naveen Nadimpalli Resume Download",
                """
                Your OTP for downloading Naveen Nadimpalli's resume is %s.

                This OTP expires in 5 minutes.
                """.formatted(otp)
        );
    }

    public void notifyOwner(RecruiterDetails recruiter) {
        if (!StringUtils.hasText(ownerEmail)) {
            log.warn("OWNER_EMAIL is not configured. Skipping owner notification.");
            return;
        }
        sendOptional(
                ownerEmail,
                "Resume verified by recruiter",
                """
                A recruiter verified resume access.

                Name: %s
                Email: %s
                Phone: %s
                Company: %s
                Designation: %s
                Reason: %s
                """.formatted(
                        recruiter.getFullName(),
                        recruiter.getEmail(),
                        recruiter.getPhone(),
                        recruiter.getCompanyName(),
                        recruiter.getDesignation(),
                        recruiter.getReason()
                )
        );
    }

    public void notifyContact(String fullName, String email, String message) {
        if (!StringUtils.hasText(ownerEmail)) {
            log.warn("OWNER_EMAIL is not configured. Skipping contact notification.");
            return;
        }
        sendOptional(
                ownerEmail,
                "Portfolio contact message",
                """
                Name: %s
                Email: %s

                %s
                """.formatted(fullName, email, message)
        );
    }

    private void sendRequired(String to, String subject, String body) {
        // If SMTP credentials are not configured (local/dev), do not fail the request.
        // Log the message instead so developers can retrieve the OTP from logs.
        if (!StringUtils.hasText(fromEmail) || !StringUtils.hasText(mailPassword)) {
            log.warn("SPRING_MAIL_USERNAME or SPRING_MAIL_PASSWORD not configured. Falling back to log-only email delivery for {}.", to);
            log.info("=== Dev Email Delivery ===\nTo: {}\nSubject: {}\n\n{}\n========================", to, subject, body);
            return;
        }
        if (!StringUtils.hasText(to)) {
            log.error("Recipient email is missing.");
            throw new EmailDeliveryException("Email Service Unavailable");
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (MailAuthenticationException exception) {
            log.error("Gmail SMTP authentication failed for username={}. Use a Gmail App Password, not the normal Gmail password.", fromEmail, exception);
            throw new EmailDeliveryException("SMTP Authentication Failed. Use a valid Gmail App Password.", exception);
        } catch (MailSendException exception) {
            log.error("SMTP send failed for {}. Root cause: {}", to, rootCauseMessage(exception), exception);
            if (isTimeout(exception)) {
                throw new EmailDeliveryException("Email Service Unavailable. Gmail SMTP connection timed out.", exception);
            }
            throw new EmailDeliveryException("Unable to Send OTP. Check Gmail SMTP settings and app password.", exception);
        } catch (MailException exception) {
            log.error("Failed to send email to {}. Root cause: {}", to, rootCauseMessage(exception), exception);
            throw new EmailDeliveryException("Unable to Send OTP. Check Gmail SMTP settings and app password.", exception);
        }
    }

    private void sendOptional(String to, String subject, String body) {
        try {
            sendRequired(to, subject, body);
        } catch (EmailDeliveryException exception) {
            log.warn("Optional email notification failed: {}", exception.getMessage());
        }
    }

    private boolean isTimeout(Exception exception) {
        String message = rootCauseMessage(exception).toLowerCase();
        return message.contains("timeout") || message.contains("timed out") || message.contains("connection refused");
    }

    private String rootCauseMessage(Throwable throwable) {
        Throwable current = throwable;
        while (current.getCause() != null) {
            current = current.getCause();
        }
        return current.getMessage() == null ? current.getClass().getSimpleName() : current.getMessage();
    }
}
