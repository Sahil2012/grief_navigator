package com.grief.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.grief.backend.model.AppUser;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    
    @Query("SELECT u FROM AppUser u WHERE u.externalAuthId = ?1")
    Optional<AppUser> findByAuthProviderId(String authProviderId);
}
