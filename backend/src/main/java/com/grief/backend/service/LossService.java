package com.grief.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.LossDTO;
import com.grief.backend.model.AppUser;
import com.grief.backend.model.questions.Loss;
import com.grief.backend.repository.LossRepository;

@Service
public class LossService {

    private LossRepository lossRepository;
    private CurrentUser currentUser;

    public LossService(LossRepository lossRepository, CurrentUser currentUser) {
        this.lossRepository = lossRepository;
        this.currentUser = currentUser;
    }

    public List<LossDTO> getAllLosses() {

        List<Loss> losses = lossRepository.findAllLosses(currentUser.getCurrentUserAuthId());

        return losses
                .stream()
                .map(loss -> {
                    LossDTO dto = new LossDTO(loss.getType(), loss.getDescription(), loss.getDifficulty(),
                            loss.getTime());
                    dto.setId(loss.getId());
                    return dto;
                }).toList();

    }

    public void saveLoss(List<LossDTO> losses) throws Exception {

        AppUser appUser = currentUser.getCurrentAppUser();

        lossRepository
                .saveAll(
                        losses
                                .stream()
                                .map(dto -> Loss.builder()
                                        .appUser(appUser)
                                        .type(dto.getType())
                                        .description(dto.getDescription())
                                        .difficulty(dto.getDifficulty())
                                        .time(dto.getTime())
                                        .build())
                                .collect(Collectors.toList()));

    }

    public Loss getLoss(Long lossId) {
        return lossRepository.findById(lossId).get();
    }

    public Loss getLossByUserIdAndId(String appUserId, Long lossId) {
        return lossRepository.findByUserIdAndId(appUserId, lossId);
    }
}
