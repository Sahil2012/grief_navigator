import { apiClient } from './apiClient';
import { ENDPOINTS } from '../../constants/config';
import { DateType } from 'react-native-ui-datepicker';

export enum SanctuaryCategory {
    CARE = 'CARE',
    WARNING = 'WARNING',
    PLAN = 'PLAN',
    SUPPORT = 'SUPPORT',
}

export interface SanctuaryQuestionDTO {
    question: string;
    answer: string;
    category: SanctuaryCategory;
}

export interface SanctuaryActivityDTO {
    activityQuestion: string;
    activityAnswer: string;
}

export interface SanctuarySignatureDTO {
    signature: string;
    date: string; // ISO date string
}

export interface SanctuaryPlanDTO {
    id?: number;
    name?: string;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    sanctuaryQuestions: SanctuaryQuestionDTO[];
    sanctuaryActivities: SanctuaryActivityDTO[];
    sanctuarySignatures: SanctuarySignatureDTO[];
}

export const sanctuaryPlanService = {
    createSanctuaryPlan: async (plan: SanctuaryPlanDTO): Promise<void> => {
        return apiClient(ENDPOINTS.SANCTUARY_PLAN.CREATE, {
            method: 'POST',
            body: JSON.stringify(plan),
        });
    },

    updateSanctuaryPlan: async (id: number, plan: SanctuaryPlanDTO): Promise<void> => {
        return apiClient(ENDPOINTS.SANCTUARY_PLAN.UPDATE.replace('{id}', id.toString()), {
            method: 'PUT',
            body: JSON.stringify(plan),
        });
    },
};
