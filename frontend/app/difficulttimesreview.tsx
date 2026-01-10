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
import { DIFFICULTY_OPTIONS } from './components/ui/DifficultySelector';

export default function DifficultTimesReviewScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Get store data
    const difficultTimes = useLossStore(state => state.difficultTimes);
    const clearAll = useLossStore(state => state.clearAll);

    const handleContinue = async () => {
        setIsLoading(true);
        try {
            // Fetch latest losses to ensure we have IDs
            const allLosses = await lossService.getAllLosses();

            // Format rows for service
            const formattedRows = difficultTimes.map(dt => ({
                dayOrTime: dt.dayOrTime,
                difficulty: dt.difficulty,
                relatedLossDescription: dt.relatedLoss
            }));

            // Save
            await lossService.registerDifficultTimes(formattedRows, allLosses);

            // Update Status (Move to Beliefs)
            await cygeService.complete(CompletionStatus.BELIEF_PENDING);
            clearAll();
            // Use replace to remove review from stack
            router.replace('/beliefsscreen' as any);

        } catch (error) {
            console.error("Failed to save difficult times:", error);
            Alert.alert("Error", "Failed to save data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenContainer header={<AppHeader title="Reflecting on timing" subtitle="Summary" />}>


            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-textDark mb-3 leading-8">
                        Understanding your triggers is halfway to healing.
                    </Text>
                    <Text className="text-base text-textSecondary leading-6 mb-4">
                        By identifying these specific moments this we can build a plan to support you when you need it most.
                    </Text>
                </View>

                {/* Summary Card */}
                <View className="bg-primary/5 rounded-3xl p-6 mb-8 border border-primary/20">
                    <Text className="text-lg font-bold text-textDark mb-4">You've identified:</Text>

                    {difficultTimes.length === 0 ? (
                        <Text className="text-textSecondary italic">No specific difficult times logged.</Text>
                    ) : (
                        difficultTimes.map((item, index) => (
                            <View key={index} className="mb-4 last:mb-0 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                <View className="flex-row items-center mb-1">
                                    <Ionicons name="time" size={16} color={THEME.COLORS.primary} className="mr-2" style={{ marginRight: 8 }} />
                                    <Text className="text-base font-bold text-textDark">{item.dayOrTime}</Text>
                                </View>
                                <Text className="text-sm text-textSecondary ml-6">
                                    Linked to {item.relatedLoss} • <Text className="text-primary">{DIFFICULTY_OPTIONS.find(d => d.value === item.difficulty)?.label}</Text>
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
                    <Text className="text-base text-textSecondary leading-6 italic">
                        "The reality is that you will heal forever. You will not 'get over' the loss of a loved one; you will learn to live with it. You will heal and you will rebuild yourself around the loss you have suffered."
                    </Text>
                    <Text className="text-sm font-bold text-textDark mt-2">
                        — Elisabeth Kübler-Ross
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
                        <Text className="text-white font-bold text-lg text-center">Continue to Beliefs</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </ScreenContainer>
    );
}
