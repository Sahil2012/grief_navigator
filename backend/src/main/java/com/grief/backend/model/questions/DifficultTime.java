package com.grief.backend.model.questions;

import com.grief.backend.generated.model.dto.DifficultyLevel;
import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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