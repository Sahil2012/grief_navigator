package com.grief.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.dto.AuthUser;
import com.grief.backend.generated.api.LossApi;
import com.grief.backend.generated.model.dto.LossDTO;
import com.grief.backend.service.LossService;

import jakarta.validation.Valid;

@RestController
public class LossController implements LossApi {

    private LossService lossService;

    public LossController(LossService lossService) {
        this.lossService = lossService;
    }

    @Override
    public ResponseEntity<List<LossDTO>> getAllLosses() {
        AuthUser AuthUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return ResponseEntity.ok().body(lossService.getAllLosses(AuthUser.getSubject()));
    }

    @Override
    public ResponseEntity<Void> registerLosses(@Valid List<@Valid LossDTO> lossDTO) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'registerLosses'");
    }

    
}
