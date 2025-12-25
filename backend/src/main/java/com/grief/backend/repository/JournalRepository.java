package com.grief.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.grief.backend.model.activities.JournalEntry;

@Repository
public interface JournalRepository extends JpaRepository<JournalEntry, Long> {

    @Query("SELECT count(e) FROM JournalEntry e WHERE e.title = :title AND e.appUser.id = :userId")
    public Long existsByTitle(String title, Long userId);

    @Query("SELECT e FROM JournalEntry e WHERE e.id = :id AND e.appUser.id = :userId")
    public JournalEntry findByIdForUser(Long id, Long userId);

    @Modifying
    @Query("DELETE FROM JournalEntry e WHERE e.id = :id AND e.appUser.id = :userId")
    public void deleteJournalEntryForUser(Long id, Long userId);
}
