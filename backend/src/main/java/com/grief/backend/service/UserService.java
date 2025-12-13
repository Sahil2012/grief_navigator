package com.grief.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.grief.backend.dto.AuthUser;
import com.grief.backend.generated.model.dto.CompletionStatus;
import com.grief.backend.model.AppUser;
import com.grief.backend.repository.AppUserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class UserService {

    private AppUserRepository appUserRepository;

    public UserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser loadOrCreateUser(AuthUser authUser) {

        log.info("Loading or creating user with auth ID: {}", authUser.getSubject());

        return appUserRepository.findByAuthProviderId(authUser.getSubject())
                .orElseGet(() -> {
                    log.info("Creating new user for auth ID: {}", authUser.getSubject());
                    AppUser newUser = new AppUser();
                    newUser.setExternalAuthId(authUser.getSubject());
                    newUser.setEmail(authUser.getEmail());
                    newUser.setDisplayName(authUser.getName());
                    return appUserRepository.save(newUser);
                });
    }

    public AppUser getAppUser(String authId) {
        return appUserRepository.findByAuthProviderId(authId).get();
    }

    public void updateStatus(String status) {
        log.info("Updating CYGE completion status to {} for current user", status);
        AppUser appUser = getCurrentAppUser();

        CompletionStatus completionStatus;
        try {
            completionStatus = CompletionStatus.valueOf(
                    status.trim().replace("\"", "").toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid completion status: " + status);
        }
        appUser.setCompletionState(completionStatus);
        appUserRepository.save(appUser);
    }

    public CompletionStatus getCYGECompletionStatus() {
        log.info("Fetching CYGE completion status for current user");
        AppUser appUser = getCurrentAppUser();
        return appUser.getCompletionState();
    }

    private AppUser getCurrentAppUser() {
        String authId = getCurrentAuthUser().getSubject();
        return getAppUser(authId);
    }

    private AuthUser getCurrentAuthUser() {
        return (AuthUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
}
