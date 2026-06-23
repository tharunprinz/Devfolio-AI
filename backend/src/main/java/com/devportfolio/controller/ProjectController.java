package com.devportfolio.controller;

import com.devportfolio.entity.Repository;
import com.devportfolio.entity.User;
import com.devportfolio.repository.RepositoryRepository;
import com.devportfolio.repository.UserRepository;
import com.devportfolio.security.CustomUserDetails;
import com.devportfolio.service.AIService;
import com.devportfolio.service.GitHubService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ProjectController.class);


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private AIService aiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User getAuthenticatedUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));
    }

    @PostMapping("/{repoId}/analyze")
    public ResponseEntity<?> analyzeRepository(@PathVariable UUID repoId) {
        try {
            User user = getAuthenticatedUser();
            Optional<Repository> repoOpt = repositoryRepository.findById(repoId);

            if (repoOpt.isEmpty() || !repoOpt.get().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Repository not found");
            }

            Repository repo = repoOpt.get();
            log.info("Analyzing repository: {} for user: {}", repo.getRepoName(), user.getGithubUsername());

            // 1. Fetch raw README content from GitHub
            String readme = gitHubService.getRepositoryReadme(user.getGithubUsername(), repo.getRepoName(), user.getGithubToken());
            repo.setReadmeContent(readme);

            // 2. Call AI analyzer
            String analysisJson = aiService.analyzeProject(
                    repo.getRepoName(),
                    repo.getDescription(),
                    repo.getLanguage(),
                    readme
            );

            // 3. Extract health score from JSON if possible, fallback to default
            int healthScore = 85;
            try {
                Map<String, Object> mapped = objectMapper.readValue(analysisJson, Map.class);
                if (mapped.containsKey("healthScore")) {
                    healthScore = ((Number) mapped.get("healthScore")).intValue();
                }
            } catch (Exception ex) {
                log.warn("Failed to parse healthScore from AI JSON: {}", ex.getMessage());
            }

            repo.setAnalysisResult(analysisJson);
            repo.setHealthScore(healthScore);

            Repository savedRepo = repositoryRepository.save(repo);
            return ResponseEntity.ok(savedRepo);

        } catch (Exception e) {
            log.error("Failed to analyze repository: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Analysis failed: " + e.getMessage());
        }
    }

    @PutMapping("/{repoId}/override")
    public ResponseEntity<?> overrideAnalysis(@PathVariable UUID repoId, @RequestBody String customAnalysisJson) {
        try {
            User user = getAuthenticatedUser();
            Optional<Repository> repoOpt = repositoryRepository.findById(repoId);

            if (repoOpt.isEmpty() || !repoOpt.get().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Repository not found");
            }

            Repository repo = repoOpt.get();
            repo.setAnalysisResult(customAnalysisJson);

            // Update health score if present in custom JSON
            try {
                Map<String, Object> mapped = objectMapper.readValue(customAnalysisJson, Map.class);
                if (mapped.containsKey("healthScore")) {
                    repo.setHealthScore(((Number) mapped.get("healthScore")).intValue());
                }
            } catch (Exception ex) {
                log.warn("Custom JSON missing health score: {}", ex.getMessage());
            }

            Repository saved = repositoryRepository.save(repo);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Failed to override repository analysis: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
