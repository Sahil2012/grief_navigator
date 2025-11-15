package com.grief.backend.model.activities;


import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;
import com.grief.backend.model.enums.OscillationPattern;
import com.grief.backend.model.questions.Loss;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "dual_process_responses",
       indexes = {@Index(columnList = "app_user_id"), @Index(columnList = "loss_id")})
public class DualProcessResponse extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loss_id", nullable = false)
    private Loss loss; // which loss this response is about

    @Column(name = "loss_oriented_activities", columnDefinition = "TEXT")
    private String lossOrientedActivities; // free text

    @Column(name = "restoration_oriented_activities", columnDefinition = "TEXT")
    private String restorationOrientedActivities; // free text

    @Enumerated(EnumType.STRING)
    @Column(name = "oscillation_pattern")
    private OscillationPattern oscillationPattern;

    @Column(name = "balance_reflection", columnDefinition = "TEXT")
    private String balanceReflection; // free text: what would help

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grief_theory_activity_id")
    private GriefTheoryActivity griefTheoryActivity; // optional parent

}
