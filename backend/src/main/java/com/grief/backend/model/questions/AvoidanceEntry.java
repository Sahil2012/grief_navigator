package com.grief.backend.model.questions;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

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
@Getter
@Setter
@Builder
@Table(name = "avoidance_entries", uniqueConstraints = @UniqueConstraint(columnNames = {"app_user_id","statement_id","related_loss"}))
public class AvoidanceEntry extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "statement_id", nullable = false)
    private AvoidanceStatement statement;

    // 0-4 or null for N/A
    @Min(value = 0, message = "rating can not be below 0")
    @Max(value = 4, message = "rating can not be higher than 4")
    @Column(nullable = true)
    private Integer frequencyRating;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "related_loss", nullable = false)
    private Loss relatedLoss;

}