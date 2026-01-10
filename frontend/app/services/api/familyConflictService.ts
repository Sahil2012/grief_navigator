import { apiClient } from './apiClient';
import { ENDPOINTS } from '../../constants/config';

export type QuestionType = 'DESCRIPTIVE' | 'RADIO' | 'MCQ' | 'MCQ_MULTI';

export interface FamilyConflictAnswerDTO {
    assessmentId: number;
    questionId: number; // User spec says long
    valueText: string;
}

// User spec for QuestionDTO had fieldId (string). AnswerDTO has questionId (long).
// We might need to map them. For now, let's assume the question response includes an 'id' that maps to questionId.
export interface FamilyConflictQuestionDTO {
    id?: number; // Added this tentatively to match AnswerDTO requirements
    sectionId: string;
    fieldId: string;
    question: string;
    type: QuestionType;
    options?: string[];
}

const questionsCache = new Map<string, FamilyConflictQuestionDTO[]>();

export const familyConflictService = {
    getQuestions: async (sectionId: string, fieldId?: string): Promise<FamilyConflictQuestionDTO[]> => {
        const cacheKey = `${sectionId}-${fieldId || 'all'}`;

        if (questionsCache.has(cacheKey)) {
            return questionsCache.get(cacheKey)!;
        }

        let url = ENDPOINTS.FAMILY_CONFLICT.QUESTIONS(sectionId);
        if (fieldId) {
            url += `?fieldId=${fieldId}`;
        }

        const data = await apiClient<FamilyConflictQuestionDTO[]>(url, { method: 'GET' });
        questionsCache.set(cacheKey, data);
        return data;
    },

    saveAnswers: async (answers: FamilyConflictAnswerDTO[]): Promise<void> => {
        return apiClient(ENDPOINTS.FAMILY_CONFLICT.ANSWERS, {
            method: 'POST',
            body: JSON.stringify(answers),
        });
    },

    startAssessment: async (): Promise<number> => { // Returns assessmentId (long)
        return apiClient<number>(ENDPOINTS.FAMILY_CONFLICT.ASSESSMENT_START, {
            method: 'POST',
        });
    },

    completeAssessment: async (assessmentId: number): Promise<void> => {
        return apiClient(ENDPOINTS.FAMILY_CONFLICT.ASSESSMENT_COMPLETE, {
            method: 'PATCH'
        });
    },
};
