package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.AvoidenceEntryApi;
import com.grief.backend.generated.model.dto.AvoidenceEntryDTO;
import com.grief.backend.service.AvoidenceEntryService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class AvoidenceEntryController implements AvoidenceEntryApi{
    
    private AvoidenceEntryService avoidenceEntryService;

    public AvoidenceEntryController(AvoidenceEntryService avoidenceEntryService) {
        this.avoidenceEntryService = avoidenceEntryService;
    }

    @Override
    public ResponseEntity<Void> saveAvoidenceEntries(@Valid List<@Valid AvoidenceEntryDTO> avoidenceEntryDTO) {
        try{
            avoidenceEntryService.saveEntries(avoidenceEntryDTO);
            return ResponseEntity.ok().build();
        } catch(Exception e) {
            log.error("Error saving entries {}",e.getMessage());
        }
        return ResponseEntity.badRequest().build();
    }


}
