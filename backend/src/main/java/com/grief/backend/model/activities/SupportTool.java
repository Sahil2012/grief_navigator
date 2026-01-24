package com.grief.backend.model.activities;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.grief.backend.model.AppUser;
import com.grief.backend.model.BaseEntity;
import com.grief.backend.model.enums.SupportToolCategory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
public class SupportTool extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, String> answer = new HashMap<>();

    private SupportToolCategory supportToolCategory;
}
