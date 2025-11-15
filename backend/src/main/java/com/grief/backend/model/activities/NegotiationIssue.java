package com.grief.backend.model.activities;

import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

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
@Table(name = "negotiation_issue",
       indexes = {@Index(name = "idx_neg_issue_prep", columnList = "preparation_id")})
public class NegotiationIssue extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "preparation_id", nullable = false)
    private NegotiationPreparation preparation;

    @Column(name = "issue_text", columnDefinition = "TEXT", nullable = false)
    private String issueText; // e.g., "Parenting schedule on weekends"

    @Column(name = "priority", nullable = false)
    private Integer priority; // lower number = higher priority (or vice versa, you decide)

    @Column(name = "complexity", nullable = false)
    private Integer complexity; // 1..5 scale

    /**
     * Emotions triggered by this issue. Stored as jsonb array of strings, e.g. ["Anger","Fear"]
     */
    @Column(name = "emotions", columnDefinition = "jsonb")
    private String emotionsJson;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
