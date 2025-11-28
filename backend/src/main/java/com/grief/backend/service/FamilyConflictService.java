package com.grief.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.FamilyConflictQuestionDTO;
import com.grief.backend.model.questions.FamilyConflictOptions;
import com.grief.backend.model.questions.FamilyConflictQuestions;
import com.grief.backend.repository.FamilyConflictRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FamilyConflictService {
    
    private FamilyConflictRepository familyConflictRepository;

    public FamilyConflictService(FamilyConflictRepository familyConflictRepository) {
        this.familyConflictRepository = familyConflictRepository;
    }

    public void saveQuestions(List<FamilyConflictQuestionDTO> questionDtos){
        List<FamilyConflictQuestions> entities = questionDtos.stream()
                                                    .map(this::convertToEntity)
                                                    .collect(Collectors.toList());
        
        familyConflictRepository.saveAll(entities);
    }

    private FamilyConflictQuestions convertToEntity(FamilyConflictQuestionDTO dto) {
        FamilyConflictQuestions question = FamilyConflictQuestions.builder()
                                                .fieldId(dto.getFieldId())
                                                .sectionId(dto.getSectionId())
                                                .questionText(dto.getQuestion())
                                                .type(dto.getType())
                                                .build();
        question.setOptions(convertToOptionEntity(question, dto.getOptions()));
        return question;
    }

    private List<FamilyConflictOptions> convertToOptionEntity(FamilyConflictQuestions questions ,List<String> options){

        return options.stream()
                .map(opt -> {
                    FamilyConflictOptions option = new FamilyConflictOptions();
                    option.setOptionValue(opt);
                    option.setQuestion(questions);
                    return option;
                })
                .collect(Collectors.toList());

    }
}
