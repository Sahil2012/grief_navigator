package com.grief.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grief.backend.model.activities.GriefDerailer;

@Repository
public interface GriefDerailerRepository extends JpaRepository<GriefDerailer, Long> {

}
