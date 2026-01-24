package com.grief.backend.service;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.GriefDerailerDTO;
import com.grief.backend.model.activities.GriefDerailer;
import com.grief.backend.repository.GriefDerailerRepository;

@Service
public class GriefDerailerService {

    private GriefDerailerRepository griefDerailerRepository;
    private CurrentUser currentUser;

    public GriefDerailerService(GriefDerailerRepository griefDerailerRepository, CurrentUser currentUser) {
        this.griefDerailerRepository = griefDerailerRepository;
        this.currentUser = currentUser;
    }

    public void createGriefDerailer(GriefDerailerDTO griefDerailerDTO) {
        GriefDerailer griefDerailer = mapToGriefDerailer(griefDerailerDTO);
        griefDerailerRepository.save(griefDerailer);
    }

    private GriefDerailer mapToGriefDerailer(GriefDerailerDTO griefDerailerDTO) {
        return GriefDerailer.builder()
                .appUser(currentUser.getCurrentAppUser())
                .derailer(griefDerailerDTO.getDerailer())
                .build();
    }
}
