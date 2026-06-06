package com.naveen.portfolio.web;

import com.naveen.portfolio.dto.Responses.MessageResponse;
import com.naveen.portfolio.exception.EmailDeliveryException;
import io.jsonwebtoken.JwtException;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageResponse> validation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(this::formatFieldError)
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new MessageResponse(message));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<MessageResponse> responseStatus(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode())
                .body(new MessageResponse(exception.getReason() == null ? "Request failed" : exception.getReason()));
    }

    @ExceptionHandler({JwtException.class, IllegalArgumentException.class})
    public ResponseEntity<MessageResponse> token(Exception exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Invalid or expired token"));
    }

    @ExceptionHandler(EmailDeliveryException.class)
    public ResponseEntity<MessageResponse> email(EmailDeliveryException exception) {
        log.warn("Email delivery failed after retries: {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(new MessageResponse("Your request was received. Email delivery is taking longer than usual, so please wait a moment and try again if the OTP does not arrive."));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<MessageResponse> database(DataAccessException exception) {
        log.error("Database operation failed after retries. Check PostgreSQL/Supabase connectivity and datasource environment variables.", exception);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new MessageResponse("Service is warming up. Please retry in a few seconds."));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<MessageResponse> noResource(NoResourceFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Resource not found"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> general(Exception exception) {
        log.error("Unhandled API exception", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Unexpected server error"));
    }

    private String formatFieldError(FieldError fieldError) {
        return fieldError.getField() + " " + fieldError.getDefaultMessage();
    }
}
