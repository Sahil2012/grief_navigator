package com.grief.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.SanctuaryPlanApi;
import com.grief.backend.generated.model.dto.SanctuaryPlanDTO;
import com.grief.backend.service.SanctuaryPlanService;

import jakarta.validation.Valid;

@RestController
public class SancturyController implements SanctuaryPlanApi {

    private SanctuaryPlanService sanctuaryPlanService;

    public SancturyController(SanctuaryPlanService sanctuaryPlanService) {
        this.sanctuaryPlanService = sanctuaryPlanService;
    }

    @Override
    public ResponseEntity<Void> createSanctuaryPlan(SanctuaryPlanDTO sanctuaryPlanDTO) {
        sanctuaryPlanService.createSanctuaryPlan(sanctuaryPlanDTO);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<SanctuaryPlanDTO> updateSanctuaryPlan(Long id, @Valid SanctuaryPlanDTO sanctuaryPlanDTO) {
        sanctuaryPlanService.updateSanctuaryPlan(id, sanctuaryPlanDTO);
        return ResponseEntity.ok().build();
    }

}
