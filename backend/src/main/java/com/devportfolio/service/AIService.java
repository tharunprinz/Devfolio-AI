package com.devportfolio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AIService.class);


    @Value("${devportfolio.gemini.apiKey}")
    private String apiKey;

    @Value("${devportfolio.gemini.apiUrl}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private boolean isMockMode() {
        return apiKey == null || apiKey.trim().isEmpty() || "mock-mode-key".equalsIgnoreCase(apiKey);
    }

    /**
     * Helper to invoke Gemini API with a text prompt expecting a JSON response
     */
    private String callGemini(String prompt) {
        if (isMockMode()) {
            log.info("Gemini API key is missing or set to mock. Running in mock mode.");
            return null;
        }

        String targetUrl = apiUrl + "?key=" + apiKey;

        // Construct Gemini REST JSON Payload
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> partContainer = new HashMap<>();
        partContainer.put("parts", List.of(textPart));

        requestBody.put("contents", List.of(partContainer));

        // Request JSON formatting config
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("responseMimeType", "application/json");
        requestBody.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(targetUrl, entity, Map.class);
            Map responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List candidates = (List) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List parts = (List) content.get("parts");
                    if (!parts.isEmpty()) {
                        Map part = (Map) parts.get(0);
                        return (String) part.get("text");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to execute Gemini API call: {}", e.getMessage());
        }

        return null;
    }

    public String analyzeProject(String repoName, String originalDesc, String language, String readmeContent) {
        String prompt = String.format(
                "You are an AI code reviewer. Analyze this project repo details:\n" +
                "Repo Name: %s\n" +
                "Language: %s\n" +
                "Short Description: %s\n" +
                "README content: %s\n\n" +
                "Generate a JSON object containing:\n" +
                "- projectDescription (string, professional resume summary)\n" +
                "- keyFeatures (array of strings, features built)\n" +
                "- technologies (array of strings, technologies used)\n" +
                "- challenges (array of strings, technical challenges solved)\n" +
                "- improvements (array of strings, improvements that could be made)\n" +
                "- healthScore (int, score from 0-100 indicating project quality, readability, readme quality)",
                repoName, language, originalDesc, readmeContent != null ? readmeContent.substring(0, Math.min(readmeContent.length(), 2000)) : ""
        );

        String rawJson = callGemini(prompt);
        if (rawJson != null) {
            return rawJson;
        }

        // Return Mock Project Analysis
        int randomHealth = 70 + (int) (Math.random() * 25);
        return String.format(
                "{\n" +
                "  \"projectDescription\": \"Built a robust developer tool integrating %s with modern REST endpoints to simplify API integrations.\",\n" +
                "  \"keyFeatures\": [\n" +
                "    \"Automated content parsing pipelines\",\n" +
                "    \"State synchronization via JPA repositories\",\n" +
                "    \"Integrated unit testing coverage\"\n" +
                "  ],\n" +
                "  \"technologies\": [\"%s\", \"Spring Boot\", \"PostgreSQL\", \"Docker\"],\n" +
                "  \"challenges\": [\n" +
                "    \"Configuring reliable WebClient timeouts under network constraints\",\n" +
                "    \"Parsing unformatted metadata formats consistently\"\n" +
                "  ],\n" +
                "  \"improvements\": [\n" +
                "    \"Add caching layers using Redis\",\n" +
                "    \"Increase integration test suite coverage\"\n" +
                "  ],\n" +
                "  \"healthScore\": %d\n" +
                "}",
                language != null ? language : "Java",
                language != null ? language : "Java",
                randomHealth
        );
    }

    public String generateSkillExtraction(List<Map<String, Object>> repoDetails) {
        String prompt = "Review these developer repositories and languages: \n" +
                repoDetails.toString() + "\n\n" +
                "Generate a JSON object representing extracted skills grouped by areas:\n" +
                "{\n" +
                "  \"Frontend\": [\"skill1\", \"skill2\"],\n" +
                "  \"Backend\": [\"skill1\", \"skill2\"],\n" +
                "  \"Database\": [\"skill1\", \"skill2\"],\n" +
                "  \"DevOps\": [\"skill1\"],\n" +
                "  \"Cloud\": [\"skill1\"],\n" +
                "  \"AI_ML\": [\"skill1\"],\n" +
                "  \"Cybersecurity\": [\"skill1\"]\n" +
                "}";

        String rawJson = callGemini(prompt);
        if (rawJson != null) {
            return rawJson;
        }

        // Mock Skills
        return "{\n" +
                "  \"Frontend\": [\"React\", \"Vite\", \"Tailwind CSS\", \"Framer Motion\"],\n" +
                "  \"Backend\": [\"Spring Boot\", \"Spring Security\", \"Java\", \"JWT Authentication\"],\n" +
                "  \"Database\": [\"PostgreSQL\", \"JPA\", \"Hibernate\"],\n" +
                "  \"DevOps\": [\"Docker\", \"GitHub Actions\"],\n" +
                "  \"Cloud\": [\"AWS S3\", \"Vercel\"],\n" +
                "  \"AI_ML\": [\"Gemini API\", \"OpenAI API\"],\n" +
                "  \"Cybersecurity\": [\"JWT Security Encoding\"]\n" +
                "}";
    }

    public String generateCareerInsights(String githubUsername, String skillData, List<String> repoDescriptions) {
        String prompt = String.format(
                "Developer username: %s\n" +
                "Extracted skills: %s\n" +
                "Projects list: %s\n\n" +
                "Generate a JSON object representing career growth insights:\n" +
                "{\n" +
                "  \"strengths\": [\"strength1\", \"strength2\"],\n" +
                "  \"weaknesses\": [\"weakness1\", \"weakness2\"],\n" +
                "  \"recommendations\": [\"rec1\", \"rec2\"],\n" +
                "  \"skillGap\": {\n" +
                "     \"Frontend Developer\": {\"matchPercentage\": 85, \"missingSkills\": [\"TypeScript\"]},\n" +
                "     \"Fullstack Engineer\": {\"matchPercentage\": 90, \"missingSkills\": [\"Redis\"]},\n" +
                "     \"DevOps Specialist\": {\"matchPercentage\": 55, \"missingSkills\": [\"Kubernetes\", \"Terraform\"]}\n" +
                "  },\n" +
                "  \"personalBrandingScore\": 88,\n" +
                "  \"interviewReadinessScore\": 82\n" +
                "}",
                githubUsername, skillData, repoDescriptions
        );

        String rawJson = callGemini(prompt);
        if (rawJson != null) {
            return rawJson;
        }

        // Mock Career Insights
        return "{\n" +
                "  \"strengths\": [\n" +
                "    \"Solid expertise in backend Spring Boot service layers\",\n" +
                "    \"Proficient in modern fullstack React workflows\",\n" +
                "    \"Strong integration skills with secure RESTful endpoints\"\n" +
                "  ],\n" +
                "  \"weaknesses\": [\n" +
                "    \"Limited testing coverage in production source packages\",\n" +
                "    \"Absence of TypeScript configuration systems\",\n" +
                "    \"No caching or distributed pub-sub layers present\"\n" +
                "  ],\n" +
                "  \"recommendations\": [\n" +
                "    \"Obtain AWS Certified Solutions Architect Associate\",\n" +
                "    \"Build a project utilizing Redis caching and WebSocket syncs\",\n" +
                "    \"Refactor frontend state management using Redux or Zustand\"\n" +
                "  ],\n" +
                "  \"skillGap\": {\n" +
                "     \"Frontend Developer\": {\"matchPercentage\": 80, \"missingSkills\": [\"TypeScript\", \"Zustand\"]},\n" +
                "     \"Fullstack Engineer\": {\"matchPercentage\": 90, \"missingSkills\": [\"Redis\", \"Kubernetes\"]},\n" +
                "     \"DevOps Specialist\": {\"matchPercentage\": 50, \"missingSkills\": [\"Kubernetes\", \"Terraform\", \"Ansible\"]}\n" +
                "  },\n" +
                "  \"personalBrandingScore\": 85,\n" +
                "  \"interviewReadinessScore\": 78\n" +
                "}";
    }

    public String polishResume(String originalResumeJson, String feedbackInstructions) {
        String prompt = String.format(
                "You are an ATS-friendly resume reviewer. Enhance the wording of this resume to make it sound highly professional:\n" +
                "Resume JSON: %s\n" +
                "Feedback Instructions: %s\n\n" +
                "Return the complete updated resume JSON structure matching the input formatting precisely.",
                originalResumeJson, feedbackInstructions
        );

        String rawJson = callGemini(prompt);
        if (rawJson != null) {
            return rawJson;
        }

        return originalResumeJson; // Fallback to original
    }

    public String generateGitHubRoast(String githubUsername, List<Map<String, Object>> repoDetails) {
        String prompt = String.format(
                "You are a sarcastic, humorous coding AI. Write a hilarious, nerdy, witty roast about the GitHub profile for '%s' based on these repos: %s.\n" +
                "Keep it funny and friendly. Return a JSON object: { \"roast\": \"Your roast text here\" }",
                githubUsername, repoDetails
        );

        String rawJson = callGemini(prompt);
        if (rawJson != null) {
            return rawJson;
        }

        // Mock Roast
        return "{\n" +
                "  \"roast\": \"Wow, look at all these repos! 99% of your code looks like boilerplate generated by Spring Initializr, and the other 1% is console.log calls that you forgot to clean up. It is nice that your commit messages range from 'updates' to 'fixes', which is really helpful for anyone trying to understand your absolute lack of Git workflow. But hey, at least you have 2 stars! One from your mom, and one from your secondary GitHub account. Keep pushing empty READMEs!\"\n" +
                "}";
    }

    public String askChatbot(String developerProfile, String chatbotSettings, String question, List<Map<String, Object>> conversationHistory) {
        // Construct prompt with chat guidelines
        String prompt = String.format(
                "You are an interactive AI Chatbot embedded on the public portfolio of developer:\n" +
                "Profile: %s\n" +
                "Your Guidelines: %s\n" +
                "Conversation History: %s\n" +
                "User's Question: %s\n\n" +
                "Reply to the question as the developer's professional assistant. Be engaging, polite, and outline the developer's tech achievements. Return a JSON object with: { \"reply\": \"Your chatbot answer\" }",
                developerProfile, chatbotSettings, conversationHistory, question
        );

        String rawJson = callGemini(prompt);
        if (rawJson != null) {
            return rawJson;
        }

        return "{\n" +
                "  \"reply\": \"Thanks for checking out my page! I specialize in full stack development with React and Spring Boot. I would love to connect about potential roles!\"\n" +
                "}";
    }
}
