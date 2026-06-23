package com.devportfolio.repository;

import com.devportfolio.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RepositoryRepository extends MongoRepository<com.devportfolio.entity.Repository, UUID> {
    @Query("{ 'user.$id': ?0 }")
    List<com.devportfolio.entity.Repository> findByUserId(UUID userId);
    
    Optional<com.devportfolio.entity.Repository> findByUserAndRepoName(User user, String repoName);
}
