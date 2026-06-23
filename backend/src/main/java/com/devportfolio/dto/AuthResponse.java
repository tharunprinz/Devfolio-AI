package com.devportfolio.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String name;
    private String avatarUrl;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, String username, String name, String avatarUrl) {
        this.token = token;
        this.username = username;
        this.name = name;
        this.avatarUrl = avatarUrl;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    // Builder
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private String username;
        private String name;
        private String avatarUrl;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder username(String username) { this.username = username; return this; }
        public AuthResponseBuilder name(String name) { this.name = name; return this; }
        public AuthResponseBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, username, name, avatarUrl);
        }
    }
}
