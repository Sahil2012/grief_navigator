package com.grief.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class HealthController {

    @GetMapping("/health")
    public String healthCheck() {
        log.info("Request received for healthCheck");
        return "Server Running";
    }
}
