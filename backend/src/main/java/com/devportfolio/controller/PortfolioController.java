package com.devportfolio.controller;

import com.devportfolio.entity.Portfolio;
import com.devportfolio.entity.Repository;
import com.devportfolio.entity.User;
import com.devportfolio.repository.PortfolioRepository;
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
@RequestMapping("/api/portfolios")
public class PortfolioController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PortfolioController.class);


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

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

    @GetMapping
    public ResponseEntity<List<Portfolio>> getMyPortfolios() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(portfolioRepository.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Portfolio> getPortfolioById(@PathVariable UUID id) {
        User user = getAuthenticatedUser();
        Optional<Portfolio> portfolioOpt = portfolioRepository.findById(id);

        if (portfolioOpt.isEmpty() || !portfolioOpt.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(portfolioOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createInitialPortfolio(@RequestBody Map<String, String> requestParams) {
        try {
            User user = getAuthenticatedUser();
            String templateName = requestParams.getOrDefault("templateName", "glassmorphism");

            log.info("Generating initial portfolio for user {} with template {}", user.getGithubUsername(), templateName);

            // Fetch synced repos to construct skills and projects list
            List<Repository> repos = repositoryRepository.findByUserId(user.getId());
            List<Map<String, Object>> repoDetails = new ArrayList<>();
            for (Repository repo : repos) {
                Map<String, Object> details = new HashMap<>();
                details.put("name", repo.getRepoName());
                details.put("language", repo.getLanguage());
                details.put("description", repo.getDescription());
                repoDetails.add(details);
            }

            // Extract skills using AI
            String skillsJson = aiService.generateSkillExtraction(repoDetails);

            // Structure a standard generated content object
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("name", user.getName());
            contentMap.put("avatarUrl", user.getAvatarUrl());

            Map<String, String> hero = new HashMap<>();
            hero.put("title", "Hi, I'm " + user.getName());
            hero.put("subtitle", "Full Stack Developer. Building modern scalable applications and AI-driven solutions.");
            hero.put("ctaText", "View Projects");
            contentMap.put("hero", hero);

            Map<String, String> about = new HashMap<>();
            about.put("bio", String.format("I am a passionate software engineer specializing in modern web ecosystems. Using frameworks like React and Spring Boot, I create seamless client-facing products and secure APIs. Connect with me to discuss design systems or server scalability.", user.getName()));
            contentMap.put("about", about);

            // Add projects (AI parsed descriptions)
            List<Map<String, Object>> portfolioProjects = new ArrayList<>();
            for (Repository repo : repos) {
                Map<String, Object> proj = new HashMap<>();
                proj.put("id", repo.getId().toString());
                proj.put("title", repo.getRepoName());
                proj.put("language", repo.getLanguage());
                proj.put("stars", repo.getStars());

                // Read custom description if analyzed, else default
                String summary = repo.getDescription();
                if (repo.getAnalysisResult() != null) {
                    try {
                        Map analysisMap = objectMapper.readValue(repo.getAnalysisResult(), Map.class);
                        if (analysisMap.containsKey("projectDescription")) {
                            summary = (String) analysisMap.get("projectDescription");
                        }
                    } catch (Exception ignored) {}
                }
                proj.put("summary", summary != null ? summary : "Developer repository on GitHub.");
                portfolioProjects.add(proj);
            }
            contentMap.put("projects", portfolioProjects);

            // Add experiences placeholder
            List<Map<String, String>> experiences = new ArrayList<>();
            Map<String, String> expPlaceholder = new HashMap<>();
            expPlaceholder.put("role", "Software Engineer");
            expPlaceholder.put("company", "Tech Innovations Inc.");
            expPlaceholder.put("duration", "2023 - Present");
            expPlaceholder.put("description", "Designed and deployed backend REST APIs with Spring Boot. Managed database schemas and automated workflows.");
            experiences.add(expPlaceholder);
            contentMap.put("experiences", experiences);

            // Contact
            Map<String, String> contact = new HashMap<>();
            contact.put("email", user.getEmail() != null ? user.getEmail() : "hello@example.com");
            contact.put("github", "https://github.com/" + user.getGithubUsername());
            contact.put("linkedin", "https://linkedin.com/in/" + user.getGithubUsername());
            contact.put("twitter", "");
            contentMap.put("contact", contact);

            // Parse skills back into categories
            Map skillsMap;
            try {
                skillsMap = objectMapper.readValue(skillsJson, Map.class);
            } catch (Exception e) {
                skillsMap = new HashMap();
            }
            contentMap.put("skills", skillsMap);

            // Config SEO tags
            Map<String, String> seo = new HashMap<>();
            seo.put("title", user.getName() + " | Portfolio");
            seo.put("description", "Professional developer portfolio generated by DevPortfolio AI.");
            seo.put("keywords", "developer, portfolio, " + user.getGithubUsername() + ", react, spring boot");

            // Config Chatbot
            Map<String, String> chatbot = new HashMap<>();
            chatbot.put("welcomeMessage", "Hello! I am " + user.getName() + "'s virtual assistant. Ask me anything about their projects or experience!");
            chatbot.put("systemPrompt", "Be a helpful professional assistant. Focus on highlighting tech achievements.");

            Portfolio portfolio = Portfolio.builder()
                    .user(user)
                    .templateName(templateName)
                    .generatedContent(objectMapper.writeValueAsString(contentMap))
                    .seoTags(objectMapper.writeValueAsString(seo))
                    .chatbotSettings(objectMapper.writeValueAsString(chatbot))
                    .publishedUrl(user.getGithubUsername() + "-" + (1000 + (int)(Math.random() * 9000)))
                    .build();

            Portfolio saved = portfolioRepository.save(portfolio);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            log.error("Failed to build initial portfolio: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Portfolio builder error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePortfolio(@PathVariable UUID id, @RequestBody Map<String, Object> payload) {
        try {
            User user = getAuthenticatedUser();
            Optional<Portfolio> portfolioOpt = portfolioRepository.findById(id);

            if (portfolioOpt.isEmpty() || !portfolioOpt.get().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Portfolio portfolio = portfolioOpt.get();

            if (payload.containsKey("templateName")) {
                portfolio.setTemplateName((String) payload.get("templateName"));
            }
            if (payload.containsKey("generatedContent")) {
                portfolio.setGeneratedContent(objectMapper.writeValueAsString(payload.get("generatedContent")));
            }
            if (payload.containsKey("seoTags")) {
                portfolio.setSeoTags(objectMapper.writeValueAsString(payload.get("seoTags")));
            }
            if (payload.containsKey("chatbotSettings")) {
                portfolio.setChatbotSettings(objectMapper.writeValueAsString(payload.get("chatbotSettings")));
            }
            if (payload.containsKey("publishedUrl")) {
                portfolio.setPublishedUrl((String) payload.get("publishedUrl"));
            }

            Portfolio saved = portfolioRepository.save(portfolio);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Failed to update portfolio: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
