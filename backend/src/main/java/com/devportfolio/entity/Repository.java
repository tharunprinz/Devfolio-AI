package com.devportfolio.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "repositories")
public class Repository {

    @Id
    private UUID id;

    @DBRef(lazy = true)
    private User user;

    @Field("repo_name")
    private String repoName;

    @Field("description")
    private String description;

    @Field("language")
    private String language;

    @Field("stars")
    private Integer stars;

    @Field("forks")
    private Integer forks;

    @Field("readme_content")
    private String readmeContent;

    @Field("analysis_result")
    private String analysisResult;

    @Field("health_score")
    private Integer healthScore;

    @Field("created_at")
    private LocalDateTime createdAt;

    // Constructors
    public Repository() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
    }

    public Repository(UUID id, User user, String repoName, String description, String language, Integer stars, Integer forks, String readmeContent, String analysisResult, Integer healthScore, LocalDateTime createdAt) {
        this.id = id != null ? id : UUID.randomUUID();
        this.user = user;
        this.repoName = repoName;
        this.description = description;
        this.language = language;
        this.stars = stars;
        this.forks = forks;
        this.readmeContent = readmeContent;
        this.analysisResult = analysisResult;
        this.healthScore = healthScore;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRepoName() { return repoName; }
    public void setRepoName(String repoName) { this.repoName = repoName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }

    public Integer getForks() { return forks; }
    public void setForks(Integer forks) { this.forks = forks; }

    public String getReadmeContent() { return readmeContent; }
    public void setReadmeContent(String readmeContent) { this.readmeContent = readmeContent; }

    public String getAnalysisResult() { return analysisResult; }
    public void setAnalysisResult(String analysisResult) { this.analysisResult = analysisResult; }

    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static RepositoryBuilder builder() {
        return new RepositoryBuilder();
    }

    public static class RepositoryBuilder {
        private UUID id;
        private User user;
        private String repoName;
        private String description;
        private String language;
        private Integer stars;
        private Integer forks;
        private String readmeContent;
        private String analysisResult;
        private Integer healthScore;
        private LocalDateTime createdAt;

        public RepositoryBuilder id(UUID id) { this.id = id; return this; }
        public RepositoryBuilder user(User user) { this.user = user; return this; }
        public RepositoryBuilder repoName(String repoName) { this.repoName = repoName; return this; }
        public RepositoryBuilder description(String description) { this.description = description; return this; }
        public RepositoryBuilder language(String language) { this.language = language; return this; }
        public RepositoryBuilder stars(Integer stars) { this.stars = stars; return this; }
        public RepositoryBuilder forks(Integer forks) { this.forks = forks; return this; }
        public RepositoryBuilder readmeContent(String readmeContent) { this.readmeContent = readmeContent; return this; }
        public RepositoryBuilder analysisResult(String analysisResult) { this.analysisResult = analysisResult; return this; }
        public RepositoryBuilder healthScore(Integer healthScore) { this.healthScore = healthScore; return this; }
        public RepositoryBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Repository build() {
            UUID finalId = id != null ? id : UUID.randomUUID();
            LocalDateTime finalCreatedAt = createdAt != null ? createdAt : LocalDateTime.now();
            return new Repository(finalId, user, repoName, description, language, stars, forks, readmeContent, analysisResult, healthScore, finalCreatedAt);
        }
    }
}
