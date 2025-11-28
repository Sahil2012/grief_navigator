package com.grief.backend.model.questions;

import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "avoidance_statements")
public class AvoidanceStatement extends BaseEntity {

    @Column(unique = true ,length = 1000, nullable = false)
    private String text;
    private String category;
}

