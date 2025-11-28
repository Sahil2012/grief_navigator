package com.grief.backend.model.questions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "family_conflict_options")
public class FamilyConflictOptions extends BaseEntity {
    

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore
    private FamilyConflictQuestions question;
    
    @Column(name = "option_value", length = 200)
    private String optionValue; // e.g., "Option A"
}
