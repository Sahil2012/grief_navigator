package com.grief.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.grief.backend.model.questions.AvoidanceStatement;
import com.grief.backend.repository.AvoidenceStatementRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AvoidenceStatementService {

    private AvoidenceStatementRepository avoidenceStatementRepository;

    public AvoidenceStatementService(AvoidenceStatementRepository avoidenceStatementRepository) {
        this.avoidenceStatementRepository = avoidenceStatementRepository;
    }

    @Cacheable("avoidenceStatements")
    public List<Object> fetchAvoidenceStatements() {
        log.info("Executing fetchAvoidenceStatements");
        return avoidenceStatementRepository.findAll()
                .stream()
                .map(statement -> {
                    Map<String, String> avoidence = new HashMap<>();
                    avoidence.put("id", statement.getId().toString());
                    avoidence.put("statement", statement.getText());
                    return avoidence;
                })
                .collect(Collectors.toList());
    }

    public void saveAvoidenceStatements(List<String> avoidenceStatements) {
        log.info("Executing saveAvoidenceStatements with args: {}", avoidenceStatements);

        avoidenceStatementRepository.saveAll(avoidenceStatements.stream()
                .map(statement -> new AvoidanceStatement(statement, null))
                .collect(Collectors.toList()));

    }

    public AvoidanceStatement getAllAvoidences(Long ids) {
        log.info("Executing getAllAvoidences with args: {}", ids);

        return avoidenceStatementRepository.getReferenceById(ids);
    }
}
