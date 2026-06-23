package com.devportfolio.controller;

import com.devportfolio.entity.Portfolio;
import com.devportfolio.repository.PortfolioRepository;
import com.devportfolio.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/public/portfolios")
public class PublicPortfolioController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(PublicPortfolioController.class);


    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private AIService aiService;

    @GetMapping("/{publishedUrl}")
    public ResponseEntity<?> getPublicPortfolio(@PathVariable String publishedUrl) {
        log.info("Public view request for portfolio URL: {}", publishedUrl);
        Optional<Portfolio> portfolioOpt = portfolioRepository.findByPublishedUrl(publishedUrl);
        if (portfolioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Portfolio not found");
        }
        return ResponseEntity.ok(portfolioOpt.get());
    }

    @PostMapping("/{publishedUrl}/chat")
    public ResponseEntity<?> queryPortfolioChatbot(
            @PathVariable String publishedUrl,
            @RequestBody Map<String, Object> payload) {
        
        Optional<Portfolio> portfolioOpt = portfolioRepository.findByPublishedUrl(publishedUrl);
        if (portfolioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Portfolio not found");
        }

        Portfolio portfolio = portfolioOpt.get();
        String question = (String) payload.get("question");
        List<Map<String, Object>> history = (List<Map<String, Object>>) payload.get("history");

        if (question == null || question.isBlank()) {
            return ResponseEntity.badRequest().body("Question cannot be empty");
        }

        try {
            log.info("Chatbot query received for portfolio: {}, question: {}", publishedUrl, question);
            
            // Pass the details directly to the AI Chatbot handler
            String responseJson = aiService.askChatbot(
                    portfolio.getGeneratedContent(),
                    portfolio.getChatbotSettings(),
                    question,
                    history != null ? history : List.of()
            );

            return ResponseEntity.ok(responseJson);
        } catch (Exception e) {
            log.error("Failed to query portfolio chatbot: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Chatbot query error: " + e.getMessage());
        }
    }
}
