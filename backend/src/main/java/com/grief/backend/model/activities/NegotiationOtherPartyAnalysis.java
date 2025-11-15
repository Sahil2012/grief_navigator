package com.grief.backend.model.activities;

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
@Table(name = "negotiation_other_party_analysis",
       indexes = {@Index(name = "idx_neg_other_prep", columnList = "preparation_id")})
public class NegotiationOtherPartyAnalysis extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preparation_id", nullable = false)
    private NegotiationPreparation preparation;

    @Column(name = "other_party_goals", columnDefinition = "TEXT")
    private String otherPartyGoals; // free text

    /**
     * pressure points stored as JSON array of option codes, e.g. ["FINANCIAL","WORK_SCHEDULE"]
     */
    @Column(name = "other_party_pressures", columnDefinition = "jsonb")
    private String otherPartyPressuresJson;

    @Column(name = "children_needs", columnDefinition = "TEXT")
    private String childrenNeeds;

    @Column(name = "communication_approach", length = 100)
    private String communicationApproach; // e.g., "Mediation with professional", "Through lawyers only"

    @Column(name = "prepration_steps", columnDefinition = "jsonb")
    private String preprationStepsJson; // JSON array of strings
}
