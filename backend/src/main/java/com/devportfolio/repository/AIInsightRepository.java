package com.devportfolio.repository;

import com.devportfolio.entity.AIInsight;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AIInsightRepository extends MongoRepository<AIInsight, UUID> {
    @Query("{ 'user.$id': ?0 }")
    Optional<AIInsight> findByUserId(UUID userId);
}
