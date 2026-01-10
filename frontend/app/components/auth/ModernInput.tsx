import React, { useState } from "react";
import { TextInput, TextInputProps, View, Text, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

interface ModernInputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode; // For password toggle etc.
    onRightIconPress?: () => void;
}

const ModernInput: React.FC<ModernInputProps> = ({
    label,
    error,
    icon,
    rightIcon,
    onRightIconPress,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Animation for border color could be added here, 
    // but simple state-based conditional styling works well for "clean" feel.

    return (
        <View className="mb-3">
            {label && (
                <Text className="text-sm font-medium text-gray-700 mb-1.5 ml-1 tracking-wide">
                    {label}
                </Text>
            )}

            <View
                className={`
          flex-row items-center bg-gray-50 border rounded-lg px-3 py-2
          ${isFocused ? 'border-gray-400 bg-white' : 'border-gray-200'}
          ${error ? 'border-red-400' : ''}
        `}
            >
                {icon && <View className="mr-2">{icon}</View>}

                <TextInput
                    className="flex-1 text-sm text-gray-900 font-medium h-full"
                    placeholderTextColor="#9CA3AF"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
            )}
        </View>
    );
};

export default ModernInput;
