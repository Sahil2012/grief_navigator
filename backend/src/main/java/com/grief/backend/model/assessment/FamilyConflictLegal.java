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
@Table(name = "family_conflict_legal",
       indexes = {@Index(name = "idx_fcl_assessment", columnList = "assessment_id")})
public class FamilyConflictLegal extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private FamilyConflictAssessment assessment;

    @Column(name = "current_legal_proceedings", length = 64)
    private String currentLegalProceedings; // options: YES/NO/PLANNING/RECENTLY_CONCLUDED

    @Column(name = "legal_proceeding_types", columnDefinition = "jsonb")
    private String legalProceedingTypesJson;

    @Column(name = "legal_representation", length = 64)
    private String legalRepresentation; // e.g., PRIVATE/LEGAL_AID/SELF/SEEKING

    @Column(name = "mediation_experience", length = 64)
    private String mediationExperience;

    @Column(name = "professional_support", columnDefinition = "jsonb")
    private String professionalSupportJson; // list of currently used services
}
