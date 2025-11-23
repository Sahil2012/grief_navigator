package com.grief.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.LossDTO;
import com.grief.backend.model.questions.Loss;
import com.grief.backend.repository.LossRepository;

@Service
public class LossService {

    private LossRepository lossRepository;

    public LossService(LossRepository lossRepository) {
        this.lossRepository = lossRepository;
    }

    public List<LossDTO> getAllLosses(String subject) {

        List<Loss> losses = lossRepository.findAllLosses(subject);

        return losses
                .stream()
                .map(loss -> {
                    return new LossDTO(loss.getType().toString(), loss.getDescription(), loss.getDescription(),
                            loss.getTime());
                }).toList();
    }
}
