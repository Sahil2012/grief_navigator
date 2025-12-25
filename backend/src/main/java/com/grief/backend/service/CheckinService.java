package com.grief.backend.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.DailyCheckinDTO;
import com.grief.backend.model.activities.DailyCheckin;
import com.grief.backend.repository.CheckinRespository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CheckinService {

    private final CheckinRespository checkinRespository;
    private final CurrentUser currentUser;
    private final LossService lossService;

    public CheckinService(CheckinRespository checkinRespository, CurrentUser currentUser, LossService lossService) {
        this.checkinRespository = checkinRespository;
        this.currentUser = currentUser;
        this.lossService = lossService;
    }

    public void saveCheckinIfNotCheckedInToday(DailyCheckinDTO checkInDto) {
        log.info("Executing saveCheckinIfNotCheckedInToday with args: {}", checkInDto);
        if (!isUserCheckedInToday(checkInDto.getCheckInDate())) {
            log.info("User {} is not checked in today", currentUser.getCurrentAppUser().getId());
            saveCheckin(checkInDto);
        }
    }

    public boolean isUserCheckedInToday(LocalDate date) {
        log.info("Executing isUserCheckedInToday with args: {}", date);
        return checkinRespository.isCheckedInToday(currentUser.getCurrentAppUser().getId(), date) > 0;
    }

    private void saveCheckin(DailyCheckinDTO checkInDto) {
        DailyCheckin dailyCheckin = DailyCheckin.builder()
                .appUser(currentUser.getCurrentAppUser())
                .checkInDate(checkInDto.getCheckInDate())
                .griefIntensity(checkInDto.getGriefIntensity())
                .emotionsCsv(checkInDto.getEmotionsCsv())
                .loss(lossService.getLossByUserIdAndId(currentUser.getCurrentUserAuthId(), checkInDto.getLossId()))
                .build();
        log.info("Executing saveCheckin with args: {}", checkInDto);
        checkinRespository.save(dailyCheckin);
    }
}
