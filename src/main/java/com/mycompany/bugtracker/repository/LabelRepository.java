package com.mycompany.bugtracker.repository;

import com.mycompany.bugtracker.domain.Label;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the Label entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LabelRepository extends ReactiveMongoRepository<Label, String> {}
