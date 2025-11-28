package com.grief.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.grief.backend.model.questions.FamilyConflictQuestions;

@Repository
public interface FamilyConflictRepository extends JpaRepository<FamilyConflictQuestions, Long>{
    
    @Query("SELECT q FROM FamilyConflictQuestions q WHERE q.sectionId = ?1")
    List<FamilyConflictQuestions> findQuestionForSection(String sectionId);
    
    @Query("SELECT q FROM FamilyConflictQuestions q WHERE q.sectionId = ?1 AND fieldId = ?2")
    FamilyConflictQuestions findQuestionByFeildIdForSection(String sectionId, String fieldId);
}
