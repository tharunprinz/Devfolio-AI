package com.devportfolio.controller;

import com.devportfolio.entity.Repository;
import com.devportfolio.entity.User;
import com.devportfolio.repository.RepositoryRepository;
import com.devportfolio.repository.UserRepository;
import com.devportfolio.security.CustomUserDetails;
import com.devportfolio.service.GitHubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/github")
public class GitHubController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(GitHubController.class);


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private GitHubService gitHubService;

    private User getAuthenticatedUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));
    }

    @GetMapping("/repos")
    public ResponseEntity<List<Repository>> getSyncedRepositories() {
        try {
            User user = getAuthenticatedUser();
            List<Repository> repos = repositoryRepository.findByUserId(user.getId());
            return ResponseEntity.ok(repos);
        } catch (Exception e) {
            log.error("Error fetching repositories: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncRepositories() {
        try {
            User user = getAuthenticatedUser();
            String token = user.getGithubToken();
            if (token == null || token.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("User is missing GitHub access token. Re-login required.");
            }

            log.info("Starting repo sync for user: {}", user.getGithubUsername());
            List<Repository> githubRepos = gitHubService.getUserRepositories(user, token);

            for (Repository githubRepo : githubRepos) {
                Optional<Repository> existingRepoOpt = repositoryRepository.findByUserAndRepoName(user, githubRepo.getRepoName());
                if (existingRepoOpt.isPresent()) {
                    Repository existingRepo = existingRepoOpt.get();
                    existingRepo.setDescription(githubRepo.getDescription());
                    existingRepo.setLanguage(githubRepo.getLanguage());
                    existingRepo.setStars(githubRepo.getStars());
                    existingRepo.setForks(githubRepo.getForks());
                    repositoryRepository.save(existingRepo);
                } else {
                    repositoryRepository.save(githubRepo);
                }
            }

            List<Repository> updatedRepos = repositoryRepository.findByUserId(user.getId());
            return ResponseEntity.ok(updatedRepos);
        } catch (Exception e) {
            log.error("Failed to sync repositories: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Sync failed: " + e.getMessage());
        }
    }
}
