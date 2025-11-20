package com.grief.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.AppUserApi;


@RestController
public class AppUserController implements AppUserApi {

    @Override
    public ResponseEntity<Void> getMyAppUser() {
        return ResponseEntity.ok().build();
    }
}
