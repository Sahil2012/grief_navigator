import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/api/authService';
import { useAuthStore } from '../store/authStore';
import { STRINGS } from '../constants/strings';

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const session = await authService.login({ email, password });
            const token = session.access_token;
            useAuthStore.getState().setToken(token);

            console.log(token);
            const meData = await authService.getMeFromServer(token);
            console.log("Spring Boot response:", meData);

            Alert.alert(STRINGS.ERRORS.SUCCESS, `Welcome back, ${email}`);
            router.replace("/dashboard");
        } catch (error: any) {
            Alert.alert(STRINGS.ERRORS.SIGNUP_ERROR, error.message || STRINGS.ERRORS.GENERIC);
        } finally {
            setLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        rememberMe, setRememberMe,
        loading,
        handleLogin,
    };
};
