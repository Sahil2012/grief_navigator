package com.grief.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.grief.backend.repository.BeliefStatementRepository;

@Service
public class BeliefService {
    
    private BeliefStatementRepository beliefStatementRepository;

    public BeliefService(BeliefStatementRepository beliefStatementRepository) {
        this.beliefStatementRepository = beliefStatementRepository;
    }

    public List<String> getAllStatement() {
        return beliefStatementRepository.findAll()
                    .stream()
                    .map(statement -> statement.getText())
                    .collect(Collectors.toList());
    }
}
