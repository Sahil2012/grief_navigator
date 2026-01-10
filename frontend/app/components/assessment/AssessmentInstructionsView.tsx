import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { THEME } from '../../constants/theme';

interface AssessmentInstructionsViewProps {
    onStart: () => void;
}

export const AssessmentInstructionsView: React.FC<AssessmentInstructionsViewProps> = ({ onStart }) => {

    // SCALE: 0 (Green) -> 4 (Red)
    const RATING_SCALE = [
        { val: 0, color: THEME.RATING_SCALE_COLORS[0], label: "Not at all", desc: "This statement does not apply to my experience with this loss." },
        { val: 1, color: THEME.RATING_SCALE_COLORS[1], label: "Slightly", desc: "I feel this way rarely or to a small degree." },
        { val: 2, color: THEME.RATING_SCALE_COLORS[2], label: "Moderately", desc: "I feel this way sometimes or with medium intensity." },
        { val: 3, color: THEME.RATING_SCALE_COLORS[3], label: "Mostly", desc: "I feel this way often or with significant intensity." },
        { val: 4, color: THEME.RATING_SCALE_COLORS[4], label: "Completely", desc: "I feel this way almost always or extremely intensely." },
    ];

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
                showsVerticalScrollIndicator={false}
                className="px-6"
            >
                <Animated.View entering={FadeIn.delay(100)} className="mb-8 items-center">
                    <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
                        <Ionicons name="information-circle" size={32} color={THEME.COLORS.primary} />
                    </View>
                    <Text className="text-2xl font-bold text-slate-800 text-center mb-2">
                        Understanding the Scale
                    </Text>
                    <Text className="text-base text-slate-500 text-center leading-6">
                        Use the color-coded scale to rate how much each statement applies to your experience with the specific loss.
                    </Text>
                </Animated.View>

                {/* Increased spacing to space-y-4 */}
                <View className="space-y-4">
                    {RATING_SCALE.map((item, index) => (
                        <Animated.View
                            key={item.val}
                            entering={FadeInDown.delay(200 + (index * 100))}
                            // Changed items-start to items-center for centering circle
                            className="flex-row items-center p-4 mt-2 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                            <View
                                className="w-12 h-12 rounded-full items-center justify-center mr-4 shadow-sm"
                                style={{ backgroundColor: item.color }}
                            >
                                <Text className="text-white font-bold text-lg">{item.val}</Text>
                            </View>
                            {/* Removed pt-1 as items are centered */}
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-slate-800 mb-1">
                                    {item.label}
                                </Text>
                                <Text className="text-sm text-slate-500 leading-5">
                                    {item.desc}
                                </Text>
                            </View>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50">
                <TouchableOpacity
                    onPress={onStart}
                    className="w-full bg-slate-900 py-4 rounded-full items-center active:bg-slate-800 transition-colors"
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-bold text-lg">
                        Start Assessment
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
