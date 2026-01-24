import React from 'react';
import { View, Text, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { THEME } from '../../constants/theme';

interface SliderInputProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    minLabel?: string;
    midLabel?: string;
    maxLabel?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}

export const SliderInput = ({
    label,
    value,
    onValueChange,
    minLabel = "Much worse",
    midLabel = "No change",
    maxLabel = "Much better",
    min = -3,
    max = 3,
    step = 1,
    disabled = false
}: SliderInputProps) => {
    return (
        <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-textDark font-medium text-sm">{label}</Text>
                <Text className={`font-bold ${value > 0 ? 'text-teal-600' : value < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {value > 0 ? '+' : ''}{value}
                </Text>
            </View>

            <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs text-textSecondary">{min}</Text>
                <Text className="text-xs text-textSecondary">{max}</Text>
            </View>

            <Slider
                style={{ width: '100%', height: 40, opacity: disabled ? 0.5 : 1 }}
                minimumValue={min}
                maximumValue={max}
                step={1}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor={THEME.COLORS.primary}
                maximumTrackTintColor={THEME.COLORS.gray200}
                thumbTintColor={THEME.COLORS.primary}
                disabled={disabled}
            />

            <View className="flex-row justify-between mt-1">
                <Text className="text-[10px] text-textSecondary w-1/3 text-left">{minLabel}</Text>
                <Text className="text-[10px] text-textSecondary w-1/3 text-center">{midLabel}</Text>
                <Text className="text-[10px] text-textSecondary w-1/3 text-right">{maxLabel}</Text>
            </View>
        </View>
    );
};
