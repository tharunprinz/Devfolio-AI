package com.devportfolio.controller;

import com.devportfolio.dto.AuthRequest;
import com.devportfolio.dto.AuthResponse;
import com.devportfolio.entity.User;
import com.devportfolio.security.JwtUtils;
import com.devportfolio.service.GitHubService;
import com.devportfolio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

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

    @Value("${devportfolio.github.clientId}")
    private String githubClientId;

    // Public health check — confirms which client ID is loaded
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        String maskedClientId = githubClientId.length() > 6
                ? githubClientId.substring(0, 6) + "..."
                : "NOT_SET";
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "githubClientId", maskedClientId,
                "clientIdLength", githubClientId.length()
        ));
    }

    @PostMapping("/github")
    public ResponseEntity<?> authenticateGitHubUser(@RequestBody AuthRequest authRequest) {
        log.info("Received GitHub auth request code: {}", authRequest.getCode());

        String githubToken = gitHubService.exchangeCodeForToken(authRequest.getCode());
        if (githubToken == null || githubToken.isBlank()) {
            log.error("GitHub token exchange returned null/blank for code: {}", authRequest.getCode());
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
            log.error("Error authenticating user via GitHub: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication failed: " + e.getMessage());
        }
    }
}
