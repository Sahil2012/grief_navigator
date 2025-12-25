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

    public FamilyConflictAssessmentCYGE getAssessmentById(Long assessmentId) {
        log.info("Executing getAssessmentById with args: {}", assessmentId);
        return repository.findById(assessmentId).get();
    }

    public Long createAssessment() {
        log.info("Executing createAssessment");
        AppUser appUser = currentUser.getCurrentAppUser();

        FamilyConflictAssessmentCYGE assessment = repository.save(FamilyConflictAssessmentCYGE.builder()
                .appUser(appUser)
                .status(STATUS_IN_PROGRESS)
                .startedAt(OffsetDateTime.now())
                .build());

        return assessment != null ? assessment.getId() : -1L;
    }

    public void completeAssessment(Long assessmentId) {
        log.info("Executing completeAssessment with args: {}", assessmentId);
        AppUser appUser = currentUser.getCurrentAppUser();

        repository.completeAssessment(assessmentId, appUser.getId());
    }

    public List<FamilyConflictAssessmentCYGE> getAllAssessmentsForUser() {
        log.info("Executing getAllAssessmentsForUser");
        AppUser appUser = currentUser.getCurrentAppUser();

        return repository.getAssessments(appUser.getId());
    }
}
