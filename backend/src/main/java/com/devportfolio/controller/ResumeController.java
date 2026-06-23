package com.devportfolio.controller;

import com.devportfolio.entity.Repository;
import com.devportfolio.entity.Resume;
import com.devportfolio.entity.User;
import com.devportfolio.repository.RepositoryRepository;
import com.devportfolio.repository.ResumeRepository;
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
@RequestMapping("/api/resumes")
public class ResumeController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ResumeController.class);


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

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
    public ResponseEntity<List<Resume>> getMyResumes() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(resumeRepository.findByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResumeById(@PathVariable UUID id) {
        User user = getAuthenticatedUser();
        Optional<Resume> resumeOpt = resumeRepository.findById(id);

        if (resumeOpt.isEmpty() || !resumeOpt.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(resumeOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createInitialResume(@RequestBody Map<String, String> requestParams) {
        try {
            User user = getAuthenticatedUser();
            String templateName = requestParams.getOrDefault("templateName", "modern");

            log.info("Generating initial resume for user {} with template {}", user.getGithubUsername(), templateName);

            // Fetch synced repos for resume projects
            List<Repository> repos = repositoryRepository.findByUserId(user.getId());
            List<Map<String, Object>> repoDetails = new ArrayList<>();
            for (Repository repo : repos) {
                Map<String, Object> details = new HashMap<>();
                details.put("name", repo.getRepoName());
                details.put("language", repo.getLanguage());
                details.put("description", repo.getDescription());
                repoDetails.add(details);
            }

            // Extract skills
            String skillsJson = aiService.generateSkillExtraction(repoDetails);
            Map skillsMap;
            try {
                skillsMap = objectMapper.readValue(skillsJson, Map.class);
            } catch (Exception e) {
                skillsMap = new HashMap();
            }

            // Structure Resume JSON
            Map<String, Object> resumeMap = new HashMap<>();
            
            // Header Info
            Map<String, String> header = new HashMap<>();
            header.put("name", user.getName());
            header.put("email", user.getEmail() != null ? user.getEmail() : "hello@example.com");
            header.put("phone", "+1 (555) 019-2834");
            header.put("location", "San Francisco, CA");
            header.put("github", "github.com/" + user.getGithubUsername());
            header.put("website", "portfolio.dev/" + user.getGithubUsername());
            resumeMap.put("header", header);

            // Summary
            resumeMap.put("summary", "Driven Software Engineer with experience designing and optimizing full stack web applications. Skilled in leveraging backend services and React clients to deliver high-performance user interfaces.");

            // Skills
            resumeMap.put("skills", skillsMap);

            // Projects
            List<Map<String, Object>> resumeProjects = new ArrayList<>();
            for (Repository repo : repos) {
                Map<String, Object> proj = new HashMap<>();
                proj.put("title", repo.getRepoName());
                proj.put("role", "Lead Developer");
                proj.put("technologies", repo.getLanguage() != null ? List.of(repo.getLanguage()) : List.of());
                
                String summary = repo.getDescription();
                if (repo.getAnalysisResult() != null) {
                    try {
                        Map analysisMap = objectMapper.readValue(repo.getAnalysisResult(), Map.class);
                        if (analysisMap.containsKey("projectDescription")) {
                            summary = (String) analysisMap.get("projectDescription");
                        }
                    } catch (Exception ignored) {}
                }
                proj.put("bullets", List.of(summary != null ? summary : "Maintained and synced source codes in Java/React environment."));
                resumeProjects.add(proj);
            }
            resumeMap.put("projects", resumeProjects);

            // Experience
            List<Map<String, Object>> experiences = new ArrayList<>();
            Map<String, Object> job = new HashMap<>();
            job.put("role", "Software Engineer");
            job.put("company", "Enterprise Solved");
            job.put("location", "San Francisco, CA");
            job.put("dates", "Jan 2024 - Present");
            job.put("bullets", List.of(
                    "Pioneered development of Java API systems reducing query latencies by 25%.",
                    "Collaborated with UX teams to deliver highly interactive dashboards using React and CSS filters."
            ));
            experiences.add(job);
            resumeMap.put("experience", experiences);

            // Education
            List<Map<String, String>> education = new ArrayList<>();
            Map<String, String> edu = new HashMap<>();
            edu.put("degree", "Bachelor of Science in Computer Science");
            edu.put("institution", "State University");
            edu.put("dates", "2020 - 2024");
            education.add(edu);
            resumeMap.put("education", education);

            // Certifications
            List<String> certs = List.of(
                    "AWS Certified Cloud Practitioner",
                    "Oracle Certified Professional Java SE"
            );
            resumeMap.put("certifications", certs);

            Resume resume = Resume.builder()
                    .user(user)
                    .templateName(templateName)
                    .generatedResume(objectMapper.writeValueAsString(resumeMap))
                    .build();

            Resume saved = resumeRepository.save(resume);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Failed to generate initial resume: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResume(@PathVariable UUID id, @RequestBody Map<String, Object> payload) {
        try {
            User user = getAuthenticatedUser();
            Optional<Resume> resumeOpt = resumeRepository.findById(id);

            if (resumeOpt.isEmpty() || !resumeOpt.get().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Resume resume = resumeOpt.get();

            if (payload.containsKey("templateName")) {
                resume.setTemplateName((String) payload.get("templateName"));
            }
            if (payload.containsKey("generatedResume")) {
                resume.setGeneratedResume(objectMapper.writeValueAsString(payload.get("generatedResume")));
            }

            Resume saved = resumeRepository.save(resume);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Failed to update resume: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/polish")
    public ResponseEntity<?> polishResumeContent(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        try {
            User user = getAuthenticatedUser();
            Optional<Resume> resumeOpt = resumeRepository.findById(id);

            if (resumeOpt.isEmpty() || !resumeOpt.get().getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Resume resume = resumeOpt.get();
            String instructions = body.getOrDefault("instructions", "Improve professional phrasing and readability.");

            log.info("Polishing resume {} with instructions: {}", id, instructions);

            String polishedJson = aiService.polishResume(resume.getGeneratedResume(), instructions);
            resume.setGeneratedResume(polishedJson);

            Resume saved = resumeRepository.save(resume);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            log.error("Failed to polish resume contents: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
