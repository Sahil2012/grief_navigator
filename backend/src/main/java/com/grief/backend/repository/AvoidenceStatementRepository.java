package com.grief.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grief.backend.model.questions.AvoidanceStatement;

@Repository
public interface AvoidenceStatementRepository extends JpaRepository<AvoidanceStatement,Long> {
    
}
