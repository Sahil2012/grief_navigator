package com.grief.backend.model.activities;

import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "sanctuary_support_contacts")
public class SanctuarySupportContact extends BaseEntity {
    private String name;
    private String contact;
    private String whenToContact;
    private String whatTheyCanHelpWith;
}

