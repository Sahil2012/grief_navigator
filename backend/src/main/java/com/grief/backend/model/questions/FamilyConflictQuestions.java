package com.grief.backend.model.questions;

import java.util.ArrayList;
import java.util.List;

import com.grief.backend.model.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "family_conflict_questions", indexes = {@Index(columnList = "titles")})
public class FamilyConflictQuestions extends BaseEntity {
    
    @Column(name = "field_id", nullable = false, length = 200)
    private String fieldId;         // e.g. "other_person_relationship", "police_called_criminal_charges"

    @Column(name = "section_id", length = 200)
    private String sectionId;       // e.g. "situation_assessment_part1"

    @Column(name = "question_text", length = 1000)
    private String questionText;

    @Column(name = "title", length = 500)
    private String title;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FamilyConflictOptions> options = new ArrayList<>(); // for radio/checkbox types
}
