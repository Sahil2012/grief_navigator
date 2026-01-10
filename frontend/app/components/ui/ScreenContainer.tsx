import React from 'react';
import { View, ViewProps, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { THEME } from '../../constants/theme';

interface ScreenContainerProps extends ViewProps {
    children: React.ReactNode;
    loading?: boolean;
    hideHeader?: boolean;
    header?: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    loading = false,
    hideHeader = true,
    header,
    className = "",
    ...props
}) => {
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color={THEME.COLORS.primary} />
            </View>
        );
    }

    return (
        <View className={`flex-1 bg-white ${className}`} {...props}>
            {hideHeader && <Stack.Screen options={{ headerShown: false }} />}

            {header}

            <View className={`flex-1 px-5 pt-5`}>
                {children}
            </View>
        </View>
    );
};
