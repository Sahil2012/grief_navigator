package com.grief.backend.model.assessment;

import com.grief.backend.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "family_conflict_safety",
       indexes = {@Index(name = "idx_fcs_assessment", columnList = "assessment_id")})
public class FamilyConflictSafety extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private FamilyConflictAssessment assessment;

    // Options: YES / NO / SOMETIMES / NOT_SURE — store as string
    @Column(name = "physical_safety_concerns", length = 32)
    private String physicalSafetyConcerns;

    @Column(name = "safety_concerns_details", columnDefinition = "TEXT")
    private String safetyConcernsDetails;

    @Column(name = "threatening_behavior", length = 32)
    private String threateningBehavior;

    // conditional multi-select describing types of threatening behavior
    // jsonb array of strings: ["VERBAL","PHYSICAL","STALKING"]
    @Column(name = "threatening_behavior_types", columnDefinition = "jsonb")
    private String threateningBehaviorTypesJson;

    @Column(name = "children_safety", length = 32)
    private String childrenSafety; // Yes/No/Sometimes/NA

    @Column(name = "protective_orders", length = 64)
    private String protectiveOrders; // Yes/No/Applied/Considering

    // other fields from PART 12 that relate to personal safety:
    @Column(name = "frightened_safety_past_year", length = 32)
    private String frightenedSafetyPastYear;

    @Column(name = "afraid_safety_now", length = 32)
    private String afraidSafetyNow;

    @Column(name = "other_parent_threatened_take_children", length = 32)
    private String otherParentThreatenedTakeChildren;

    @Column(name = "other_parent_threatened_take_children_comment", columnDefinition = "TEXT")
    private String otherParentThreatenedTakeChildrenComment;

    @Column(name = "you_threatened_take_children", length = 32)
    private String youThreatenedTakeChildren;

    @Column(name = "you_threatened_take_children_comment", columnDefinition = "TEXT")
    private String youThreatenedTakeChildrenComment;

    // other personal-legal-safety flags (police, intervention orders)
    @Column(name = "police_called_criminal_charges", length = 32)
    private String policeCalledCriminalCharges;

    @Column(name = "police_called_criminal_charges_comment", columnDefinition = "TEXT")
    private String policeCalledCriminalChargesComment;

    @Column(name = "intervention_order_against", length = 32)
    private String interventionOrderAgainst;

    @Column(name = "intervention_order_against_comment", columnDefinition = "TEXT")
    private String interventionOrderAgainstComment;

    // Threatening behavior detailed checkboxes (store Yes/No) + comments
    @Column(name = "other_parent_followed_monitored", length = 32)
    private String otherParentFollowedMonitored;

    @Column(name = "other_parent_followed_monitored_comment", columnDefinition = "TEXT")
    private String otherParentFollowedMonitoredComment;

    @Column(name = "other_parent_tried_control_money", length = 32)
    private String otherParentTriedControlMoney;
    @Column(name = "other_parent_tried_control_money_comment", columnDefinition = "TEXT")
    private String otherParentTriedControlMoneyComment;

    @Column(name = "other_parent_threatened_safety", length = 32)
    private String otherParentThreatenedSafety;
    @Column(name = "other_parent_threatened_safety_comment", columnDefinition = "TEXT")
    private String otherParentThreatenedSafetyComment;

    @Column(name = "other_parent_hurt_way_accident", length = 32)
    private String otherParentHurtWayAccident;
    @Column(name = "other_parent_hurt_way_accident_comment", columnDefinition = "TEXT")
    private String otherParentHurtWayAccidentComment;

    @Column(name = "other_parent_threatened_hurt_kill", length = 32)
    private String otherParentThreatenedHurtKill;
    @Column(name = "other_parent_threatened_hurt_kill_comment", columnDefinition = "TEXT")
    private String otherParentThreatenedHurtKillComment;

    @Column(name = "other_parent_access_weapons", length = 32)
    private String otherParentAccessWeapons;
    @Column(name = "other_parent_access_weapons_comment", columnDefinition = "TEXT")
    private String otherParentAccessWeaponsComment;

    @Column(name = "behaviours_frequent_recently", length = 32)
    private String behavioursFrequentRecently;
}
