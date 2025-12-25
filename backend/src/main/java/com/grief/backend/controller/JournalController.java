package com.grief.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.grief.backend.generated.api.JournalEntryApi;
import com.grief.backend.generated.model.dto.JournalEntryDTO;
import com.grief.backend.service.JournalService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class JournalController implements JournalEntryApi {

    private final JournalService journalService;

    public JournalController(JournalService journalService) {
        this.journalService = journalService;
    }

    @Override
    public ResponseEntity<Void> deleteJournalEntry(Long id) {
        journalService.deleteJournalEntry(id);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<JournalEntryDTO> getJournalEntry(Long id) {
        log.info("Fetching journal entry with id {}", id);
        return ResponseEntity.ok(journalService.findByIdForUser(id));
    }

    @Override
    public ResponseEntity<Long> saveJournalEntry(@Valid JournalEntryDTO journalEntryDTO) {
        log.info("Saving journal entry for {}", journalEntryDTO);
        return ResponseEntity.ok(journalService.saveJournalEntry(journalEntryDTO));
    }

    @Override
    public ResponseEntity<Void> updateJournalEntry(Long id, @Valid JournalEntryDTO journalEntryDTO) {
        journalService.updateJournalEntry(id, journalEntryDTO);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<List<JournalEntryDTO>> getJournalEntries(@Valid LocalDate startDate, @Valid LocalDate endDate,
            @Valid Integer page, @Valid Integer size) {
        return ResponseEntity.ok(journalService.getJournalEntries(startDate, endDate, page, size));
    }

}
