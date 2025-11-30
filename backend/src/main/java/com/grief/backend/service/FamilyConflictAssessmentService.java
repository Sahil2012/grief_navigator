package com.grief.backend.service;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.questions.FamilyConflictAssessmentCYGE;
import com.grief.backend.repository.FamilyConflictAssessmentRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FamilyConflictAssessmentService {
    
    private FamilyConflictAssessmentRepository repository;
    private CurrentUser currentUser;

    private final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    
    public FamilyConflictAssessmentService(FamilyConflictAssessmentRepository repository, CurrentUser currentUser) {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public Long createAssessment() {
        AppUser appUser = currentUser.getCurrentAppUser();

        FamilyConflictAssessmentCYGE assessment = repository.save(FamilyConflictAssessmentCYGE.builder()
                            .appUser(appUser)
                            .status(STATUS_IN_PROGRESS)
                            .startedAt(OffsetDateTime.now())
                            .build());

        return assessment != null ? assessment.getId() : -1L;
    }

    public void completeAssessment(Long assessmentId) {
        AppUser appUser = currentUser.getCurrentAppUser();

        repository.completeAssessment(assessmentId, appUser.getId());
    }

    public List<FamilyConflictAssessmentCYGE> getAllAssessmentsForUser() {
        AppUser appUser = currentUser.getCurrentAppUser();

        return repository.getAssessments(appUser.getId());
    }
}
