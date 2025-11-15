package com.grief.backend.model.activities;

import java.time.LocalDateTime;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;

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
@Table(name = "grief_theory_activities",
       indexes = {@Index(columnList = "app_user_id"), @Index(columnList = "week_number")})
public class GriefTheoryActivity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    // week offset relative to first checkin; this activity is unlocked at weekNumber >= 2
    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    @Column(name = "completed", nullable = false)
    private Boolean completed = false;

    @Column(name = "completed_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private LocalDateTime completedAt;

    // convenience: notes or summary of activity
    @Column(columnDefinition = "TEXT")
    private String summary;

}
