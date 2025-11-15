package com.grief.backend.model.activities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "sanctuary_plans")
public class SanctuaryPlan extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    private LocalDateTime dateCreated;
    private LocalDateTime nextReviewDate;

    @Column(length = 2000)
    private String coreConcerns;

    @Column(length = 2000)
    private String earlyWarningSigns;

    @Column(length = 2000)
    private String safeguardingActions;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "sanctuary_plan_id")
    private List<SanctuarySupportContact> supportContacts = new ArrayList<>();
}
