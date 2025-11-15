package com.grief.backend.model.questions;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "avoidance_entries")
public class AvoidanceEntry extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "statement_id", nullable = false)
    private AvoidanceStatement statement;

    // 0-4 or null for N/A
    private Integer frequencyRating;

    @ManyToMany
    @JoinTable(name = "avoidance_entry_losses",
        joinColumns = @JoinColumn(name = "avoidance_entry_id"),
        inverseJoinColumns = @JoinColumn(name = "loss_id"))
    private Set<Loss> relatedLosses = new HashSet<>();

}