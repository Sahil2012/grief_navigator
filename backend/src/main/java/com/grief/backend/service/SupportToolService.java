package com.grief.backend.service;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.SupportToolDTO;
import com.grief.backend.model.activities.SupportTool;
import com.grief.backend.model.enums.SupportToolCategory;
import com.grief.backend.repository.SupportToolRepository;

@Service
public class SupportToolService {

    private SupportToolRepository supportToolRepository;
    private CurrentUser currentUser;

    public SupportToolService(SupportToolRepository supportToolRepository, CurrentUser currentUser) {
        this.supportToolRepository = supportToolRepository;
        this.currentUser = currentUser;
    }

    public void createSupportTool(SupportToolDTO supportToolDTO) {
        supportToolRepository.save(mapToSupportTool(supportToolDTO));
    }

    private SupportTool mapToSupportTool(SupportToolDTO supportToolDTO) {
        return SupportTool.builder()
                .appUser(currentUser.getCurrentAppUser())
                .answer(supportToolDTO.getAnswer())
                .supportToolCategory(SupportToolCategory.valueOf(supportToolDTO.getSupportToolCategory().name()))
                .build();
    }
}
