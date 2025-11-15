package com.grief.backend.model;

import com.grief.backend.model.enums.DifficultyLevel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "difficult_times")
public class DifficultTime extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @Column(length = 200)
    private String dayOrTime; // free text (e.g., 'Christmas Eve', 'Sunday morning')

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_loss_id")
    private Loss relatedLoss; // optional
}