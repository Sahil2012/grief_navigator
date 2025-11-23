package com.grief.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.AuthApi;


@RestController
public class AppUserController implements AuthApi {

    @Override
    public ResponseEntity<Void> getMyAppUser() {
        return ResponseEntity.ok().build();
    }
}
