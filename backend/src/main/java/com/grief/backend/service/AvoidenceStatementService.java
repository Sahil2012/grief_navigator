package com.grief.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.grief.backend.model.questions.AvoidanceStatement;
import com.grief.backend.repository.AvoidenceStatementRepository;

@Service
public class AvoidenceStatementService {
    
    private AvoidenceStatementRepository avoidenceStatementRepository;

    public AvoidenceStatementService(AvoidenceStatementRepository avoidenceStatementRepository) {
        this.avoidenceStatementRepository = avoidenceStatementRepository;
    }

    public List<String> fetchAvoidenceStatements() {
        return avoidenceStatementRepository.findAll()
                    .stream()
                    .map(statement -> statement.getText())
                    .collect(Collectors.toList());
    }

    public void saveAvoidenceStatements(List<String> avoidenceStatements) {

        avoidenceStatementRepository.saveAll(avoidenceStatements.stream()
                                                .map(statement -> new AvoidanceStatement(statement,null))
                                                .collect(Collectors.toList()));

    }

    public AvoidanceStatement getAllAvoidences(Long ids) {

        return avoidenceStatementRepository.getReferenceById(ids);
    }
}
