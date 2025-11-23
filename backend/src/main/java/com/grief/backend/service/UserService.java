package com.grief.backend.service;

import org.springframework.stereotype.Component;

import com.grief.backend.dto.AuthUser;
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

        log.info("Loading or creating user with auth ID: {}",  authUser.getSubject());
        
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

    public AppUser getAppUser(String authid) {
        return appUserRepository.findByAuthProviderId(authid).get();
    }
}
