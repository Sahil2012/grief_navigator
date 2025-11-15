package com.grief.backend.model;

import com.grief.backend.model.enums.DifficultyLevel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "relationship_entries")
public class RelationshipEntry extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "loss_id", nullable = false)
    private Loss loss;

    @Column(length = 200)
    private String relationLabel; // e.g., 'mother', 'dog', 'career'

    @Column(length = 200)
    private String relationType; // free text or enum if you want

    @Column(length = 200)
    private String knownDuration; // free text

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    @Column(length = 2000)
    private String notes;
}