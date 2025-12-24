package com.grief.backend.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.grief.backend.model.questions.Loss;

@Repository
public interface LossRepository extends JpaRepository<Loss, Long> {

    @Query("SELECT l FROM Loss l WHERE l.appUser.externalAuthId = ?1")
    public List<Loss> findAllLosses(String appUserId);

    @Query("SELECT l FROM Loss l WHERE l.id IN ?1")
    public Set<Loss> findAllLosses(List<Long> losses);

    @Query("SELECT l FROM Loss l WHERE l.appUser.externalAuthId = ?1 AND l.id = ?2")
    public Loss findByUserIdAndId(String appUserId, Long lossId);
}
