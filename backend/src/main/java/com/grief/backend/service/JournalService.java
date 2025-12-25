package com.grief.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
import com.grief.backend.mapper.JournalMapper;
import com.grief.backend.model.activities.JournalEntry;
import com.grief.backend.repository.JournalRepository;
import com.grief.backend.repository.JournalSpecifications;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class JournalService {

    private final JournalRepository journalRepository;
    private final CurrentUser currentUser;
    private final JournalMapper journalMapper;

    public JournalService(JournalRepository journalRepository, CurrentUser currentUser, JournalMapper journalMapper) {
        this.journalRepository = journalRepository;
        this.currentUser = currentUser;
        this.journalMapper = journalMapper;
    }

    public JournalEntryDTO findByIdForUser(Long id) {
        log.info("Fetching journal entry for user {}", currentUser.getCurrentAppUser().getId());
        JournalEntry journalEntry = journalRepository.findByIdForUser(id, currentUser.getCurrentAppUser().getId());
        log.info("Converting journal entry to dto");
        return journalMapper.toDTO(journalEntry);
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

    public void updateJournalEntry(Long id, JournalEntryDTO journalEntryDTO) {
        log.info("Updating journal entry {} for user {}", id, currentUser.getCurrentAppUser().getId());
        JournalEntry journalEntry = journalRepository.findByIdForUser(id, currentUser.getCurrentAppUser().getId());
        if (journalEntry == null) {
            throw new IllegalArgumentException("Journal entry not found or access denied");
        }

        if (journalEntryDTO.getEntryDate() != null) {
            journalEntry.setEntryDate(LocalDateTime.from(journalEntryDTO.getEntryDate()));
        }

        journalMapper.updateJournalEntryFromDTO(journalEntryDTO, journalEntry);

        journalRepository.save(journalEntry);
    }

    public List<JournalEntryDTO> getJournalEntries(LocalDate startDate, LocalDate endDate, Integer page, Integer size) {
        log.info("Fetching journal entries for user {}", currentUser.getCurrentAppUser().getId());
        Specification<JournalEntry> spec = JournalSpecifications.hasUser(currentUser.getCurrentAppUser().getId())
                .and(JournalSpecifications.hasDateRange(startDate, endDate));

        Pageable pageable = PageRequest.of(page != null ? page : 0, size != null ? size : 10,
                Sort.by(Sort.Direction.DESC, "entryDate"));
        Page<JournalEntry> entries = journalRepository.findAll(spec, pageable);

        return entries.getContent().stream()
                .map(journalMapper::toDTO)
                .collect(Collectors.toList());
    }

    private boolean existsByTitle(String title) {
        return journalRepository.existsByTitle(title, currentUser.getCurrentAppUser().getId()) > 0;
    }

}
