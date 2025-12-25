package com.grief.backend.service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grief.backend.generated.model.dto.JournalEntryDTO;
import com.grief.backend.model.activities.JournalEntry;
import com.grief.backend.repository.JournalRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class JournalService {

    private final JournalRepository journalRepository;
    private final CurrentUser currentUser;

    public JournalService(JournalRepository journalRepository, CurrentUser currentUser) {
        this.journalRepository = journalRepository;
        this.currentUser = currentUser;
    }

    public JournalEntryDTO findByIdForUser(Long id) {
        log.info("Fetching journal entry for user {}", currentUser.getCurrentAppUser().getId());
        JournalEntry journalEntry = journalRepository.findByIdForUser(id, currentUser.getCurrentAppUser().getId());
        log.info("Converting journal entry to dto");
        return JournalEntryDTO.builder()
                .id(journalEntry.getId())
                .entryDate(OffsetDateTime.of(journalEntry.getEntryDate(), ZoneOffset.UTC))
                .title(journalEntry.getTitle())
                .content(journalEntry.getContent())
                .emotionalTone(journalEntry.getEmotionalTone())
                .build();
    }

    public Long saveJournalEntry(JournalEntryDTO journalEntryDTO) {
        if (existsByTitle(journalEntryDTO.getTitle())) {
            log.info("Journal entry with title {} already exists", journalEntryDTO.getTitle());
            return -1L;
        }
        log.info("Saving journal entry for user {}", currentUser.getCurrentAppUser().getId());
        JournalEntry journalEntry = journalRepository.save(JournalEntry.builder()
                .appUser(currentUser.getCurrentAppUser())
                .entryDate(LocalDateTime.from(journalEntryDTO.getEntryDate()))
                .title(journalEntryDTO.getTitle())
                .content(journalEntryDTO.getContent())
                .emotionalTone(journalEntryDTO.getEmotionalTone())
                .build());
        return journalEntry.getId();
    }

    @Transactional
    public boolean deleteJournalEntry(Long id) {
        log.info("Deleting journal entry for user {}", currentUser.getCurrentAppUser().getId());
        journalRepository.deleteJournalEntryForUser(id, currentUser.getCurrentAppUser().getId());
        return true;
    }

    private boolean existsByTitle(String title) {
        return journalRepository.existsByTitle(title, currentUser.getCurrentAppUser().getId()) > 0;
    }

}
