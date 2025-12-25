package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.FamilyConflictApi;
import com.grief.backend.generated.model.dto.FamilyConflictAnswerDTO;
import com.grief.backend.generated.model.dto.FamilyConflictQuestionDTO;
import com.grief.backend.service.FamilyConflictService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class FamilyConflictController implements FamilyConflictApi {

    private FamilyConflictService familyConflictService;

    public FamilyConflictController(FamilyConflictService familyConflictService) {
        this.familyConflictService = familyConflictService;
    }

    @Override
    public ResponseEntity<Void> saveQuestions(@Valid List<@Valid FamilyConflictQuestionDTO> familyConflictQuestionDTO) {
        log.info("Request received for saveQuestions with payload: {}", familyConflictQuestionDTO);

        try {
            familyConflictService.saveQuestions(familyConflictQuestionDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error saving Questions {}", e.getMessage());
        }
        return ResponseEntity.badRequest().build();
    }

    @Override
    public ResponseEntity<List<FamilyConflictQuestionDTO>> getQuestions(String sectionId, @Valid String fieldId) {
        log.info("Request received for getQuestions with sectionId: {} and fieldId: {}", sectionId, fieldId);
        return ResponseEntity.ok().body(familyConflictService.fetchQuestions(sectionId, fieldId));
    }

    @Override
    public ResponseEntity<Void> saveAnswers(@Valid List<@Valid FamilyConflictAnswerDTO> familyConflictAnswerDTO) {
        log.info("Request received for saveAnswers with payload: {}", familyConflictAnswerDTO);
        try {
            familyConflictService.saveAnswers(familyConflictAnswerDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error saving Answers {}", e.getMessage());
        }
        return ResponseEntity.internalServerError().build();
    }

}
