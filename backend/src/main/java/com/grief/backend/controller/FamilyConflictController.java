package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.FamilyConflictApi;
import com.grief.backend.generated.model.dto.FamilyConflictQuestionDTO;
import com.grief.backend.generated.model.dto.FamilyConflictShallowQuestionDTO;
import com.grief.backend.service.FamilyConflictService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class FamilyConflictController implements FamilyConflictApi{
    
    private FamilyConflictService familyConflictService;

    public FamilyConflictController(FamilyConflictService familyConflictService){
        this.familyConflictService = familyConflictService;
    }

    @Override
    public ResponseEntity<List<FamilyConflictShallowQuestionDTO>> getQuestions(String sectionId,
            @Valid String fieldId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getQuestions'");
    }

    @Override
    public ResponseEntity<Void> saveQuestions(@Valid List<@Valid FamilyConflictQuestionDTO> familyConflictQuestionDTO) {
        
        try{
            familyConflictService.saveQuestions(familyConflictQuestionDTO);
            return ResponseEntity.ok().build();
        } catch(Exception e) {
            log.error("Error saving Questions {}", e.getMessage());
        }
        return ResponseEntity.badRequest().build();
    }
    
}
