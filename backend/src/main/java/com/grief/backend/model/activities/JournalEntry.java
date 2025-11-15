package com.grief.backend.model.activities;
import java.time.LocalDateTime;


import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;
import com.grief.backend.model.questions.Loss;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "journal_entries")
public class JournalEntry extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    private LocalDateTime entryDate;

    private String title;

    @Column(length = 10000)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_loss_id")
    private Loss relatedLoss;

    @Column(length = 2000)
    private String cognitiveDistortionsJson; // e.g., detected belief ids

    private String emotionalTone;

    private boolean privateToUser = true;
}