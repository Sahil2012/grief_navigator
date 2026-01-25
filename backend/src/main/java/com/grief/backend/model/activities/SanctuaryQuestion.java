package com.grief.backend.model.activities;

import com.grief.backend.model.BaseEntity;
import com.grief.backend.model.enums.ScanturyCategory;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
public class SanctuaryQuestion extends BaseEntity {

    private String question;

    private String answer;

    private ScanturyCategory catgory;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sanctuary_plan_id", nullable = false)
    private SanctuaryPlan sanctuaryPlan;
}
