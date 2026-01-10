import { useCallback, useEffect, useState } from 'react';
import { ProfileDTO, profileService } from '../services/api/profileService';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';

export const useProfile = () => {
    // Use global store for profile data
    const profile = useProfileStore(state => state.profile);
    const setProfile = useProfileStore(state => state.setProfile);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, token } = useAuthStore();
    const userId = user?.id;

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await profileService.getProfileById(userId || 0);
            setProfile(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    }, [userId, token, setProfile]);

    const updateProfile = async (updates: ProfileDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const tempId = userId || 0; // Fallback for mock/API consistency
            const updated = await profileService.updateProfile(tempId, updates);
            setProfile(updated);
            return updated;
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch or re-fetch if token/userId changes
    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [fetchProfile, token]);

    return {
        profile,
        isLoading,
        error,
        refetch: fetchProfile,
        updateProfile
    };
};
