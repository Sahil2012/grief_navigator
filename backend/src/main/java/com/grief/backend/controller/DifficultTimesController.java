package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.DifficultTimesApi;
import com.grief.backend.generated.model.dto.DifficultTimes;
import com.grief.backend.service.DifficultTimeService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class DifficultTimesController implements DifficultTimesApi {

    private DifficultTimeService difficultTimeService;

    public DifficultTimesController(DifficultTimeService difficultTimeService) {
        this.difficultTimeService = difficultTimeService;
    }

    @Override
    public ResponseEntity<Void> registerDifficultTimes(@Valid List<@Valid DifficultTimes> difficultTimes) {
        try {
            difficultTimeService.registerDifficultTimes(difficultTimes);
            return ResponseEntity.ok().build();
        } catch(Exception e) {
            log.error("Faied to save Difficulties", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
}
