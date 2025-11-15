package com.grief.backend.model.assessment;


import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "family_conflict_support",
       indexes = {@Index(name = "idx_fcsu_assessment", columnList = "assessment_id")})
public class FamilyConflictSupport extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private FamilyConflictAssessment assessment;

    @Column(name = "immediate_needs", columnDefinition = "jsonb")
    private String immediateNeedsJson;

    @Column(name = "barriers_to_resolution", columnDefinition = "jsonb")
    private String barriersToResolutionJson;

    @Column(name = "preferred_support_format", columnDefinition = "jsonb")
    private String preferredSupportFormatJson;

    @Column(name = "urgency_level", length = 64)
    private String urgencyLevel; // Immediate/Urgent/Soon/Moderate/Low
}
