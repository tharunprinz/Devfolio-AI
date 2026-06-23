package com.devportfolio.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "ai_insights")
public class AIInsight {

    @Id
    private UUID id;

    @DBRef(lazy = true)
    private User user;

    @Field("strengths")
    private String strengths;

    @Field("weaknesses")
    private String weaknesses;

    @Field("recommendations")
    private String recommendations;

    @Field("skill_gap")
    private String skillGap;

    @Field("personal_branding_score")
    private Integer personalBrandingScore;

    @Field("interview_readiness_score")
    private Integer interviewReadinessScore;

    @Field("created_at")
    private LocalDateTime createdAt;

    // Constructors
    public AIInsight() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
    }

    public AIInsight(UUID id, User user, String strengths, String weaknesses, String recommendations, String skillGap, Integer personalBrandingScore, Integer interviewReadinessScore, LocalDateTime createdAt) {
        this.id = id != null ? id : UUID.randomUUID();
        this.user = user;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.recommendations = recommendations;
        this.skillGap = skillGap;
        this.personalBrandingScore = personalBrandingScore;
        this.interviewReadinessScore = interviewReadinessScore;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }

    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public String getSkillGap() { return skillGap; }
    public void setSkillGap(String skillGap) { this.skillGap = skillGap; }

    public Integer getPersonalBrandingScore() { return personalBrandingScore; }
    public void setPersonalBrandingScore(Integer personalBrandingScore) { this.personalBrandingScore = personalBrandingScore; }

    public Integer getInterviewReadinessScore() { return interviewReadinessScore; }
    public void setInterviewReadinessScore(Integer interviewReadinessScore) { this.interviewReadinessScore = interviewReadinessScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static AIInsightBuilder builder() {
        return new AIInsightBuilder();
    }

    public static class AIInsightBuilder {
        private UUID id;
        private User user;
        private String strengths;
        private String weaknesses;
        private String recommendations;
        private String skillGap;
        private Integer personalBrandingScore;
        private Integer interviewReadinessScore;
        private LocalDateTime createdAt;

        public AIInsightBuilder id(UUID id) { this.id = id; return this; }
        public AIInsightBuilder user(User user) { this.user = user; return this; }
        public AIInsightBuilder strengths(String strengths) { this.strengths = strengths; return this; }
        public AIInsightBuilder weaknesses(String weaknesses) { this.weaknesses = weaknesses; return this; }
        public AIInsightBuilder recommendations(String recommendations) { this.recommendations = recommendations; return this; }
        public AIInsightBuilder skillGap(String skillGap) { this.skillGap = skillGap; return this; }
        public AIInsightBuilder personalBrandingScore(Integer personalBrandingScore) { this.personalBrandingScore = personalBrandingScore; return this; }
        public AIInsightBuilder interviewReadinessScore(Integer interviewReadinessScore) { this.interviewReadinessScore = interviewReadinessScore; return this; }
        public AIInsightBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AIInsight build() {
            UUID finalId = id != null ? id : UUID.randomUUID();
            LocalDateTime finalCreatedAt = createdAt != null ? createdAt : LocalDateTime.now();
            return new AIInsight(finalId, user, strengths, weaknesses, recommendations, skillGap, personalBrandingScore, interviewReadinessScore, finalCreatedAt);
        }
    }
}
