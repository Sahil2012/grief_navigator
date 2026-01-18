import { create } from 'zustand';
import { SanctuaryPlanDTO, SanctuaryQuestionDTO, SanctuarySignatureDTO } from '../services/api/sanctuaryPlanService';
import dayjs from 'dayjs';

interface SanctuaryState {
    // We hold a partial plan as the user progresses
    planData: Partial<SanctuaryPlanDTO>;

    // Actions
    setPlanData: (data: Partial<SanctuaryPlanDTO>) => void;
    addQuestion: (question: SanctuaryQuestionDTO) => void;
    setSignatures: (signatures: SanctuarySignatureDTO[]) => void;
    reset: () => void;
}

export const useSanctuaryStore = create<SanctuaryState>((set) => ({
    planData: {
        sanctuaryQuestions: [],
        sanctuaryActivities: [],
        sanctuarySignatures: [],
    },

    setPlanData: (data) =>
        set((state) => ({
            planData: { ...state.planData, ...data },
        })),

    addQuestion: (question) =>
        set((state) => ({
            planData: {
                ...state.planData,
                sanctuaryQuestions: [...(state.planData.sanctuaryQuestions || []), question],
            },
        })),

    setSignatures: (signatures) =>
        set((state) => ({
            planData: {
                ...state.planData,
                sanctuarySignatures: signatures,
            },
        })),

    reset: () =>
        set({
            planData: {
                sanctuaryQuestions: [],
                sanctuaryActivities: [],
                sanctuarySignatures: [],
            },
        }),
}));
