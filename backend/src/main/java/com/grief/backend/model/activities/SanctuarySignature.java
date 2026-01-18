package com.grief.backend.model.activities;

import java.time.LocalDate;

import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
public class SanctuarySignature extends BaseEntity {

    private String signature;

    private LocalDate date;

    // Many to One with SanctuaryPlan
    @ManyToOne
    @JoinColumn(name = "sanctuary_plan_id", nullable = false)
    private SanctuaryPlan sanctuaryPlan;
}
