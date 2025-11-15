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
@Table(name = "family_conflict_patterns",
       indexes = {@Index(name = "idx_fcp_assessment", columnList = "assessment_id")})
public class FamilyConflictPatterns extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private FamilyConflictAssessment assessment;

    @Column(name = "communication_patterns", length = 64)
    private String communicationPatterns; // radio option value

    // conflict_triggers: json array, e.g. ["CUSTODY","FINANCES"]
    @Column(name = "conflict_triggers", columnDefinition = "jsonb")
    private String conflictTriggersJson;

    // escalation patterns: json array
    @Column(name = "escalation_patterns", columnDefinition = "jsonb")
    private String escalationPatternsJson;

    // impact_on_children: json array
    @Column(name = "impact_on_children", columnDefinition = "jsonb")
    private String impactOnChildrenJson;
}
