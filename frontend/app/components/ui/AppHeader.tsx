import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { THEME } from '../../constants/theme';
import { useCustomBackHandler } from '@/app/hooks/useCustomBackHandler';

interface AppHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    backRoute?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, subtitle, showBack = true, backRoute }) => {
    const navigation = useNavigation();
    const canGoBack = navigation.canGoBack();
    const shouldShowBack = showBack && (canGoBack || !!backRoute);

    useCustomBackHandler(router, backRoute, shouldShowBack);

    const handleBack = () => {
        if (backRoute) {
            router.dismissTo(backRoute as any);
        } else {
            router.back();
        }
    };

    const insets = useSafeAreaInsets();

    return (
        <View className="flex-row items-center px-5 pb-4 bg-white z-50 border-b border-gray-100"
            style={{
                paddingTop: insets.top + 20, // Increased to +20 for more breathing room
            }}
        >
            {shouldShowBack && (
                <TouchableOpacity
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100 mr-4"
                    onPress={handleBack}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={22} color={THEME.COLORS.textDark} />
                </TouchableOpacity>
            )}
            <View className="flex-1 justify-center">
                {/* Hierarchy: Subtitle (Context) -> Title (Question) */}
                {subtitle && (
                    <Text className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">
                        {subtitle}
                    </Text>
                )}
                <Text className="text-xl font-bold text-textDark leading-7">
                    {title}
                </Text>
            </View>
        </View>
    );
};
