import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence
} from 'react-native-reanimated';

export const JournalDetailSkeleton = () => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 1000 }),
                withTiming(0.3, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View className="flex-1 bg-[#FDFBF7] px-6 pt-5">
            {/* Title Block */}
            <Animated.View style={[animatedStyle]} className="h-10 w-3/4 bg-gray-200 rounded-lg mb-4" />

            {/* Metadata Line */}
            <Animated.View style={[animatedStyle]} className="h-4 w-48 bg-gray-200 rounded mb-8" />

            {/* Loss Chip & Actions */}
            <View className="flex-row justify-between mb-8 pb-6 border-b border-gray-100">
                <Animated.View style={[animatedStyle]} className="h-8 w-32 bg-gray-200 rounded-full" />
                <View className="flex-row gap-2">
                    <Animated.View style={[animatedStyle]} className="h-10 w-10 bg-gray-200 rounded-full" />
                    <Animated.View style={[animatedStyle]} className="h-10 w-10 bg-gray-200 rounded-full" />
                </View>
            </View>

            {/* Content Body */}
            <View className="space-y-3">
                <Animated.View style={[animatedStyle]} className="h-4 w-full bg-gray-200 rounded" />
                <Animated.View style={[animatedStyle]} className="h-4 w-full bg-gray-200 rounded" />
                <Animated.View style={[animatedStyle]} className="h-4 w-5/6 bg-gray-200 rounded" />
                <Animated.View style={[animatedStyle]} className="h-4 w-full bg-gray-200 rounded" />
                <Animated.View style={[animatedStyle]} className="h-4 w-4/5 bg-gray-200 rounded" />
                <Animated.View style={[animatedStyle]} className="h-4 w-full bg-gray-200 rounded" />
                <Animated.View style={[animatedStyle]} className="h-4 w-3/4 bg-gray-200 rounded" />
            </View>
        </View>
    );
};
