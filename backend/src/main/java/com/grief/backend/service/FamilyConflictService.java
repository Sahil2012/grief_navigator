package com.grief.backend.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.grief.backend.generated.model.dto.FamilyConflictAnswerDTO;
import com.grief.backend.generated.model.dto.FamilyConflictQuestionDTO;
import com.grief.backend.generated.model.dto.QuestionType;
import com.grief.backend.model.questions.FamilyConflictAnswer;
import com.grief.backend.model.questions.FamilyConflictOptions;
import com.grief.backend.model.questions.FamilyConflictQuestions;
import com.grief.backend.repository.FamilyConflictAnswerRepository;
import com.grief.backend.repository.FamilyConflictRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FamilyConflictService {

    private FamilyConflictRepository familyConflictRepository;
    private FamilyConflictAnswerRepository familyConflictAnswerRepository;
    private FamilyConflictAssessmentService familyConflictAssessmentService;

    public FamilyConflictService(FamilyConflictRepository familyConflictRepository,
            FamilyConflictAnswerRepository familyConflictAnswerRepository,
            FamilyConflictAssessmentService familyConflictAssessmentService) {
        this.familyConflictRepository = familyConflictRepository;
        this.familyConflictAnswerRepository = familyConflictAnswerRepository;
        this.familyConflictAssessmentService = familyConflictAssessmentService;
    }

    @Cacheable(value = "familyConflictQuestions", key = "#sectionId")
    public List<FamilyConflictQuestionDTO> fetchQuestions(String sectionId, String fieldId) {
        if (fieldId == null || fieldId.isBlank()) {
            return fetchQuestionsForSection(sectionId);
        }

        FamilyConflictQuestions question = familyConflictRepository.findQuestionByFeildIdForSection(sectionId, fieldId);

        return question == null ? Collections.emptyList() : List.of(convertToDto(question));
    }

    public void saveQuestions(List<FamilyConflictQuestionDTO> questionDtos) {
        List<FamilyConflictQuestions> entities = questionDtos.stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());

        familyConflictRepository.saveAll(entities);
    }

    public void saveAnswers(List<FamilyConflictAnswerDTO> answerDTOs) {
        // Implementation to save answers

        List<FamilyConflictAnswer> answerEntities = answerDTOs.stream()
                .map(dto -> FamilyConflictAnswer.builder()
                        .assessment(familyConflictAssessmentService.getAssessmentById(dto.getAssessmentId()))
                        .question(familyConflictRepository.findById(dto.getQuestionId()).get())
                        .valueText(dto.getValueText())
                        .build())
                .collect(Collectors.toList());
        familyConflictAnswerRepository.saveAll(answerEntities);
    }

    private List<FamilyConflictQuestionDTO> fetchQuestionsForSection(String sectionId) {
        if (sectionId == null || sectionId.isBlank()) {
            log.warn("Section ID is null or blank while fetching questions for section");
            return fetchAllQuestions();
        }
        return familyConflictRepository.findQuestionForSection(sectionId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private List<FamilyConflictQuestionDTO> fetchAllQuestions() {
        return familyConflictRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private FamilyConflictQuestionDTO convertToDto(FamilyConflictQuestions question) {

        FamilyConflictQuestionDTO dto = new FamilyConflictQuestionDTO();

        dto.setFieldId(question.getFieldId());
        dto.setSectionId(question.getSectionId());
        dto.setType(question.getType());
        dto.setId(question.getId());
        dto.setQuestion(question.getQuestionText());
        if (dto.getType() != QuestionType.DESCRIPTIVE) {
            dto.setOptions(question.getOptions().stream().map(opt -> opt.getOptionValue()).toList());
        }
        return dto;
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

    private List<FamilyConflictOptions> convertToOptionEntity(FamilyConflictQuestions questions, List<String> options) {

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
