import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence
} from 'react-native-reanimated';

const SkeletonItem = () => {
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
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 h-[160px]">
            <View className="flex-row justify-between items-center mb-4">
                <Animated.View style={[animatedStyle]} className="h-6 w-24 bg-gray-200 rounded-lg" />
                <Animated.View style={[animatedStyle]} className="h-6 w-6 bg-gray-200 rounded-full" />
            </View>

            <Animated.View style={[animatedStyle]} className="h-6 w-3/4 bg-gray-200 rounded mb-3" />

            <Animated.View style={[animatedStyle]} className="h-4 w-full bg-gray-200 rounded mb-2" />
            <Animated.View style={[animatedStyle]} className="h-4 w-full bg-gray-200 rounded mb-2" />
            <Animated.View style={[animatedStyle]} className="h-4 w-2/3 bg-gray-200 rounded" />
        </View>
    );
};

export const JournalHistorySkeleton = () => {
    return (
        <View className="px-5">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
        </View>
    );
};
