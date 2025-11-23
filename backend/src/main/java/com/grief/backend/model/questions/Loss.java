package com.grief.backend.model.questions;

import java.util.ArrayList;
import java.util.List;

import com.grief.backend.generated.model.dto.DifficultyLevel;
import com.grief.backend.generated.model.dto.LossType;
import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;

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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "losses")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
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
    private String time;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    @OneToMany(mappedBy = "loss", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RelationshipEntry> relationshipEntries = new ArrayList<>();

}