import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from './components/ui/ScreenContainer';
import { AppHeader } from './components/ui/AppHeader';
import { useFamilyConflictStore } from './store/familyConflictStore';
import { FAMILY_CONFLICT_SECTIONS } from './constants/familyConflictData';

import Animated, { FadeIn } from 'react-native-reanimated';

export default function FamilyConflictScreen() {
    const router = useRouter();
    const { startAssessment, loading } = useFamilyConflictStore();

    const handleStart = async () => {
        try {
            await startAssessment();
            // Navigate to first section
            const firstSection = FAMILY_CONFLICT_SECTIONS[0];
            router.push(`/familyconflict/${firstSection.id}`);
        } catch (error) {
            console.error("Failed to start", error);
            // Alert handled by store error handling or we show UI error?
        }
    };

    return (
        <ScreenContainer header={<AppHeader title="Family Conflict" subtitle="Assessment" backRoute="/assessmentchecklist" />}>
            <Animated.View className="flex-1" entering={FadeIn}>

                <ScrollView contentContainerStyle={{ paddingBottom: 5 }} className="px-1 pt-2">
                    <Text className="text-textDark text-xl font-bold mb-4">
                        Understanding Your Situation
                    </Text>
                    <Text className="text-textSecondary text-base leading-6 mb-8">
                        This assessment helps us understand the dynamics of your family conflict so we can tailor our support to your needs. It covers the following areas:
                    </Text>

                    <View className="mb-8">
                        {FAMILY_CONFLICT_SECTIONS.map((section, index) => (
                            <View key={section.id} className="flex-row mb-5 items-start">
                                <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-4 mt-0.5">
                                    <Text className="text-primary font-bold">{index + 1}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-bold text-gray-800 mb-1">{section.title}</Text>
                                    <Text className="text-sm text-gray-500 leading-5">{section.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>


                </ScrollView>
                <View className="pt-2 pb-6">
                    <TouchableOpacity
                        className={`bg-primary py-4 rounded-xl shadow-lg flex-row justify-center items-center ${loading ? 'opacity-70' : 'active:bg-primary/90'}`}
                        onPress={handleStart}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-center font-bold text-lg">Complete Assessment</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </ScreenContainer>
    );
}
