import { create } from 'zustand';
import { familyConflictService, FamilyConflictQuestionDTO, FamilyConflictAnswerDTO } from '../services/api/familyConflictService';

interface FamilyConflictState {
    assessmentId: number | null;
    currentSectionIndex: number;
    answers: Record<number, string>; // questionId -> valueText
    loading: boolean;
    error: string | null;

    setAssessmentId: (id: number) => void;
    setCurrentSectionIndex: (index: number) => void;
    setAnswer: (questionId: number, value: string) => void;

    startAssessment: () => Promise<void>;
    submitSectionAnswers: (questions: FamilyConflictQuestionDTO[]) => Promise<void>;
    completeAssessment: () => Promise<void>;
    reset: () => void;
}

export const useFamilyConflictStore = create<FamilyConflictState>((set, get) => ({
    assessmentId: null,
    currentSectionIndex: 0,
    answers: {},
    loading: false,
    error: null,

    setAssessmentId: (id) => set({ assessmentId: id }),
    setCurrentSectionIndex: (index) => set({ currentSectionIndex: index }),
    setAnswer: (questionId, value) =>
        set((state) => ({ answers: { ...state.answers, [questionId]: value } })),

    startAssessment: async () => {
        set({ loading: true, error: null });
        try {
            const id = await familyConflictService.startAssessment();
            set({ assessmentId: id, currentSectionIndex: 0 });
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    submitSectionAnswers: async (questions) => {
        const { assessmentId, answers } = get();
        if (!assessmentId) throw new Error("No active assessment");

        set({ loading: true, error: null });
        try {
            // Filter answers for the provided questions
            const answersToSubmit: FamilyConflictAnswerDTO[] = questions
                .map(q => {
                    // We assume question has an ID. If not, this will fail or we need a heuristic.
                    // Based on my assumption in the service, let's treat q.id as required.
                    if (!q.id) return null;
                    const val = answers[q.id];
                    if (!val) return null; // Or handle empty answers
                    return {
                        assessmentId,
                        questionId: q.id,
                        valueText: val
                    };
                })
                .filter((a): a is FamilyConflictAnswerDTO => a !== null);

            if (answersToSubmit.length > 0) {
                await familyConflictService.saveAnswers(answersToSubmit);
            }
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    completeAssessment: async () => {
        const { assessmentId } = get();
        if (!assessmentId) return;

        set({ loading: true, error: null });
        try {
            await familyConflictService.completeAssessment(assessmentId);
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    reset: () => set({ assessmentId: null, currentSectionIndex: 0, answers: {}, error: null })
}));
