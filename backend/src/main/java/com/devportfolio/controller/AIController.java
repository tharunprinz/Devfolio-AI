package com.devportfolio.controller;

import com.devportfolio.entity.AIInsight;
import com.devportfolio.entity.Repository;
import com.devportfolio.entity.User;
import com.devportfolio.repository.AIInsightRepository;
import com.devportfolio.repository.RepositoryRepository;
import com.devportfolio.repository.UserRepository;
import com.devportfolio.security.CustomUserDetails;
import com.devportfolio.service.AIService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AIController.class);


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AIInsightRepository aiInsightRepository;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private AIService aiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User getAuthenticatedUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));
    }

    @GetMapping("/insights")
    public ResponseEntity<?> getCareerInsights() {
        try {
            User user = getAuthenticatedUser();
            Optional<AIInsight> insightOpt = aiInsightRepository.findByUserId(user.getId());

            if (insightOpt.isPresent()) {
                return ResponseEntity.ok(insightOpt.get());
            }

            // Generate fresh insights if none exist
            return generateAndSaveInsights(user);
        } catch (Exception e) {
            log.error("Failed to fetch career insights: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/insights/regenerate")
    public ResponseEntity<?> regenerateInsights() {
        try {
            User user = getAuthenticatedUser();
            return generateAndSaveInsights(user);
        } catch (Exception e) {
            log.error("Failed to regenerate insights: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private ResponseEntity<?> generateAndSaveInsights(User user) throws Exception {
        log.info("Generating new career insights for user: {}", user.getGithubUsername());
        List<Repository> repos = repositoryRepository.findByUserId(user.getId());

        List<Map<String, Object>> repoDetails = new ArrayList<>();
        List<String> repoDescriptions = new ArrayList<>();
        for (Repository repo : repos) {
            Map<String, Object> details = new HashMap<>();
            details.put("name", repo.getRepoName());
            details.put("language", repo.getLanguage());
            details.put("description", repo.getDescription());
            repoDetails.add(details);
            if (repo.getDescription() != null) {
                repoDescriptions.add(repo.getDescription());
            }
        }

        // First extract skills JSON
        String skillsJson = aiService.generateSkillExtraction(repoDetails);

        // Generate career insights JSON
        String insightsJson = aiService.generateCareerInsights(user.getGithubUsername(), skillsJson, repoDescriptions);

        // Parse fields to save in AIInsight entity fields
        Map insightsMap = objectMapper.readValue(insightsJson, Map.class);
        String strengths = objectMapper.writeValueAsString(insightsMap.get("strengths"));
        String weaknesses = objectMapper.writeValueAsString(insightsMap.get("weaknesses"));
        String recommendations = objectMapper.writeValueAsString(insightsMap.get("recommendations"));
        String skillGap = objectMapper.writeValueAsString(insightsMap.get("skillGap"));
        Integer brandScore = (Integer) insightsMap.getOrDefault("personalBrandingScore", 80);
        Integer interviewScore = (Integer) insightsMap.getOrDefault("interviewReadinessScore", 75);

        Optional<AIInsight> existingOpt = aiInsightRepository.findByUserId(user.getId());
        AIInsight insight;

        if (existingOpt.isPresent()) {
            insight = existingOpt.get();
            insight.setStrengths(strengths);
            insight.setWeaknesses(weaknesses);
            insight.setRecommendations(recommendations);
            insight.setSkillGap(skillGap);
            insight.setPersonalBrandingScore(brandScore);
            insight.setInterviewReadinessScore(interviewScore);
        } else {
            insight = AIInsight.builder()
                    .user(user)
                    .strengths(strengths)
                    .weaknesses(weaknesses)
                    .recommendations(recommendations)
                    .skillGap(skillGap)
                    .personalBrandingScore(brandScore)
                    .interviewReadinessScore(interviewScore)
                    .build();
        }

        AIInsight saved = aiInsightRepository.save(insight);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/roast")
    public ResponseEntity<?> getProfileRoast() {
        try {
            User user = getAuthenticatedUser();
            List<Repository> repos = repositoryRepository.findByUserId(user.getId());

            List<Map<String, Object>> repoDetails = new ArrayList<>();
            for (Repository repo : repos) {
                Map<String, Object> details = new HashMap<>();
                details.put("name", repo.getRepoName());
                details.put("language", repo.getLanguage());
                details.put("stars", repo.getStars());
                repoDetails.add(details);
            }

            String roastJson = aiService.generateGitHubRoast(user.getGithubUsername(), repoDetails);
            return ResponseEntity.ok(roastJson);
        } catch (Exception e) {
            log.error("Failed to generate github roast: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/cover-letter")
    public ResponseEntity<?> generateCoverLetter(@RequestBody Map<String, String> payload) {
        try {
            User user = getAuthenticatedUser();
            String jobDesc = payload.getOrDefault("jobDescription", "");
            String company = payload.getOrDefault("companyName", "Target Company");
            String role = payload.getOrDefault("roleTitle", "Software Engineer");

            List<Repository> repos = repositoryRepository.findByUserId(user.getId());
            StringBuilder skillsBuilder = new StringBuilder();
            for (Repository r : repos) {
                if (r.getLanguage() != null && !skillsBuilder.toString().contains(r.getLanguage())) {
                    skillsBuilder.append(r.getLanguage()).append(", ");
                }
            }

            // Call mock/real AI API for cover letter text
            String prompt = String.format(
                    "Write a professional cover letter for developer %s applying for %s role at %s.\n" +
                    "Job Description: %s\n" +
                    "Developer Skills: %s\n" +
                    "Focus on how developer's GitHub projects solve key tasks in the job description.\n" +
                    "Return a JSON object with: { \"coverLetter\": \"Your cover letter text\" }",
                    user.getName(), role, company, jobDesc, skillsBuilder.toString()
            );

            // Call generic Gemini REST prompt logic
            String rawJson = aiService.askChatbot("Cover Letter Writer Engine", "Cover Letter Writer instructions", prompt, List.of());
            
            // Clean/Transform chatbot output if it's formatted as standard chat reply
            Map parsed = objectMapper.readValue(rawJson, Map.class);
            String rawReply = (String) parsed.getOrDefault("reply", "");
            
            Map<String, String> result = new HashMap<>();
            result.put("coverLetter", rawReply.isEmpty() ? "Dear Hiring Manager,\n\nI am thrilled to apply for the " + role + " role at " + company + "..." : rawReply);
            
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Failed to generate cover letter: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/linkedin-about")
    public ResponseEntity<?> generateLinkedInAbout(@RequestBody Map<String, String> payload) {
        try {
            User user = getAuthenticatedUser();
            String tone = payload.getOrDefault("tone", "professional");

            List<Repository> repos = repositoryRepository.findByUserId(user.getId());
            StringBuilder skillsBuilder = new StringBuilder();
            for (Repository r : repos) {
                if (r.getLanguage() != null && !skillsBuilder.toString().contains(r.getLanguage())) {
                    skillsBuilder.append(r.getLanguage()).append(", ");
                }
            }

            String prompt = String.format(
                    "Generate a creative and modern LinkedIn About summary for developer %s in a '%s' tone.\n" +
                    "Developer Skills: %s\n" +
                    "Return a JSON object with: { \"linkedinAbout\": \"Your LinkedIn About section text\" }",
                    user.getName(), tone, skillsBuilder.toString()
            );

            String rawJson = aiService.askChatbot("LinkedIn About Writer Engine", "LinkedIn About instructions", prompt, List.of());
            Map parsed = objectMapper.readValue(rawJson, Map.class);
            String rawReply = (String) parsed.getOrDefault("reply", "");

            Map<String, String> result = new HashMap<>();
            result.put("linkedinAbout", rawReply.isEmpty() ? "Passionate engineer specialized in " + skillsBuilder.toString() + " building modern fullstack apps." : rawReply);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Failed to generate LinkedIn About text: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
