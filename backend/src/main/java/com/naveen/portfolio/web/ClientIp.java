package com.naveen.portfolio.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.StringUtils;

public final class ClientIp {

    private ClientIp() {
    }

    public static String from(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwardedFor)) {
            return forwardedFor.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (StringUtils.hasText(realIp)) {
            return realIp;
        }
        return request.getRemoteAddr();
    }
}

