import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { Accordion } from '../../components/ui/Accordion';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '@/app/constants/theme';
import * as Progress from 'react-native-progress';
import { griefDerailerService } from '../../services/api/griefDerailerService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function GriefDerailersScreen() {
    const router = useRouter();
    const [reflection, setReflection] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!reflection.trim()) {
            Alert.alert("Empty Reflection", "Please write something before saving.");
            return;
        }

        setIsLoading(true);
        try {
            await griefDerailerService.createGriefDerailer({ derailer: reflection });
            setIsCompleted(true);
            Alert.alert("Success", "Grief derailer reflection saved successfully.");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to save reflection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenContainer
            header={<AppHeader title="Grief Derailers" subtitle="Understanding Patterns" backRoute="/activities" />}
        >
            <KeyboardAwareScrollView
                className="flex-1 pt-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                enableOnAndroid={true}
                extraScrollHeight={100}
            >
                {/* Intro Text */}
                <Text className="text-textSecondary text-base mb-6 leading-7">
                    Derailers are patterns that limit exposure to grief-related learning experiences and can keep you stuck. This activity helps you recognize and address these patterns so you can move forward in your healing journey.
                </Text>

                {/* Progress Indicator */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-sm font-bold text-textDark">
                            {isCompleted ? "All activities completed" : "1 activity remaining"}
                        </Text>
                        <Text className="text-sm font-bold text-primary">
                            {isCompleted ? "100%" : "0%"}
                        </Text>
                    </View>
                    <Progress.Bar
                        progress={isCompleted ? 1 : 0}
                        width={null}
                        height={8}
                        color={THEME.COLORS.primary}
                        unfilledColor={THEME.COLORS.gray200}
                        borderWidth={0}
                        borderRadius={4}
                    />
                </View>

                {/* Activity Accordion */}
                <Accordion
                    title="Identifying Grief Derailers"
                    defaultOpen={true}
                    icon="alert-circle-outline"
                    isCompleted={isCompleted}
                >
                    <View className="mb-4">
                        <Text className="text-lg font-bold text-textDark mb-2">Identifying Grief Derailers</Text>
                        <Text className="text-textSecondary text-base mb-4 leading-6">
                            Recognize patterns that may be derailing your grief processing.
                        </Text>

                        {/* Benefit Box */}
                        <View className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                            <Text className="text-blue-800 font-bold mb-1">Benefit</Text>
                            <Text className="text-blue-700 leading-5">
                                Helps reduce patterns that interfere with adaptive grief processing.
                            </Text>
                        </View>

                        {/* Steps */}
                        <Text className="text-base font-bold text-textDark mb-3">Steps:</Text>
                        <View className="mb-6">
                            {[
                                "Reflect on tendencies toward disbelief or protest about the situation",
                                "Notice 'what if' thinking patterns",
                                "Identify instances of blame (self or others)",
                                "Develop strategies to acknowledge these derailers when they appear"
                            ].map((step, index) => (
                                <View key={index} className="flex-row mb-3">
                                    <Text className="text-primary mr-2 text-lg">•</Text>
                                    <Text className="text-textSecondary text-base leading-6 flex-1">{step}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Reflection Section */}
                        <Text className="text-lg font-bold text-textDark mb-3">Reflect on your experience:</Text>
                        <Text className="text-textSecondary text-sm mb-2">Your reflection:</Text>

                        <TextInput
                            className={`bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-base text-textDark h-40 mb-6 ${isCompleted ? 'opacity-60' : ''}`}
                            multiline
                            textAlignVertical="top"
                            placeholder="Reflect on your thoughts, feelings, and insights from this activity..."
                            value={reflection}
                            onChangeText={setReflection}
                            editable={!isCompleted}
                        />

                        <TouchableOpacity
                            className={`py-3.5 rounded-xl items-center shadow-sm ${isCompleted ? 'bg-gray-300' : 'bg-primary'}`}
                            onPress={handleSave}
                            disabled={isCompleted || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-base">
                                    {isCompleted ? "Saved" : "Save Reflection"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </Accordion>
            </KeyboardAwareScrollView>
        </ScreenContainer>
    );
}
