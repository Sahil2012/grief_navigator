package com.grief.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.grief.backend.dto.AuthUser;
import com.grief.backend.model.AppUser;

@Component
public class CurrentUser {

    private UserService userService;

    public CurrentUser(UserService userService) {
        this.userService = userService;
    }

    public AuthUser getCurrentUser() {
        return (AuthUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public String getCurrentUserAuthId() {
        return getCurrentUser().getSubject();
    }

    public AppUser getCurrentAppUser() {
        return userService.getAppUser(getCurrentUserAuthId());
    }
}
