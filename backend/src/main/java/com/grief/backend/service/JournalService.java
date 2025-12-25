package com.grief.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grief.backend.generated.model.dto.JournalEntryDTO;
import com.grief.backend.model.activities.JournalEntry;
import com.grief.backend.repository.JournalRepository;
import com.grief.backend.repository.JournalSpecifications;

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

    public List<JournalEntryDTO> getJournalEntries(LocalDate startDate, LocalDate endDate, Integer page, Integer size) {
        log.info("Fetching journal entries for user {}", currentUser.getCurrentAppUser().getId());
        Specification<JournalEntry> spec = JournalSpecifications.hasUser(currentUser.getCurrentAppUser().getId())
                .and(JournalSpecifications.hasDateRange(startDate, endDate));

        Pageable pageable = PageRequest.of(page != null ? page : 0, size != null ? size : 10,
                Sort.by(Sort.Direction.DESC, "entryDate"));
        Page<JournalEntry> entries = journalRepository.findAll(spec, pageable);

        return entries.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private JournalEntryDTO convertToDTO(JournalEntry journalEntry) {
        return JournalEntryDTO.builder()
                .id(journalEntry.getId())
                .entryDate(OffsetDateTime.of(journalEntry.getEntryDate(), ZoneOffset.UTC))
                .title(journalEntry.getTitle())
                .content(journalEntry.getContent())
                .emotionalTone(journalEntry.getEmotionalTone())
                .build();
    }

    private boolean existsByTitle(String title) {
        return journalRepository.existsByTitle(title, currentUser.getCurrentAppUser().getId()) > 0;
    }

}
