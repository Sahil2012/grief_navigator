package com.grief.backend.model.activities;
import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.OneToOne;

@Entity
@Getter
@Setter
@Table(name = "negotiation_batna",
       indexes = {@Index(name = "idx_neg_batna_prep", columnList = "preparation_id")})
public class NegotiationBatna extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preparation_id", nullable = false)
    private NegotiationPreparation preparation;

    @Column(name = "batna_alternatives", columnDefinition = "TEXT")
    private String batnaAlternatives; // free text

    @Column(name = "batna_strength")
    private Integer batnaStrength; // 1..5

    @Column(name = "batna_improvements", columnDefinition = "TEXT")
    private String batnaImprovements;
}
