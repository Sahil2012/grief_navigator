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
    const { user } = useAuthStore();

    const userId = user?.id;

    const fetchProfile = useCallback(async () => {
        // If profile is already loaded, maybe we don't need to load again? 
        // Or we should to keep it fresh. Let's load but silently if data exists?
        // For now, simple loading.

        setIsLoading(true);
        setError(null);
        try {
            // The backend endpoint /profile uses the token to identify the user, so we don't strictly need a userId here.
            // We pass 0 as a dummy ID because the service signature currently expects a number, though it ignores it.
            const data = await profileService.getProfileById(userId || 0);
            setProfile(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    }, [userId, setProfile]);

    const updateProfile = async (updates: ProfileDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const tempId = userId || 0; // Fallback for mock/API consistency
            const updated = await profileService.updateProfile(tempId, updates);
            // Update the global store with the new data
            setProfile(updated);
            return updated;
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch if no profile data
    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, [fetchProfile, profile]);

    return {
        profile,
        isLoading,
        error,
        refetch: fetchProfile,
        updateProfile
    };
};
