package com.devportfolio.controller;

import com.devportfolio.dto.AuthRequest;
import com.devportfolio.dto.AuthResponse;
import com.devportfolio.entity.User;
import com.devportfolio.security.JwtUtils;
import com.devportfolio.service.GitHubService;
import com.devportfolio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuthController.class);


    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/github")
    public ResponseEntity<?> authenticateGitHubUser(@RequestBody AuthRequest authRequest) {
        log.info("Received GitHub auth request code: {}", authRequest.getCode());

        String githubToken = gitHubService.exchangeCodeForToken(authRequest.getCode());
        if (githubToken == null || githubToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Failed to exchange code for access token with GitHub");
        }

        try {
            User user = userService.processGitHubLogin(githubToken);
            String appJwt = jwtUtils.generateJwtToken(user.getGithubUsername());

            AuthResponse response = AuthResponse.builder()
                    .token(appJwt)
                    .username(user.getGithubUsername())
                    .name(user.getName())
                    .avatarUrl(user.getAvatarUrl())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error authenticating user via GitHub: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication failed: " + e.getMessage());
        }
    }
}
