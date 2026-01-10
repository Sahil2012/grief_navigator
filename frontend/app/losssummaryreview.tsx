import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from './components/ui/ScreenContainer';
import { AppHeader } from './components/ui/AppHeader';
import { useLossStore } from './store/lossStore';
import { THEME } from './constants/theme';
import { lossService } from './services/api/lossService';
import { cygeService, CompletionStatus } from './services/api/cygeService';

import Animated, { FadeIn } from 'react-native-reanimated';

export default function LossSummaryReviewScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const relationshipLosses = useLossStore(state => state.relationshipLosses);
    const thingLosses = useLossStore(state => state.thingLosses);
    const identityLosses = useLossStore(state => state.identityLosses);
    const clearAll = useLossStore(state => state.clearAll);

    // ... (keep handleContinue)
    const handleContinue = async () => {
        setIsLoading(true);
        try {
            // 1. Register all losses in parallel
            const promises = [];

            if (relationshipLosses.length > 0) {
                promises.push(lossService.registerLosses(relationshipLosses, 'RELATIONSHIP'));
            }
            if (thingLosses.length > 0) {
                promises.push(lossService.registerLosses(thingLosses, 'THING'));
            }
            if (identityLosses.length > 0) {
                promises.push(lossService.registerLosses(identityLosses, 'IDENTITY'));
            }

            await Promise.all(promises);

            // 2. Update CYGE Assessment Status
            await cygeService.complete(CompletionStatus.DIFFICULTY_PENDING);

            // Clear the store after successful registration
            clearAll();

            // Use replace to remove review from navigation stack
            router.replace('/difficulttimesscreen' as any);

        } catch (error) {
            console.error('Failed to save losses', error);
            Alert.alert('Error', 'Could not save your losses. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenContainer header={<AppHeader title="Reflecting on your loss" subtitle="Summary" />}>
            <Animated.View className="flex-1" entering={FadeIn}>

                <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-textDark mb-3 leading-8">
                            Thank you for sharing your story.
                        </Text>
                        <Text className="text-base text-textSecondary leading-6 mb-4">
                            We know looking at all of this can be heavy. By naming these losses, we can start to find a path through them together.
                        </Text>
                    </View>

                    {/* Summary Card */}
                    <View className="bg-primary/5 rounded-3xl p-6 mb-8 border border-primary/20">
                        <Text className="text-lg font-bold text-textDark mb-4">You have identified:</Text>

                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3 shadow-sm">
                                <Ionicons name="people" size={20} color={THEME.COLORS.primary} />
                            </View>
                            <Text className="text-base text-textDark font-medium">
                                {relationshipLosses.length} {relationshipLosses.length === 1 ? 'Relationship' : 'Relationships'}
                            </Text>
                        </View>

                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3 shadow-sm">
                                <Ionicons name="cube" size={20} color={THEME.COLORS.primary} />
                            </View>
                            <Text className="text-base text-textDark font-medium">
                                {thingLosses.length} {thingLosses.length === 1 ? 'Thing' : 'Things'}
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3 shadow-sm">
                                <Ionicons name="finger-print" size={20} color={THEME.COLORS.primary} />
                            </View>
                            <Text className="text-base text-textDark font-medium">
                                {identityLosses.length} Identity {identityLosses.length === 1 ? 'Aspect' : 'Aspects'}
                            </Text>
                        </View>
                    </View>

                    <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
                        <Text className="text-base text-textSecondary leading-6">
                            "Grief is not a disorder, a disease or a sign of weakness. It is an emotional, physical and spiritual necessity, the price you pay for love."
                        </Text>
                        <Text className="text-sm font-bold text-textDark mt-2">
                            — Earl Grollman
                        </Text>
                    </View>

                    <TouchableOpacity
                        className={`bg-primary py-4 rounded-xl shadow-sm mt-2 ${isLoading ? 'opacity-80' : ''}`}
                        onPress={handleContinue}
                        disabled={isLoading}
                        activeOpacity={0.9}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg text-center">Continue to Next Step</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </Animated.View>
        </ScreenContainer>
    );
}
