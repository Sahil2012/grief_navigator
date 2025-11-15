package com.grief.backend.model.activities;


import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;
import com.grief.backend.model.questions.Loss;

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
@Table(name = "relationship_map_entries",
       indexes = {@Index(columnList = "app_user_id"), @Index(columnList = "loss_id")})
public class RelationshipMapEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loss_id", nullable = false)
    private Loss loss;

    // free text describing how the relationship continues
    @Column(name = "continuing_bond", columnDefinition = "TEXT")
    private String continuingBond;

    // slider -5 .. +5 (nullable allowed)
    @Column(name = "quality_change")
    private Integer qualityChange;

    // how they maintain connection nowadays
    @Column(name = "current_connection", columnDefinition = "TEXT")
    private String currentConnection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grief_theory_activity_id")
    private GriefTheoryActivity griefTheoryActivity;

}
