package com.grief.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.DifficultTimes;
import com.grief.backend.model.AppUser;
import com.grief.backend.model.questions.DifficultTime;
import com.grief.backend.model.questions.Loss;
import com.grief.backend.repository.DifficultTimeRepository;

@Service
public class DifficultTimeService {
    
    private DifficultTimeRepository difDiificultTimeRepository;
    private CurrentUser currentUser;
    private LossService lossService;

    public DifficultTimeService(DifficultTimeRepository diificultTimeRepository, CurrentUser currentUser, LossService lossService) {
        this.difDiificultTimeRepository = diificultTimeRepository;
        this.currentUser = currentUser;
        this.lossService = lossService;
    }

    public void registerDifficultTimes(List<DifficultTimes> difficultTimes) {
        AppUser appUser = currentUser.getCurrentAppUser();

        List<DifficultTime> difficultTimeEntities = difficultTimes
                                                        .stream()
                                                        .map(dto -> {
                                                            Loss relatedLoss = lossService.getLoss(dto.getRelatedLoss());
                                                            return DifficultTime.builder()
                                                                .appUser(appUser)
                                                                .dayOrTime(dto.getDayOrTime())
                                                                .relatedLoss(relatedLoss)
                                                                .difficulty(dto.getDifficulty())
                                                                .build();
                                                        })
                                                        .collect(Collectors.toList());
                                                        
        difDiificultTimeRepository.saveAll(difficultTimeEntities);
    }
}
