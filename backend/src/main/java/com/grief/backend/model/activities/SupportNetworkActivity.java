package com.grief.backend.model.activities;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;
import com.grief.backend.model.enums.SupportType;
import com.grief.backend.model.questions.AvoidanceEntry;
import com.grief.backend.model.questions.BeliefEntry;
import com.grief.backend.model.questions.Loss;

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
@Table(name = "support_network_activities")
public class SupportNetworkActivity extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @Column(length = 500)
    private String supportName;

    @Enumerated(EnumType.STRING)
    private SupportType supportType;

    // -3 .. +3 impact
    private Integer impactRating;

    private String accessibility; // use enum if desired

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_loss_id")
    private Loss relatedLoss;

    // optional linking to a belief or avoidance entry
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "belief_entry_id")
    private BeliefEntry beliefEntry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avoidance_entry_id")
    private AvoidanceEntry avoidanceEntry;
}
