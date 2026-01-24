package com.grief.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.GriefDerailerApi;
import com.grief.backend.generated.model.dto.GriefDerailerDTO;
import com.grief.backend.service.GriefDerailerService;

import jakarta.validation.Valid;

@RestController
public class GriefDerailerController implements GriefDerailerApi {

    private GriefDerailerService griefDerailerService;

    public GriefDerailerController(GriefDerailerService griefDerailerService) {
        this.griefDerailerService = griefDerailerService;
    }

    @Override
    public ResponseEntity<Void> createGriefDerailer(@Valid GriefDerailerDTO griefDerailerDTO) {
        griefDerailerService.createGriefDerailer(griefDerailerDTO);
        return ResponseEntity.ok().build();
    }

}
