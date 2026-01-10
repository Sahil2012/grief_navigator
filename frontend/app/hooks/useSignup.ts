import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/api/authService';
import { STRINGS } from '../constants/strings';

export const useSignup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", STRINGS.ERRORS.PASSWORDS_DO_NOT_MATCH);
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", STRINGS.ERRORS.PASSWORD_TOO_SHORT);
            return;
        }

        setLoading(true);
        try {
            const user = await authService.signUp({ email, password });
            console.log("Signed up user:", user?.email);
            Alert.alert(STRINGS.ERRORS.SUCCESS, `Account created for ${user?.email}`);
            // Navigation could be handled here or in the component via callback
        } catch (error: any) {
            Alert.alert(STRINGS.ERRORS.SIGNUP_ERROR, error.message || STRINGS.ERRORS.GENERIC);
        } finally {
            setLoading(false);
        }
    };

    return {
        firstName, setFirstName,
        lastName, setLastName,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        showPassword, setShowPassword,
        showConfirm, setShowConfirm,
        acceptTerms, setAcceptTerms,
        showTermsModal, setShowTermsModal,
        loading,
        handleSignup,
    };
};
