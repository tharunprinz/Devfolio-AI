package com.devportfolio.service;

import com.devportfolio.entity.User;
import com.devportfolio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(UserService.class);


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GitHubService gitHubService;

    @Transactional
    public User processGitHubLogin(String githubToken) {
        Map<String, Object> profile = gitHubService.getUserProfile(githubToken);
        if (profile == null || !profile.containsKey("login")) {
            throw new IllegalArgumentException("Invalid GitHub token or profile cannot be fetched");
        }

        String username = (String) profile.get("login");
        String name = (String) profile.get("name");
        String email = (String) profile.get("email");
        String avatarUrl = (String) profile.get("avatar_url");

        if (name == null || name.isBlank()) {
            name = username;
        }

        Optional<User> existingUserOpt = userRepository.findByGithubUsername(username);
        User user;

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            user.setName(name);
            user.setEmail(email);
            user.setAvatarUrl(avatarUrl);
            user.setGithubToken(githubToken); // Refresh token
            log.info("Updating existing user: {}", username);
        } else {
            user = User.builder()
                    .githubUsername(username)
                    .name(name)
                    .email(email)
                    .avatarUrl(avatarUrl)
                    .githubToken(githubToken)
                    .build();
            log.info("Creating new user: {}", username);
        }

        return userRepository.save(user);
    }
}
