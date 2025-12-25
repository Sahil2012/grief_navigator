package com.grief.backend.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.CheckinApi;
import com.grief.backend.generated.model.dto.DailyCheckinDTO;
import com.grief.backend.service.CheckinService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class CheckinController implements CheckinApi {

    private final CheckinService checkinService;

    public CheckinController(CheckinService checkinService) {
        this.checkinService = checkinService;
    }

    @Override
    public ResponseEntity<Boolean> getDailyCheckinStatus(@NotNull @Valid LocalDate checkInDate) {
        log.info("Request received for getDailyCheckinStatus with payload: {}", checkInDate);
        return ResponseEntity.ok(checkinService.isUserCheckedInToday(checkInDate));
    }

    @Override
    public ResponseEntity<Void> saveDailyCheckin(@Valid DailyCheckinDTO dailyCheckinDTO) {
        log.info("Request received for saveDailyCheckin with payload: {}", dailyCheckinDTO);
        checkinService.saveCheckinIfNotCheckedInToday(dailyCheckinDTO);
        return ResponseEntity.ok().build();
    }

}
