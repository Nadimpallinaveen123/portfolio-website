package com.naveen.portfolio.config;

import com.naveen.portfolio.entity.AdminUser;
import com.naveen.portfolio.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrap implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public AdminBootstrap(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.username}") String username,
            @Value("${app.admin.password}") String password
    ) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        adminUserRepository.findByUsername(username).orElseGet(() -> {
            AdminUser adminUser = new AdminUser();
            adminUser.setUsername(username);
            adminUser.setPassword(passwordEncoder.encode(password));
            return adminUserRepository.save(adminUser);
        });
    }
}

