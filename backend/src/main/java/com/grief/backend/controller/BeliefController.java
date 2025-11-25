package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.BeliefEntryApi;
import com.grief.backend.generated.api.BeliefStatementApi;
import com.grief.backend.generated.model.dto.BeliefEntryDTO;
import com.grief.backend.service.BeliefService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class BeliefController implements BeliefStatementApi, BeliefEntryApi {

    private BeliefService beliefService;

    public BeliefController(BeliefService beliefService) {
        this.beliefService = beliefService;
    }

    @Override
    public ResponseEntity<List<String>> getBeliefStatements() {
        return ResponseEntity.ok().body(beliefService.getAllStatement());
    }

    @Override
    public ResponseEntity<Void> saveBeliefEntries(@Valid List<@Valid BeliefEntryDTO> beliefEntry) {
        try{
            beliefService.saveEntries(beliefEntry);
            return ResponseEntity.ok().build(); 
        } catch(Exception e) {
            log.error("Error while saving the entries", e);
        }

        return ResponseEntity.badRequest().build();
    }

    @Override
    public ResponseEntity<List<String>> saveBeliefStatements(@Valid List<String> requestBody) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'saveBeliefStatements'");
    }
    
}
