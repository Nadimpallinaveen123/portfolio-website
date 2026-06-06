package com.naveen.portfolio.web;

import com.naveen.portfolio.dto.Requests.ContactRequest;
import com.naveen.portfolio.dto.Requests.VisitRequest;
import com.naveen.portfolio.dto.Responses.MessageResponse;
import com.naveen.portfolio.dto.Responses.PublicMetricsResponse;
import com.naveen.portfolio.service.PublicService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PublicController {

    private final PublicService publicService;

    public PublicController(PublicService publicService) {
        this.publicService = publicService;
    }

    @PostMapping("/contact")
    public MessageResponse contact(@Valid @RequestBody ContactRequest request) {
        publicService.saveContact(request);
        return new MessageResponse("Message sent");
    }

    @PostMapping("/analytics/visit")
    public MessageResponse visit(@Valid @RequestBody VisitRequest request, HttpServletRequest servletRequest) {
        publicService.trackVisit(request.path(), ClientIp.from(servletRequest), servletRequest.getHeader("User-Agent"));
        return new MessageResponse("Visit tracked");
    }

    @GetMapping("/analytics/metrics")
    public PublicMetricsResponse metrics() {
        return publicService.metrics();
    }
}

