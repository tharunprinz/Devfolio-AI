package com.devportfolio.repository;

import com.devportfolio.entity.Portfolio;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PortfolioRepository extends MongoRepository<Portfolio, UUID> {
    @Query("{ 'user.$id': ?0 }")
    List<Portfolio> findByUserId(UUID userId);
    
    Optional<Portfolio> findByPublishedUrl(String publishedUrl);
}
