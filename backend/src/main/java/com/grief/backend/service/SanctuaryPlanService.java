package com.grief.backend.service;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.SanctuaryPlanDTO;
import com.grief.backend.mapper.ScantuaryPlanMapper;
import com.grief.backend.model.activities.SanctuaryPlan;
import com.grief.backend.repository.SanctuaryPlanRepository;

@Service
public class SanctuaryPlanService {

    private CurrentUser currentUser;
    private SanctuaryPlanRepository sancturyPlanRepository;

    public SanctuaryPlanService(CurrentUser currentUser, SanctuaryPlanRepository sancturyPlanRepository) {
        this.currentUser = currentUser;
        this.sancturyPlanRepository = sancturyPlanRepository;
    }

    public SanctuaryPlan createSanctuaryPlan(SanctuaryPlanDTO sanctuaryPlanDTO) {
        return sancturyPlanRepository
                .save(ScantuaryPlanMapper.mapToSancturyPlan(sanctuaryPlanDTO, currentUser.getCurrentAppUser()));
    }

    public SanctuaryPlan updateSanctuaryPlan(Long id, SanctuaryPlanDTO sanctuaryPlanDTO) {
        SanctuaryPlan sanctuaryPlan = ScantuaryPlanMapper.mapToSancturyPlan(sanctuaryPlanDTO,
                currentUser.getCurrentAppUser());
        return sancturyPlanRepository.save(sanctuaryPlan);
    }
}
