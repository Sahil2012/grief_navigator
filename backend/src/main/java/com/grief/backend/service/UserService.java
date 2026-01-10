package com.grief.backend.service;

import java.util.function.Consumer;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.grief.backend.dto.AuthUser;
import com.grief.backend.generated.model.dto.CompletionStatus;
import com.grief.backend.generated.model.dto.ProfileDTO;
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

        log.info("Executing loadOrCreateUser with args: {}", authUser);

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
        log.info("Executing getAppUser with args: {}", authId);
        return appUserRepository.findByAuthProviderId(authId).get();
    }

    public void updateStatus(String status) {
        log.info("Executing updateStatus with args: {}", status);
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
        log.info("Executing getCYGECompletionStatus");
        AppUser appUser = getCurrentAppUser();
        return appUser.getCompletionState();
    }

    public ProfileDTO getProfile() {
        log.info("Executing getProfile");
        AppUser appUser = getCurrentAppUser();
        return mapToProfileDTO(appUser);
    }

    public ProfileDTO updateProfile(ProfileDTO profileDTO) {
        log.info("Executing updateProfile with args: {}", profileDTO);
        AppUser appUser = getCurrentAppUser();

        updateIfPresent(profileDTO.getFirstName(), appUser::setFirstName);
        updateIfPresent(profileDTO.getLastName(), appUser::setLastName);
        updateIfPresent(profileDTO.getBio(), appUser::setBio);
        updateIfPresent(profileDTO.getPhoneNumber(), appUser::setPhoneNumber);
        updateIfPresent(profileDTO.getProfilePictureUrl(), appUser::setProfilePictureUrl);

        if (profileDTO.getFirstName() != null || profileDTO.getLastName() != null) {
            updateDisplayName(appUser);
        }

        appUser = appUserRepository.save(appUser);
        return mapToProfileDTO(appUser);
    }

    private <T> void updateIfPresent(T value, Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }

    private void updateDisplayName(AppUser appUser) {
        String first = appUser.getFirstName() != null ? appUser.getFirstName() : "";
        String last = appUser.getLastName() != null ? appUser.getLastName() : "";
        String display = (first + " " + last).trim();
        if (!display.isEmpty()) {
            appUser.setDisplayName(display);
        }
    }

    private ProfileDTO mapToProfileDTO(AppUser user) {
        ProfileDTO dto = new ProfileDTO();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setBio(user.getBio());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setEmail(user.getEmail());
        dto.setCompletionStatus(user.getCompletionState());
        return dto;
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
