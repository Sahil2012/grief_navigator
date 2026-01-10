import { useAuthStore } from '../../store/authStore';
import { STRINGS } from '../../constants/strings';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const apiClient = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const token = useAuthStore.getState().token;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(endpoint, config);

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || STRINGS.ERRORS.API_REQUEST_FAILED);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : ({} as T);
    } catch (error: any) {
        throw new Error(error.message || STRINGS.ERRORS.GENERIC);
    }
};
