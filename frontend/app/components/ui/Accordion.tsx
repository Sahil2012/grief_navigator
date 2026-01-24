import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

interface AccordionProps {
    title: string;
    icon?: keyof typeof Ionicons.glyphMap; // Allow passing an icon name
    children: React.ReactNode;
    defaultOpen?: boolean;
    subtitle?: string;
}

export const Accordion = ({ title, icon, children, defaultOpen = false, subtitle }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleOpen = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    return (
        <View className="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden shadow-sm">
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleOpen}
                className={`flex-row items-center justify-between p-5 ${isOpen ? 'bg-gray-50 border-b border-gray-100' : ''}`}
            >
                <View className="flex-row items-center flex-1">
                    {icon && (
                        <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-4">
                            <Ionicons name={icon} size={22} color={THEME.COLORS.primary} />
                        </View>
                    )}
                    <View className="flex-1">
                        <Text className="text-base font-bold text-textDark">{title}</Text>
                        {subtitle && (
                            <Text className="text-sm text-textSecondary mt-1">{subtitle}</Text>
                        )}
                    </View>
                </View>

                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={THEME.COLORS.textSecondary}
                />
            </TouchableOpacity>

            {isOpen && (
                <View className="p-5">
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        {children}
                    </Animated.View>
                </View>
            )}
        </View>
    );
};
