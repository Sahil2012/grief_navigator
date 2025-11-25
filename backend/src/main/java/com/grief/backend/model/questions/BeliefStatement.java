package com.grief.backend.model.questions;

import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name = "belief_statements")
public class BeliefStatement extends BaseEntity {
    
    @Column(length = 1000, unique = true)
    private String text;

    private String category; // e.g., GUILT, UNFAIRNESS, SAFETY
}