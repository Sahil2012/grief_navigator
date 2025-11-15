package com.grief.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "belief_entries")
public class BeliefEntry extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "statement_id", nullable = false)
    private BeliefStatement statement;

    // rating 0-4 as integer
    private Integer rating;

    // link to multiple losses - join table
    @ManyToMany
    @JoinTable(name = "belief_entry_losses",
        joinColumns = @JoinColumn(name = "belief_entry_id"),
        inverseJoinColumns = @JoinColumn(name = "loss_id"))
    private Set<Loss> relatedLosses = new HashSet<>();
}
