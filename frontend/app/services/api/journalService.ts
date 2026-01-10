import { apiClient } from './apiClient';
import { ENDPOINTS } from '../../constants/config';

export interface JournalEntryDTO {
    id?: number;
    entryDate: string; // ISO date-time string
    title?: string;
    content: string;
    relatedLossId?: number;
    cognitiveDistortionsJson?: string;
    emotionalTone?: string;
}

export const journalService = {
    saveJournalEntry: async (entry: JournalEntryDTO): Promise<number> => {
        console.log("Saving journal entry:", entry);
        return apiClient<number>(ENDPOINTS.JOURNAL.SAVE, {
            method: 'POST',
            body: JSON.stringify(entry),
        });
    },

    getJournalEntries: async (
        startDate?: string,
        endDate?: string,
        page: number = 0,
        size: number = 10
    ): Promise<JournalEntryDTO[]> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        return apiClient<JournalEntryDTO[]>(`${ENDPOINTS.JOURNAL.GET_ALL}?${params.toString()}`, {
            method: 'GET',
        });
    },

    getJournalEntry: async (id: number): Promise<JournalEntryDTO> => {
        return apiClient<JournalEntryDTO>(ENDPOINTS.JOURNAL.GET_ONE.replace('{id}', id.toString()), {
            method: 'GET',
        });
    },

    updateJournalEntry: async (id: number, entry: JournalEntryDTO): Promise<void> => {
        return apiClient(ENDPOINTS.JOURNAL.UPDATE.replace('{id}', id.toString()), {
            method: 'PATCH',
            body: JSON.stringify(entry),
        });
    },

    deleteJournalEntry: async (id: number): Promise<void> => {
        return apiClient(ENDPOINTS.JOURNAL.DELETE.replace('{id}', id.toString()), {
            method: 'DELETE',
        });
    },
};
