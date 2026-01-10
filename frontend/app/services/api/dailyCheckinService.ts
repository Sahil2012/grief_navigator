import { apiClient } from './apiClient';
import { ENDPOINTS } from '../../constants/config';

export interface DailyCheckinDTO {
    lossId: number;
    checkInDate: string; // YYYY-MM-DD
    griefIntensity: number;
    emotionsCsv: string;
    notes?: string;
}

export const dailyCheckinService = {
    saveDailyCheckin: async (data: DailyCheckinDTO): Promise<void> => {
        return apiClient(ENDPOINTS.DAILY_CHECKIN.SAVE, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getDailyCheckinStatus: async (checkInDate: string): Promise<boolean> => {
        return apiClient<boolean>(
            `${ENDPOINTS.DAILY_CHECKIN.STATUS}?checkInDate=${checkInDate}`,
            {
                method: 'GET',
            }
        );
    },
};
