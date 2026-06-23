package com.devportfolio.service;

import com.devportfolio.entity.Repository;
import com.devportfolio.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GitHubService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(GitHubService.class);


    @Value("${devportfolio.github.clientId}")
    private String clientId;

    @Value("${devportfolio.github.clientSecret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public String exchangeCodeForToken(String code) {
        String url = "https://github.com/login/oauth/access_token";

        Map<String, String> requestPayload = new HashMap<>();
        requestPayload.put("client_id", clientId);
        requestPayload.put("client_secret", clientSecret);
        requestPayload.put("code", code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestPayload, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("access_token")) {
                return (String) body.get("access_token");
            }
        } catch (Exception e) {
            log.error("Failed to exchange OAuth code for token: {}", e.getMessage());
        }

        return null;
    }

    public Map<String, Object> getUserProfile(String accessToken) {
        String url = "https://api.github.com/user";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to fetch GitHub profile: {}", e.getMessage());
        }
        return null;
    }

    public List<Repository> getUserRepositories(User user, String accessToken) {
        String url = "https://api.github.com/user/repos?per_page=100&type=owner&sort=updated";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        List<Repository> repoEntities = new ArrayList<>();

        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            List<Map<String, Object>> repos = response.getBody();
            if (repos != null) {
                for (Map<String, Object> repo : repos) {
                    Boolean isFork = (Boolean) repo.get("fork");
                    if (isFork != null && isFork) {
                        continue; // Focus on owner projects
                    }

                    String repoName = (String) repo.get("name");
                    String description = (String) repo.get("description");
                    String language = (String) repo.get("language");
                    Integer stars = (Integer) repo.get("stargazers_count");
                    Integer forks = (Integer) repo.get("forks_count");

                    repoEntities.add(Repository.builder()
                            .user(user)
                            .repoName(repoName)
                            .description(description)
                            .language(language)
                            .stars(stars)
                            .forks(forks)
                            .build());
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch repositories: {}", e.getMessage());
        }

        return repoEntities;
    }

    public String getRepositoryReadme(String username, String repoName, String accessToken) {
        String url = String.format("https://api.github.com/repos/%s/%s/readme", username, repoName);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.valueOf("application/vnd.github.raw"))); // Gets raw text readme directly!

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.warn("Failed to fetch README for repo {}: {}", repoName, e.getMessage());
        }
        return "";
    }

    public Map<String, Long> getRepositoryLanguages(String username, String repoName, String accessToken) {
        String url = String.format("https://api.github.com/repos/%s/%s/languages", username, repoName);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map<String, Long>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<Map<String, Long>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to fetch languages for repo {}: {}", repoName, e.getMessage());
        }
        return new HashMap<>();
    }
}
