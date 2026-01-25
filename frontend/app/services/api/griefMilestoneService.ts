import { apiClient } from './apiClient';
import { ENDPOINTS } from '../../constants/config';

export enum GriefFocus {
    UNDERSTAND_AND_ACCEPT_LOSS = "UNDERSTAND_AND_ACCEPT_LOSS",
    MANAGE_EMITIONS = "MANAGE_EMITIONS", // Typo in backend as per contract
    FUTURE = "FUTURE",
    STRENGTHENING_RELATIONSHIPS = "STRENGTHENING_RELATIONSHIPS",
    STORY_OF_LOSS = "STORY_OF_LOSS",
    GIREF_TRIGGERS = "GIREF_TRIGGERS" // Typo in backend as per contract
}

export interface GriefMilestoneDTO {
    focus: GriefFocus;
    timeDuration: number;
    reflections: Record<string, string>;
    indicators: string[];
}

export const griefMilestoneService = {
    createGriefMilestone: async (data: GriefMilestoneDTO): Promise<void> => {
        return apiClient(ENDPOINTS.GRIEF_MILESTONE.CREATE, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
