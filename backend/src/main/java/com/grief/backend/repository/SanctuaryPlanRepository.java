package com.grief.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grief.backend.model.activities.SanctuaryPlan;

@Repository
public interface SanctuaryPlanRepository extends JpaRepository<SanctuaryPlan, Long> {

}
