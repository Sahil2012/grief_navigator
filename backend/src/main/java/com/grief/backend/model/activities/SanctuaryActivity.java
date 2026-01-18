package com.grief.backend.model.activities;

import com.grief.backend.model.BaseEntity;

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
public class SanctuaryActivity extends BaseEntity {

    private String activityQuestion;

    private String activityAnswer;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "sanctuary_plan_id", nullable = false)
    private SanctuaryPlan sanctuaryPlan;

}
