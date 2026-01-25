package com.grief.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.GriefMilestoneApi;
import com.grief.backend.generated.model.dto.GriefMilestoneDTO;
import com.grief.backend.service.GriefMilestoneService;

import jakarta.validation.Valid;

@RestController
public class GriefMilestoneController implements GriefMilestoneApi {

    private GriefMilestoneService griefMilestoneService;

    public GriefMilestoneController(GriefMilestoneService griefMilestoneService) {
        this.griefMilestoneService = griefMilestoneService;
    }

    @Override
    public ResponseEntity<Void> createGriefMilestone(@Valid GriefMilestoneDTO griefMilestoneDTO) {
        griefMilestoneService.createGriefMilestone(griefMilestoneDTO);
        return ResponseEntity.ok().build();
    }

}
