package com.grief.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.BeliefEntryDTO;
import com.grief.backend.model.AppUser;
import com.grief.backend.model.questions.BeliefEntry;
import com.grief.backend.model.questions.BeliefStatement;
import com.grief.backend.repository.BeliefEntryRepository;
import com.grief.backend.repository.BeliefStatementRepository;

@Service
public class BeliefService {

    private BeliefStatementRepository beliefStatementRepository;
    private BeliefEntryRepository beliefEntryRepository;
    private CurrentUser currentUser;
    private LossService lossService;

    public BeliefService(BeliefStatementRepository beliefStatementRepository,
            BeliefEntryRepository beliefEntryRepository, CurrentUser currentUser, LossService lossService) {
        this.beliefStatementRepository = beliefStatementRepository;
        this.beliefEntryRepository = beliefEntryRepository;
        this.currentUser = currentUser;
        this.lossService = lossService;
    }

    @Cacheable("beliefStatements")
    public List<Object> getAllStatement() {
        return beliefStatementRepository.findAll()
                .stream()
                .map(statement -> {
                    Map<String, String> belief = new HashMap<>();
                    belief.put("id", statement.getId().toString());
                    belief.put("statement", statement.getText());
                    return belief;
                })
                .collect(Collectors.toList());
    }

    public void saveBeliefStatements(List<String> beliefStatements) {
        List<BeliefStatement> entities = beliefStatements.stream()
                .map(statement -> new BeliefStatement(statement, null))
                .collect(Collectors.toList());

        beliefStatementRepository.saveAll(entities);
    }

    private BeliefStatement findBeliefStatement(Long id) {
        return beliefStatementRepository.findById(id).get();
    }

    public void saveEntries(List<BeliefEntryDTO> beliefEntries) {
        AppUser appUser = currentUser.getCurrentAppUser();

        List<BeliefEntry> entites = beliefEntries
                .stream()
                .map(dto -> BeliefEntry.builder()
                        .appUser(appUser)
                        .rating(dto.getRating())
                        .relatedLoss(lossService.getLoss(dto.getRelatedLoss()))
                        .statement(findBeliefStatement(dto.getBeliefStatementId()))
                        .build())
                .collect(Collectors.toList());

        beliefEntryRepository.saveAll(entites);

    }
}
