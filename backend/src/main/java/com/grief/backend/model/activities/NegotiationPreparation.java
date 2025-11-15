package com.grief.backend.model.activities;


import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;
import com.grief.backend.model.questions.FamilyConflictAssessment;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "negotiation_preparation",
       indexes = {
         @Index(name = "idx_neg_prep_user", columnList = "app_user_id"),
         @Index(name = "idx_neg_prep_conflict", columnList = "family_conflict_assessment_id")
       })
public class NegotiationPreparation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    /**
     * Optional: link to the family conflict assessment that triggered this.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_conflict_assessment_id")
    private FamilyConflictAssessment familyConflictAssessment;

    @Column(name = "topic", length = 500)
    private String topic; // e.g., "Parenting time with Emma"

    @Column(name = "created_at_negotiation_prep", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime createdAtNegotiation = OffsetDateTime.now();

    @Column(name = "updated_at_negotiation_prep", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime updatedAtNegotiation = OffsetDateTime.now();

    // Primary goals -- stored as JSON text array of strings (e.g., ["Custody arrangement", "Parenting schedule"])
    @Column(name = "primary_goals", columnDefinition = "jsonb")
    private String primaryGoalsJson;

    @Column(name = "ideal_outcome", columnDefinition = "TEXT")
    private String idealOutcome;

    @Column(name = "acceptable_outcome", columnDefinition = "TEXT")
    private String acceptableOutcome;

    @Column(name = "batna_threshold", columnDefinition = "TEXT")
    private String batnaThreshold; // "walk-away" point text

    // BATNA summary stored in separate table (see NegotiationBatna) — convenience text here
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "completed", nullable = false)
    private Boolean completed = false;

    @Column(name = "completed_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime completedAt;

    // Relationships
    @OneToMany(mappedBy = "preparation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NegotiationIssue> issues = new ArrayList<>();

    @OneToOne(mappedBy = "preparation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private NegotiationOtherPartyAnalysis otherPartyAnalysis;

    @OneToOne(mappedBy = "preparation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private NegotiationBatna batna;
}
