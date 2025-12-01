package com.grief.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.AvoidenceEntryDTO;
import com.grief.backend.model.AppUser;
import com.grief.backend.model.questions.AvoidanceEntry;
import com.grief.backend.repository.AvoidenceEntryRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AvoidenceEntryService {
    
    private AvoidenceEntryRepository avoidenceEntryRepository;
    private CurrentUser currentUser;
    private LossService lossService;
    private AvoidenceStatementService avoidenceStatementService;

    public AvoidenceEntryService(AvoidenceEntryRepository avoidenceEntryRepository,
        CurrentUser currentUser,
        LossService lossService,
        AvoidenceStatementService avoidenceStatementService
    ) {
        this.currentUser = currentUser;
        this.lossService = lossService;
        this.avoidenceStatementService = avoidenceStatementService;
        this.avoidenceEntryRepository = avoidenceEntryRepository;
    }

    public void saveEntries(List<AvoidenceEntryDTO> avoidenceEntryDTOs) {
        AppUser appUser = currentUser.getCurrentAppUser();

        List<AvoidanceEntry> entries = avoidenceEntryDTOs.stream()
                                            .map(dto -> AvoidanceEntry.builder()
                                                            .appUser(appUser)
                                                            .statement(avoidenceStatementService.getAllAvoidences(dto.getAvoidenceStatementId()))
                                                            .frequencyRating(dto.getRating())
                                                            .relatedLoss(lossService.getLoss(dto.getRelatedLoss()))
                                                            .build())
                                            .collect(Collectors.toList());

        avoidenceEntryRepository.saveAll(entries);
    }
}
