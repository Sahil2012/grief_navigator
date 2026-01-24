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
    isCompleted?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
}

export const Accordion = ({ title, icon, children, defaultOpen = false, subtitle, isCompleted = false, isOpen: controlledIsOpen, onToggle }: AccordionProps) => {
    const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

    const isExpanded = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    const handleToggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (onToggle) {
            onToggle();
        } else {
            setInternalIsOpen(!internalIsOpen);
        }
    };

    return (
        <View className="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden shadow-sm">
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleToggle}
                className={`flex-row items-center justify-between p-5 ${isExpanded ? 'bg-gray-50 border-b border-gray-100' : ''}`}
            >
                <View className="flex-row items-center flex-1">
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isCompleted ? 'bg-green-100' : 'bg-primary/10'}`}>
                        <Ionicons
                            name={isCompleted ? "checkmark" : (icon || "star")}
                            size={20}
                            color={isCompleted ? THEME.COLORS.greenSoft : THEME.COLORS.primary}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className={`font-bold text-base ${isCompleted ? 'text-green-700' : 'text-textDark'}`}>
                            {title}
                        </Text>
                        {isCompleted && (
                            <Text className="text-xs text-green-600 font-medium">Completed</Text>
                        )}
                        {subtitle && !isCompleted && ( // Render subtitle only if not completed
                            <Text className="text-sm text-textSecondary mt-1">{subtitle}</Text>
                        )}
                    </View>
                </View>

                <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={THEME.COLORS.textSecondary}
                />
            </TouchableOpacity>

            {isExpanded && (
                <View className="p-5">
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        {children}
                    </Animated.View>
                </View>
            )}
        </View>
    );
};
