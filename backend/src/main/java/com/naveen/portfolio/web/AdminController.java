package com.naveen.portfolio.web;

import com.naveen.portfolio.dto.Requests.AdminLoginRequest;
import com.naveen.portfolio.dto.Responses.AdminStatsResponse;
import com.naveen.portfolio.dto.Responses.DownloadResponse;
import com.naveen.portfolio.dto.Responses.LoginResponse;
import com.naveen.portfolio.dto.Responses.RecruiterResponse;
import com.naveen.portfolio.service.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody AdminLoginRequest request) {
        return new LoginResponse(adminService.login(request.username(), request.password()));
    }

    @GetMapping("/recruiters")
    public List<RecruiterResponse> recruiters(@RequestParam(required = false) String search) {
        return adminService.recruiters(search);
    }

    @GetMapping("/downloads")
    public List<DownloadResponse> downloads() {
        return adminService.downloads();
    }

    @GetMapping("/stats")
    public AdminStatsResponse stats() {
        return adminService.stats();
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export() {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename("recruiter-downloads.csv")
                        .build()
                        .toString())
                .body(adminService.exportCsv());
    }

    @DeleteMapping("/recruiters/{id}")
    public void deleteRecruiter(@PathVariable Long id) {
        adminService.deleteRecruiter(id);
    }
}

