import { apiClient } from './apiClient';
import { ENDPOINTS } from '../../constants/config';

export interface GriefDerailerDTO {
    derailer: string;
}

export const griefDerailerService = {
    createGriefDerailer: async (data: GriefDerailerDTO): Promise<void> => {
        await apiClient(ENDPOINTS.GRIEF_DERAILER.CREATE, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
