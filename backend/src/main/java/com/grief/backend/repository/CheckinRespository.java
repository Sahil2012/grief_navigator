package com.grief.backend.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.grief.backend.model.activities.DailyCheckin;

@Repository
public interface CheckinRespository extends JpaRepository<DailyCheckin, Long> {

    @Query("SELECT COUNT(*) FROM DailyCheckin dc WHERE dc.appUser.id = :appUserId AND dc.checkInDate = :checkInDate")
    public int isCheckedInToday(Long appUserId, LocalDate checkInDate);
}
