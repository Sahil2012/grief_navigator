package com.grief.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.grief.backend.dto.AuthUser;

@Component
public class CurrentUser {

    public AuthUser getCurrentUser() {
        return (AuthUser) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public String getCurrentUserAuthId() {
        return getCurrentUser().getSubject();
    }
}
