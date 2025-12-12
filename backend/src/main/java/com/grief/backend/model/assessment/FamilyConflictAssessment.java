package com.grief.backend.model.assessment;


import java.time.OffsetDateTime;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "family_conflict_assessment",
       indexes = {@Index(name = "idx_fca_user", columnList = "app_user_id")})
public class FamilyConflictAssessment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @Column(name = "trigger_reason", columnDefinition = "TEXT")
    private String triggerReason; // e.g., "Concerning separation feelings"

    @Column(name = "assessment_created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime assessmentCreatedAt = OffsetDateTime.now();

    @Column(name = "assessment_updated_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime assessmentUpdatedAt = OffsetDateTime.now();

    // Cached/persisted result
    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "risk_level", length = 32)
    private String riskLevel; // HIGH / MODERATE / LOW_MODERATE / LOW

    // Optional link to CYGE assessment that triggered this (if you store that)
    @Column(name = "cyge_assessment_id")
    private Long cygeAssessmentId;

    // Section relations - optional to keep normalized
    @OneToOne(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private FamilyConflictSafety safetySection;

    @OneToOne(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private FamilyConflictPatterns patternsSection;

    @OneToOne(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private FamilyConflictLegal legalSection;

    @OneToOne(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private FamilyConflictSupport supportSection;

}
