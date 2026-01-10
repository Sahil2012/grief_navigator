import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../../constants/theme";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/api/authService";

export const DashboardHeader: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const clearToken = useAuthStore(state => state.clearToken);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning,";
        if (hour < 17) return "Good afternoon,";
        return "Good evening,";
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await authService.logout();
                        } catch (error) {
                            console.log("Logout error:", error);
                        } finally {
                            clearToken();
                            router.replace('/login');
                        }
                    }
                }
            ]
        );
    };

    const insets = useSafeAreaInsets();

    return (
        <View
            className="px-5 pb-3 bg-white flex-row justify-between items-center z-50"
            style={{
                paddingTop: insets.top + 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 5,
            }}
        >
            <View className="flex-row items-center">
                <Image
                    source={{ uri: user?.profileImage || 'https://i.pravatar.cc/150?img=32' }}
                    className="w-12 h-12 rounded-full mr-3 border-2 border-white"
                />
                <View>
                    <Text className="text-gray-400 text-xs font-medium uppercase tracking-wide">{getGreeting()}</Text>
                    <Text className="text-textDark font-bold text-xl">Sarah</Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={handleLogout}
                className="p-2 bg-gray-50 rounded-full border border-gray-100"
            >
                <Ionicons name="log-out-outline" size={24} color={THEME.COLORS.textDark} />
            </TouchableOpacity>
        </View>
    );
};
