package com.grief.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.SupportToolApi;
import com.grief.backend.generated.model.dto.SupportToolDTO;
import com.grief.backend.service.SupportToolService;

import jakarta.validation.Valid;

@RestController
public class SupportToolController implements SupportToolApi {

    private SupportToolService supportToolService;

    public SupportToolController(SupportToolService supportToolService) {
        this.supportToolService = supportToolService;
    }

    @Override
    public ResponseEntity<Void> createSupportTool(@Valid SupportToolDTO supportToolDTO) {
        supportToolService.createSupportTool(supportToolDTO);
        return ResponseEntity.ok().build();
    }

}
