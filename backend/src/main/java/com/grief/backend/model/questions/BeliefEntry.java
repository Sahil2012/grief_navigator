package com.grief.backend.model.questions;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.util.HashSet;
import java.util.Set;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Builder
@Table(name = "belief_entries", uniqueConstraints = @UniqueConstraint(columnNames = {"statement_id","app_user_id","related_loss"}))
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
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "related_loss", nullable = false)
    private Loss relatedLoss;
}
