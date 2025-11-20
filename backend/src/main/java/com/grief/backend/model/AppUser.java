package com.grief.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "app_user", indexes = { @Index(columnList = "external_auth_id") })
public class AppUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "external_auth_id", nullable = false, unique = true, length = 200)
    private String externalAuthId; // Firebase/Clerk/Supabase UID

    private String displayName;

    private String email;

    private String timezone;

    private String completionState;

}
