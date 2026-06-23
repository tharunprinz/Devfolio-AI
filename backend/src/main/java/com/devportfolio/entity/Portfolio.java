package com.devportfolio.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "portfolios")
public class Portfolio {

    @Id
    private UUID id;

    @DBRef(lazy = true)
    private User user;

    @Field("template_name")
    private String templateName;

    @Field("generated_content")
    private String generatedContent;

    @Indexed(unique = true)
    @Field("published_url")
    private String publishedUrl;

    @Field("seo_tags")
    private String seoTags;

    @Field("chatbot_settings")
    private String chatbotSettings;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Portfolio() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Portfolio(UUID id, User user, String templateName, String generatedContent, String publishedUrl, String seoTags, String chatbotSettings, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id != null ? id : UUID.randomUUID();
        this.user = user;
        this.templateName = templateName;
        this.generatedContent = generatedContent;
        this.publishedUrl = publishedUrl;
        this.seoTags = seoTags;
        this.chatbotSettings = chatbotSettings;
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

    public String getGeneratedContent() { return generatedContent; }
    public void setGeneratedContent(String generatedContent) { this.generatedContent = generatedContent; }

    public String getPublishedUrl() { return publishedUrl; }
    public void setPublishedUrl(String publishedUrl) { this.publishedUrl = publishedUrl; }

    public String getSeoTags() { return seoTags; }
    public void setSeoTags(String seoTags) { this.seoTags = seoTags; }

    public String getChatbotSettings() { return chatbotSettings; }
    public void setChatbotSettings(String chatbotSettings) { this.chatbotSettings = chatbotSettings; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static PortfolioBuilder builder() {
        return new PortfolioBuilder();
    }

    public static class PortfolioBuilder {
        private UUID id;
        private User user;
        private String templateName;
        private String generatedContent;
        private String publishedUrl;
        private String seoTags;
        private String chatbotSettings;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PortfolioBuilder id(UUID id) { this.id = id; return this; }
        public PortfolioBuilder user(User user) { this.user = user; return this; }
        public PortfolioBuilder templateName(String templateName) { this.templateName = templateName; return this; }
        public PortfolioBuilder generatedContent(String generatedContent) { this.generatedContent = generatedContent; return this; }
        public PortfolioBuilder publishedUrl(String publishedUrl) { this.publishedUrl = publishedUrl; return this; }
        public PortfolioBuilder seoTags(String seoTags) { this.seoTags = seoTags; return this; }
        public PortfolioBuilder chatbotSettings(String chatbotSettings) { this.chatbotSettings = chatbotSettings; return this; }
        public PortfolioBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PortfolioBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Portfolio build() {
            UUID finalId = id != null ? id : UUID.randomUUID();
            LocalDateTime finalCreatedAt = createdAt != null ? createdAt : LocalDateTime.now();
            LocalDateTime finalUpdatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
            return new Portfolio(finalId, user, templateName, generatedContent, publishedUrl, seoTags, chatbotSettings, finalCreatedAt, finalUpdatedAt);
        }
    }
}
