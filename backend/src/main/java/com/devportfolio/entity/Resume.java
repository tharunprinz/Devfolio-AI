package com.devportfolio.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "resumes")
public class Resume {

    @Id
    private UUID id;

    @DBRef(lazy = true)
    private User user;

    @Field("template_name")
    private String templateName;

    @Field("generated_resume")
    private String generatedResume;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Resume() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Resume(UUID id, User user, String templateName, String generatedResume, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id != null ? id : UUID.randomUUID();
        this.user = user;
        this.templateName = templateName;
        this.generatedResume = generatedResume;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }

    public String getGeneratedResume() { return generatedResume; }
    public void setGeneratedResume(String generatedResume) { this.generatedResume = generatedResume; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static ResumeBuilder builder() {
        return new ResumeBuilder();
    }

    public static class ResumeBuilder {
        private UUID id;
        private User user;
        private String templateName;
        private String generatedResume;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ResumeBuilder id(UUID id) { this.id = id; return this; }
        public ResumeBuilder user(User user) { this.user = user; return this; }
        public ResumeBuilder templateName(String templateName) { this.templateName = templateName; return this; }
        public ResumeBuilder generatedResume(String generatedResume) { this.generatedResume = generatedResume; return this; }
        public ResumeBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ResumeBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Resume build() {
            UUID finalId = id != null ? id : UUID.randomUUID();
            LocalDateTime finalCreatedAt = createdAt != null ? createdAt : LocalDateTime.now();
            LocalDateTime finalUpdatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
            return new Resume(finalId, user, templateName, generatedResume, finalCreatedAt, finalUpdatedAt);
        }
    }
}
