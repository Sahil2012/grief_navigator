package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.LossApi;
import com.grief.backend.generated.model.dto.LossDTO;
import com.grief.backend.service.LossService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class LossController implements LossApi {

    private LossService lossService;

    public LossController(LossService lossService) {
        this.lossService = lossService;
    }

    @Override
    public ResponseEntity<List<LossDTO>> getAllLosses() {
        log.info("Request received for getAllLosses");
        return ResponseEntity.ok().body(lossService.getAllLosses());
    }

    @Override
    public ResponseEntity<Void> registerLosses(@Valid List<@Valid LossDTO> lossDTO) {
        log.info("Request received for registerLosses with payload: {}", lossDTO);
        try {
            lossService.saveLoss(lossDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error saving the dtos", e);
        }
        return ResponseEntity.badRequest().build();
    }

}
