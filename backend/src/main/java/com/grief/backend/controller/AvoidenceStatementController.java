package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.AvoidenceStatementApi;
import com.grief.backend.service.AvoidenceStatementService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class AvoidenceStatementController implements AvoidenceStatementApi {

    private AvoidenceStatementService avoidenceStatementService;

    public AvoidenceStatementController(AvoidenceStatementService avoidenceStatementService) {
        this.avoidenceStatementService = avoidenceStatementService;
    }

    @Override
    public ResponseEntity<List<Object>> getAvoidenceStatements() {
        return ResponseEntity.ok().body(
            avoidenceStatementService.fetchAvoidenceStatements()
        );    
    }

    @Override
    public ResponseEntity<Void> saveAvoidenceStatements(@Valid List<String> requestBody) {
        try{
            avoidenceStatementService.saveAvoidenceStatements(requestBody);
            return ResponseEntity.ok().build();
        } catch(Exception e) {
            log.error("Error saving the statments {}", e.getMessage());
        }
        return ResponseEntity.badRequest().build();
    }
    
}
