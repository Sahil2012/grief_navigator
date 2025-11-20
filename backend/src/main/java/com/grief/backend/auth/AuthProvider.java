package com.grief.backend.auth;


import com.grief.backend.dto.AuthUser;

public interface AuthProvider {
    
    AuthUser verifyToken(String token);
}
