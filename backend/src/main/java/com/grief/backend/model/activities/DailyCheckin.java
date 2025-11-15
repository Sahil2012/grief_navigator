package com.grief.backend.model.activities;

import java.time.LocalDate;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;
import com.grief.backend.model.questions.Loss;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "daily_checkins", uniqueConstraints = @UniqueConstraint(columnNames = {"app_user_id", "check_in_date"}))
public class DailyCheckin extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    private LocalDate checkInDate; // normalized to user's local date at check-in time

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "loss_id", nullable = false)
    private Loss loss;

    private Integer griefIntensity; // 0-10

    // store emotion codes in a JSON/text column or normalized table. simple CSV here.
    @Column(length = 1000)
    private String emotionsCsv;

    @Column(length = 2000)
    private String notes;
}
