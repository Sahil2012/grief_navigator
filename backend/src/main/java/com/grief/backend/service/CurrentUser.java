package com.grief.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.grief.backend.dto.AuthUser;
import com.grief.backend.model.AppUser;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CurrentUser {

    private UserService userService;

    public CurrentUser(UserService userService) {
        this.userService = userService;
    }

    public AuthUser getCurrentUser() {
        log.info("Executing getCurrentUser");
        return (AuthUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public String getCurrentUserAuthId() {
        log.info("Executing getCurrentUserAuthId");
        return getCurrentUser().getSubject();
    }

    public AppUser getCurrentAppUser() {
        log.info("Executing getCurrentAppUser");
        return userService.getAppUser(getCurrentUserAuthId());
    }
}
