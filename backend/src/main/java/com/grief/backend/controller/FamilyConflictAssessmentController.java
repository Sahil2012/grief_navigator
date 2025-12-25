package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.FamilyConflictAssessmentApi;
import com.grief.backend.model.questions.FamilyConflictAssessmentCYGE;
import com.grief.backend.service.FamilyConflictAssessmentService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class FamilyConflictAssessmentController implements FamilyConflictAssessmentApi {

    private FamilyConflictAssessmentService service;

    public FamilyConflictAssessmentController(FamilyConflictAssessmentService service) {
        this.service = service;
    }

    @Override
    public ResponseEntity<Void> completeAssessment(@Valid Long assessmentId) {
        log.info("Request received for completeAssessment with assessmentId: {}", assessmentId);
        try {
            service.completeAssessment(assessmentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error completeing the assessement {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @Override
    public ResponseEntity<Object> getAssessment() {
        log.info("Request received for getAssessment");
        List<FamilyConflictAssessmentCYGE> assessments = service.getAllAssessmentsForUser();
        return ResponseEntity.ok(assessments);
    }

    @Override
    public ResponseEntity<Long> startAssessment() {
        log.info("Request received for startAssessment");
        try {
            return ResponseEntity.ok(service.createAssessment());
        } catch (Exception e) {
            log.error("Error creating an assessment {}", e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
