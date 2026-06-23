package com.devportfolio.repository;

import com.devportfolio.entity.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResumeRepository extends MongoRepository<Resume, UUID> {
    @Query("{ 'user.$id': ?0 }")
    List<Resume> findByUserId(UUID userId);
}
