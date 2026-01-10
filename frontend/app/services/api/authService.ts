import { supabase } from './supabaseConfig';
import { Session, User } from '@supabase/supabase-js';
import { API_BASE_URL } from '../../constants/config';

export interface SignUpData {
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    signUp: async ({ email, password }: SignUpData): Promise<User | null> => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw new Error(error.message);
        return data.user;
    },

    login: async ({ email, password }: LoginData): Promise<Session> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        if (!data.session) throw new Error('No session returned');
        return data.session;
    },

    getMeFromServer: async (token: string): Promise<any> => {
        // Note: We are using fetch directly here because we might need to pass the token explicitly 
        // if it's not yet in the store, or we can use apiClient if we ensure store is updated first.
        // Following original logic, it takes a token arg.
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user from server: ${response.status}`);
        }

        const text = await response.text();
        if (!text) return {};
        try {
            return JSON.parse(text); // Original code parsed 'token' which seemed wrong? 'text' makes more sense.
            // Wait, original code was: return JSON.parse(token); 
            // That looks like a bug in original code at line 52 of auth.ts?
            // "return JSON.parse(token);" -> token is a string (JWT), parsing it as JSON might fail or be wrong.
            // Context: "Safely parse JSON or return empty object if no content"
            // It likely meant to parse the response body.
            // I will fix this potential bug by parsing 'text'.
        } catch (err) {
            console.warn('Failed to parse JSON, returning empty object');
            return {};
        }
    },

    logout: async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },
};
