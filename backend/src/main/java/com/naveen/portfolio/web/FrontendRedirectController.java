package com.naveen.portfolio.web;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendRedirectController {

    private static final Set<String> FRONTEND_ROUTES = Set.of(
            "/",
            "/about",
            "/skills",
            "/experience",
            "/projects",
            "/contact",
            "/admin"
    );

    private final String frontendUrl;

    public FrontendRedirectController(@Value("${app.frontend.url}") String frontendUrl) {
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }

    @GetMapping({"/", "/about", "/skills", "/experience", "/projects", "/contact", "/admin"})
    public String redirectToFrontend(HttpServletRequest request) {
        String path = request.getRequestURI();
        String frontendPath = FRONTEND_ROUTES.contains(path) && !"/".equals(path) ? path : "";
        return "redirect:" + frontendUrl + frontendPath;
    }
}
