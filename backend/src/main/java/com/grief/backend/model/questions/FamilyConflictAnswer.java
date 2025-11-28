package com.grief.backend.model.questions;

import java.time.OffsetDateTime;

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
@Table(name = "family_conflict_answers",
       indexes = {
         @Index(columnList = "assessment_id")       })
public class FamilyConflictAnswer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private FamilyConflictAssessmentCYGE assessment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id")
    private FamilyConflictQuestions question;

    @Column(name = "control_type", nullable = false, length = 50)
    private String controlType;     // radio | checkbox | textarea

    @Column(name = "value_text", columnDefinition = "TEXT")
    private String valueText;       // free-text / long text

    @Column(name = "created_at_answer", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime createdAt_answer = OffsetDateTime.now();

    @Column(name = "updated_at_answer", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime updatedAt_answer = OffsetDateTime.now();

}

