package com.grief.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "belief_statements")
public class BeliefStatement extends BaseEntity {
    @Column(length = 1000)
    private String text;

    private String category; // e.g., GUILT, UNFAIRNESS, SAFETY
}