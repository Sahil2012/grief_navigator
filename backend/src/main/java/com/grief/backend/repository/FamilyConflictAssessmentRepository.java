package com.grief.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.grief.backend.model.questions.FamilyConflictAssessmentCYGE;

import jakarta.transaction.Transactional;

@Repository
public interface FamilyConflictAssessmentRepository extends JpaRepository<FamilyConflictAssessmentCYGE, Long>{
    
    @Modifying
    @Transactional
    @Query("UPDATE FamilyConflictAssessmentCYGE fa SET fa.status = 'COMPLETE' WHERE fa.id = ?1 AND fa.appUser.id = ?2")
    public int completeAssessment(Long assessmentId, Long userId);

    @Query("SELECT fa FROM FamilyConflictAssessmentCYGE fa WHERE fa.appUser.id = ?1")
    public List<FamilyConflictAssessmentCYGE> getAssessments(Long userId);
}
