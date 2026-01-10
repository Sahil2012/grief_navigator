package com.grief.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.AuthApi;
import com.grief.backend.generated.api.ProfileApi;
import com.grief.backend.generated.model.dto.CompletionStatus;
import com.grief.backend.generated.model.dto.ProfileDTO;
import com.grief.backend.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class AppUserController implements AuthApi, ProfileApi {

    private UserService userService;

    public AppUserController(UserService userService) {
        this.userService = userService;
    }

    @Override
    public ResponseEntity<Void> getMyAppUser() {
        log.info("Request received for getMyAppUser");
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> completeCYGE(@Valid String body) {
        log.info("Request received for completeCYGE with payload: {}", body);
        try {
            userService.updateStatus(body);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<CompletionStatus> getCYGECompletionStatus() {
        log.info("Request received for getCYGECompletionStatus");
        try {
            CompletionStatus status = userService.getCYGECompletionStatus();
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<ProfileDTO> getMyProfile() {
        log.info("Request received for getMyProfile");
        try {
            ProfileDTO profile = userService.getProfile();
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @Override
    public ResponseEntity<ProfileDTO> updateProfile(@Valid ProfileDTO body) {
        log.info("Request received for updateProfile with payload: {}", body);
        try {
            ProfileDTO updatedProfile = userService.updateProfile(body);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            log.error("Error updating profile", e);
            return ResponseEntity.status(500).build();
        }
    }
}
