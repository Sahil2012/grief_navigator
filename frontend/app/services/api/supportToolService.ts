import { apiClient } from './apiClient';
import { ENDPOINTS } from '../../constants/config';

export interface SupportToolDTO {
    supportToolCategory: 'BREATHING_EXCERSISE' | 'MEDITATION' | 'IDENTIFICATION_TOOL' | 'STRESS_RELIEF';
    answer: Record<string, string>;
}

export const supportToolService = {
    /**
     * Creates a new support tool entry.
     */
    createSupportTool: async (data: SupportToolDTO): Promise<void> => {
        try {
            await apiClient(ENDPOINTS.SUPPORT_TOOL.CREATE, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Failed to create support tool entry:', error);
            throw error;
        }
    },
};
