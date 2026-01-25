package com.grief.backend.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.grief.backend.generated.model.dto.SanctuaryActivityDTO;
import com.grief.backend.generated.model.dto.SanctuaryPlanDTO;
import com.grief.backend.generated.model.dto.SanctuaryQuestionDTO;
import com.grief.backend.generated.model.dto.SanctuarySignatureDTO;
import com.grief.backend.model.AppUser;
import com.grief.backend.model.activities.SanctuaryActivity;
import com.grief.backend.model.activities.SanctuaryPlan;
import com.grief.backend.model.activities.SanctuaryQuestion;
import com.grief.backend.model.activities.SanctuarySignature;
import com.grief.backend.model.enums.ScanturyCategory;

public class ScantuaryPlanMapper {
    public static SanctuaryPlan mapToSancturyPlan(SanctuaryPlanDTO sanctuaryPlanDTO, AppUser appUser) {
        SanctuaryPlan sanctuaryPlan = SanctuaryPlan.builder()
                .appUser(appUser)
                .name(sanctuaryPlanDTO.getName())
                .startDate(sanctuaryPlanDTO.getStartDate())
                .endDate(sanctuaryPlanDTO.getEndDate())
                .build();

        if (sanctuaryPlanDTO.getSanctuaryActivities() != null) {
            List<SanctuaryActivity> activities = mapToSanctuaryActivities(sanctuaryPlanDTO.getSanctuaryActivities());
            activities.forEach(activity -> activity.setSanctuaryPlan(sanctuaryPlan));
            sanctuaryPlan.setSanctuaryActivities(activities);
        }

        if (sanctuaryPlanDTO.getSanctuaryQuestions() != null) {
            List<SanctuaryQuestion> questions = mapToSanctuaryQuestions(sanctuaryPlanDTO.getSanctuaryQuestions());
            questions.forEach(question -> question.setSanctuaryPlan(sanctuaryPlan));
            sanctuaryPlan.setSanctuaryQuestions(questions);
        }

        if (sanctuaryPlanDTO.getSanctuarySignatures() != null) {
            List<SanctuarySignature> signatures = mapToSanctuarySignatures(sanctuaryPlanDTO.getSanctuarySignatures());
            signatures.forEach(signature -> signature.setSanctuaryPlan(sanctuaryPlan));
            sanctuaryPlan.setSanctuarySignatures(signatures);
        }

        return sanctuaryPlan;
    }

    private static List<SanctuaryActivity> mapToSanctuaryActivities(List<SanctuaryActivityDTO> sanctuaryActivityDTOs) {
        return sanctuaryActivityDTOs.stream()
                .map(ScantuaryPlanMapper::mapToSanctuaryActivity)
                .collect(Collectors.toList());
    }

    private static SanctuaryActivity mapToSanctuaryActivity(SanctuaryActivityDTO sanctuaryActivityDTO) {
        return SanctuaryActivity.builder()
                .activityQuestion(sanctuaryActivityDTO.getActivityQuestion())
                .activityAnswer(sanctuaryActivityDTO.getActivityAnswer())
                .build();
    }

    private static List<SanctuaryQuestion> mapToSanctuaryQuestions(List<SanctuaryQuestionDTO> sanctuaryQuestions) {
        return sanctuaryQuestions.stream()
                .map(ScantuaryPlanMapper::mapToSanctuaryQuestion)
                .collect(Collectors.toList());
    }

    private static SanctuaryQuestion mapToSanctuaryQuestion(SanctuaryQuestionDTO sanctuaryQuestion) {
        return SanctuaryQuestion.builder()
                .question(sanctuaryQuestion.getQuestion())
                .answer(sanctuaryQuestion.getAnswer())
                .catgory(ScanturyCategory.valueOf(sanctuaryQuestion.getCategory().toString()))
                .build();
    }

    private static List<SanctuarySignature> mapToSanctuarySignatures(List<SanctuarySignatureDTO> sanctuarySignatures) {
        return sanctuarySignatures.stream()
                .map(ScantuaryPlanMapper::mapToSanctuarySignature)
                .collect(Collectors.toList());
    }

    private static SanctuarySignature mapToSanctuarySignature(SanctuarySignatureDTO sanctuarySignature) {
        return SanctuarySignature.builder()
                .signature(sanctuarySignature.getSignature())
                .date(sanctuarySignature.getDate())
                .build();
    }
}
