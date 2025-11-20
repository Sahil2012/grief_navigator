package com.grief.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthUser {
    
    private String subject;
    private String email;
    private String name;
}
