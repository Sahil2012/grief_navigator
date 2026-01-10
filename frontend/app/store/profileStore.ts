import { create } from 'zustand';
import { ProfileDTO } from '../services/api/profileService';

interface ProfileState {
    profile: ProfileDTO | null;
    setProfile: (profile: ProfileDTO) => void;
    clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
    clearProfile: () => set({ profile: null }),
}));
