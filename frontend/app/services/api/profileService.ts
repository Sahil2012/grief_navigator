import { API_BASE_URL } from '../../constants/config';
import { apiClient } from './apiClient';

export interface ProfileDTO {
    id?: number;
    firstName?: string;
    lastName?: string;
    bio?: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    email?: string;
    completionStatus?: 'COMPLETED' | 'LOSS_PENDING' | 'DIFFICULTY_PENDING' | 'BELIEF_PENDING' | 'AVOIDENCE_PENDING' | 'FAMILY_CONFLICT_PENDING';
}

export const profileService = {
    getMyProfile: async (): Promise<ProfileDTO> => {
        // Currently the backend endpoint is /profile/{id}, but we might not have the ID yet.
        // If the backend was updated to treat /profile as "my profile" or we get ID from auth.
        // For now, assuming we might need the ID or the backend supports a direct /profile/me style
        // equivalent (which it currently looks like it expects an ID).
        // EDIT: The current backend expects /profile/{id}.
        // However, the user wants us to build screens first. 
        // I will assume for now we might fetch it or just use a placeholder ID if running against local,
        // or if we can get it from auth store.

        // TEMPORARY: Since we don't have the ID easily on frontend yet (backend change pending),
        // we might fail here if we don't pass an ID. 
        // I'll assume we can pass a dummy '0' or similar if the backend verifies via token anyway, 
        // OR better, I will implement it such that it takes an ID, but relies on the caller to provide it.
        // But for "getMyProfile", a caller essentially wants "ME". 
        // If the backend endpoint is strictly /profile/{id}, we need that ID.

        // Let's rely on the previous context: user said "api is already there".
        // The API defined is GET /profile/{id}.

        // I'll implementation requires an ID.
        throw new Error("Implementation pending ID retrieval strategy");
    },

    getProfileById: async (id: number): Promise<ProfileDTO> => {
        return apiClient<ProfileDTO>(`${API_BASE_URL}/profile`, {
            method: 'GET',
        });
    },

    updateProfile: async (id: number, data: ProfileDTO): Promise<ProfileDTO> => {
        return apiClient<ProfileDTO>(`${API_BASE_URL}/profile`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
};
