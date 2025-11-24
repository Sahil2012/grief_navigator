package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.BeliefStatementApi;
import com.grief.backend.service.BeliefService;

import jakarta.annotation.security.PermitAll;

@RestController
public class BeliefController implements BeliefStatementApi {

    private BeliefService beliefService;

    public BeliefController(BeliefService beliefService) {
        this.beliefService = beliefService;
    }

    @PermitAll
    @Override
    public ResponseEntity<List<String>> getBeliefStatements() {
        return ResponseEntity.ok().body(beliefService.getAllStatement());
    }
    
}
