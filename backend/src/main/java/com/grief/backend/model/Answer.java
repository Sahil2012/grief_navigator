package com.grief.backend.model;

import jakarta.persistence.*;

@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Activity activity;

    @ManyToOne(optional = false)
    private Question question;

    @ManyToOne(optional = false)
    private Option option;
    // Getters and setters
}
