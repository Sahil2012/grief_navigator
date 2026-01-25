package com.grief.backend.service;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.GriefMilestoneDTO;
import com.grief.backend.model.activities.GriefMilestone;
import com.grief.backend.model.enums.GriefFocus;
import com.grief.backend.repository.GriefMilestoneRepository;

@Service
public class GriefMilestoneService {

    private GriefMilestoneRepository griefMilestoneRepository;
    private CurrentUser currentUser;

    public GriefMilestoneService(GriefMilestoneRepository griefMilestoneRepository, CurrentUser currentUser) {
        this.griefMilestoneRepository = griefMilestoneRepository;
        this.currentUser = currentUser;
    }

    public void createGriefMilestone(GriefMilestoneDTO griefMilestoneDTO) {
        GriefMilestone griefMilestone = mapToGriefMilestone(griefMilestoneDTO);
        griefMilestoneRepository.save(griefMilestone);
    }

    private GriefMilestone mapToGriefMilestone(GriefMilestoneDTO griefMilestoneDTO) {
        return GriefMilestone.builder()
                .appUser(currentUser.getCurrentAppUser())
                .focus(GriefFocus.valueOf(griefMilestoneDTO.getFocus().name()))
                .timeDuration(griefMilestoneDTO.getTimeDuration())
                .reflections(griefMilestoneDTO.getReflections())
                .indicators(griefMilestoneDTO.getIndicators())
                .build();
    }
}
