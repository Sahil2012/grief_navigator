package com.grief.backend.model.questions;

import java.util.ArrayList;
import java.util.List;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;
import com.grief.backend.model.enums.DifficultyLevel;
import com.grief.backend.model.enums.LossType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "losses")
public class Loss extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @Enumerated(EnumType.STRING)
    private LossType type;

    // Example: 'My ex-partner', 'Family home', 'Being a parent'
    @Column(length = 1000)
    private String description;

    // free-text as per spec (e.g., "3 months")
    private String timeAgo;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    @OneToMany(mappedBy = "loss", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RelationshipEntry> relationshipEntries = new ArrayList<>();

}