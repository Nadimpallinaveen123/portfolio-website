package com.naveen.portfolio.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendRedirectController {

    @GetMapping({
            "/",
            "/about",
            "/skills",
            "/experience",
            "/projects",
            "/contact",
            "/admin"
    })
    public String forwardReactRoutes() {
        return "forward:/index.html";
    }
}
