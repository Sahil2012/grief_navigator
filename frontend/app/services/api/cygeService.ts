import { apiClient } from "./apiClient";
import { ENDPOINTS } from "../../constants/config";

export enum CompletionStatus {
    COMPLETED = "COMPLETED",
    LOSS_PENDING = "LOSS_PENDING",
    DIFFICULTY_PENDING = "DIFFICULTY_PENDING",
    BELIEF_PENDING = "BELIEF_PENDING",
    AVOIDANCE_PENDING = "AVOIDENCE_PENDING",
    FAMILY_CONFLICT_PENDING = "FAMILY_CONFLICT_PENDING",
}

export const cygeService = {
    getReadiness: async (): Promise<CompletionStatus> => {
        try {
            const response = await apiClient<CompletionStatus>(ENDPOINTS.CYGE.READINESS);
            return response;
        } catch (error) {
            console.error("Failed to get CYGE readiness:", error);
            throw error;
        }
    },

    complete: async (status: CompletionStatus): Promise<void> => {
        try {
            await apiClient(ENDPOINTS.CYGE.COMPLETE, {
                method: 'PATCH',
                body: JSON.stringify(status)
            });
        } catch (error) {
            console.error("Failed to complete CYGE:", error);
            throw error;
        }
    }
};
