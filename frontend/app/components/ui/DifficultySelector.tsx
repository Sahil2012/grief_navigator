import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';

interface DifficultyOption {
    label: string;
    value: number;
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
    { label: 'Not difficult', value: 0 },
    { label: 'Somewhat difficult nowadays', value: 1 },
    { label: 'Difficult but manageable nowadays', value: 2 },
    { label: 'Very difficult nowadays', value: 3 },
    { label: 'One of the hardest things in my life', value: 4 },
];

interface DifficultySelectorProps {
    selectedDifficulty: number;
    onSelect: (value: number) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selectedDifficulty, onSelect }) => {
    return (
        <View className="mb-5">
            {DIFFICULTY_OPTIONS.map(opt => (
                <TouchableOpacity
                    key={opt.value}
                    className="flex-row items-center mb-2"
                    onPress={() => onSelect(opt.value)}
                >
                    <View
                        className={`w-5 h-5 mr-3 rounded-full border-2 ${selectedDifficulty === opt.value ? "border-primary" : "border-gray-400"
                            } flex items-center justify-center`}
                    >
                        {selectedDifficulty === opt.value && (
                            <View className="w-3 h-3 rounded-full bg-primary" />
                        )}
                    </View>

                    <Text
                        className={`text-base ${selectedDifficulty === opt.value
                            ? "text-primary font-bold"
                            : "text-textSecondary"
                            }`}
                    >
                        {opt.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
