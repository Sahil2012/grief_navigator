package com.grief.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.AuthApi;
import com.grief.backend.generated.api.ProfileApi;
import com.grief.backend.generated.model.dto.CompletionStatus;
import com.grief.backend.service.UserService;

import jakarta.validation.Valid;


@RestController
public class AppUserController implements AuthApi, ProfileApi {

    private UserService userService;

    public AppUserController(UserService userService) {
        this.userService = userService;
    }

    @Override
    public ResponseEntity<Void> getMyAppUser() {
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> completeCYGE(@Valid String body) {
        try {
            userService.updateStatus(body);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<CompletionStatus> getCYGECompletionStatus() {
        try {
            CompletionStatus status = userService.getCYGECompletionStatus();
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
