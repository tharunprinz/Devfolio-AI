package com.devportfolio.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "users")
public class User {

    @Id
    private UUID id;

    @Indexed(unique = true)
    @Field("github_username")
    private String githubUsername;

    @Field("name")
    private String name;

    @Field("email")
    private String email;

    @Field("avatar_url")
    private String avatarUrl;

    @Field("github_token")
    private String githubToken;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public User() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public User(UUID id, String githubUsername, String name, String email, String avatarUrl, String githubToken, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id != null ? id : UUID.randomUUID();
        this.githubUsername = githubUsername;
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.githubToken = githubToken;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getGithubUsername() { return githubUsername; }
    public void setGithubUsername(String githubUsername) { this.githubUsername = githubUsername; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getGithubToken() { return githubToken; }
    public void setGithubToken(String githubToken) { this.githubToken = githubToken; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private UUID id;
        private String githubUsername;
        private String name;
        private String email;
        private String avatarUrl;
        private String githubToken;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public UserBuilder id(UUID id) { this.id = id; return this; }
        public UserBuilder githubUsername(String githubUsername) { this.githubUsername = githubUsername; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public UserBuilder githubToken(String githubToken) { this.githubToken = githubToken; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public User build() {
            UUID finalId = id != null ? id : UUID.randomUUID();
            LocalDateTime finalCreatedAt = createdAt != null ? createdAt : LocalDateTime.now();
            LocalDateTime finalUpdatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
            return new User(finalId, githubUsername, name, email, avatarUrl, githubToken, finalCreatedAt, finalUpdatedAt);
        }
    }
}
