import { apiClient } from './apiClient';
import { ENDPOINTS } from '../../constants/config';
import { LossRow } from '../../store/lossStore';

export interface LossDTO {
    id: number;
    type: 'RELATIONSHIP' | 'THING' | 'IDENTITY';
    description: string;
    difficulty: 'ZERO' | 'ONE' | 'TWO' | 'THREE' | 'FOUR';
    time: string;
}

export interface DifficultTimePayload {
    dayOrTime: string;
    difficulty: 'ZERO' | 'ONE' | 'TWO' | 'THREE' | 'FOUR';
    relatedLoss: number;
}

export interface BeliefEntryDTO {
    beliefStatementId: number;
    rating: number;
    relatedLoss: number;
}

export interface AvoidenceEntryDTO {
    avoidenceStatementId: number;
    rating: number;
    relatedLoss: number;
}

export interface StatementDTO {
    id: number;
    statement: string;
}

export const lossService = {
    registerLosses: async (
        losses: LossRow[],
        type: 'RELATIONSHIP' | 'THING' | 'IDENTITY'
    ) => {
        const payload = losses.map(loss => ({
            type,
            description: loss.title,
            difficulty: ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR'][loss.difficulty] || 'ZERO',
            time: loss.timeAgo,
        }));

        return apiClient(ENDPOINTS.LOSS.REGISTER, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    getAllLosses: async (): Promise<LossDTO[]> => {
        return apiClient<LossDTO[]>(ENDPOINTS.LOSS.GET_ALL, {
            method: 'GET',
        });
    },

    registerDifficultTimes: async (
        rows: {
            dayOrTime: string;
            difficulty: number;
            relatedLossDescription: string;
        }[],
        allLosses: LossDTO[]
    ) => {
        const difficultyEnum = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR'];
        const payload: DifficultTimePayload[] = rows.map(r => {
            const match = allLosses.find(l => l.description === r.relatedLossDescription);
            return {
                dayOrTime: r.dayOrTime,
                difficulty: difficultyEnum[r.difficulty] as DifficultTimePayload['difficulty'],
                relatedLoss: match?.id || 0,
            };
        });
        console.log(payload);

        return apiClient(ENDPOINTS.DIFFICULT_TIMES.REGISTER, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    getBeliefStatements: async (): Promise<StatementDTO[]> => {
        return apiClient<StatementDTO[]>(ENDPOINTS.BELIEF.STATEMENTS, { method: 'GET' });
    },

    saveBeliefEntries: async (entries: BeliefEntryDTO[]): Promise<void> => {
        return apiClient(ENDPOINTS.BELIEF.ENTRIES, {
            method: 'POST',
            body: JSON.stringify(entries),
        });
    },

    getAvoidenceStatements: async (): Promise<StatementDTO[]> => {
        return apiClient<StatementDTO[]>(ENDPOINTS.AVOIDANCE.STATEMENTS, { method: 'GET' });
    },

    saveAvoidenceStatements: async (statements: string[]): Promise<void> => {
        return apiClient(ENDPOINTS.AVOIDANCE.STATEMENTS, {
            method: 'POST',
            body: JSON.stringify(statements),
        });
    },

    saveAvoidenceEntries: async (entries: AvoidenceEntryDTO[]): Promise<void> => {
        return apiClient(ENDPOINTS.AVOIDANCE.ENTRIES, {
            method: 'POST',
            body: JSON.stringify(entries),
        });
    },
};
