import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { Accordion } from '../../components/ui/Accordion';
import { VideoCard } from '../../components/ui/VideoCard';
import { SliderInput } from '../../components/ui/SliderInput';


export default function ToughDaysScreen() {
    const router = useRouter();

    // -- State for Body Scan --
    const [tensionBefore, setTensionBefore] = useState(5);
    const [tensionAfter, setTensionAfter] = useState(5);
    const [bodyScanReflection, setBodyScanReflection] = useState('');
    const [tensionLocation, setTensionLocation] = useState('');

    // -- State for Breathing --
    const [breathingReflection, setBreathingReflection] = useState('');

    // -- State for Emotions --
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

    const toggleEmotion = (emotion: string) => {
        if (selectedEmotions.includes(emotion)) {
            setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
        } else {
            setSelectedEmotions([...selectedEmotions, emotion]);
        }
    };

    const handleComplete = (activityName: string) => {
        Alert.alert("Activity Completed", `You've completed the ${activityName}. Great job taking time for yourself.`);
        // potentially save to backend or local store here
    };

    return (
        <ScreenContainer
            header={<AppHeader title="When Things Are Tough" subtitle="Support Tools" backRoute="/home" />}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    className="flex-1 pt-2"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50 }}
                >
                    <Text className="text-textSecondary text-base mb-6 leading-6">
                        These activities are designed to help you through particularly difficult times.
                    </Text>

                    {/* 1. Breathing Exercise */}
                    <Accordion title="Breathing Exercise (4 minutes)" icon="leaf-outline" defaultOpen={true}>
                        <Text className="text-textSecondary mb-4 leading-6">
                            A guided breathing exercise to help ground you when emotions feel overwhelming.
                        </Text>

                        {/* Video */}
                        <VideoCard videoId="2BULfMHde3Q" />

                        <Text className="text-sm font-bold text-textDark mb-2 mt-2">How do you feel after the breathing exercise?</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-base text-textDark h-24 mb-4"
                            multiline
                            textAlignVertical="top"
                            placeholder="I feel..."
                            value={breathingReflection}
                            onChangeText={setBreathingReflection}
                        />

                        <TouchableOpacity
                            className="bg-primary py-3 rounded-xl items-center"
                            onPress={() => handleComplete('Breathing Exercise')}
                        >
                            <Text className="text-white font-bold text-base">Mark as Complete</Text>
                        </TouchableOpacity>
                    </Accordion>


                    {/* 2. Body Scan Meditation */}
                    <Accordion title="Body Scan Meditation (10 minutes)" icon="body-outline">
                        <Text className="text-textSecondary mb-4 leading-6">
                            A guided body scan to help you connect with physical sensations and release tension.
                        </Text>

                        <VideoCard videoId="GwN9xiLOD_A" />

                        <View className="mt-2 mb-4">
                            <Text className="text-lg font-bold text-primary mb-4 text-center" style={{ fontFamily: 'Satisfy-Regular' }}>Reflection</Text>

                            <SliderInput
                                label="Tension before (1-10)"
                                value={tensionBefore}
                                onValueChange={setTensionBefore}
                                min={1} max={10}
                                minLabel="Relaxed" maxLabel="Tense" midLabel=""
                            />

                            <SliderInput
                                label="Tension after (1-10)"
                                value={tensionAfter}
                                onValueChange={setTensionAfter}
                                min={1} max={10}
                                minLabel="Relaxed" maxLabel="Tense" midLabel=""
                            />

                            <Text className="text-sm font-bold text-textDark mb-2 mt-2">Where did you notice tension?</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-base text-textDark mb-4"
                                placeholder="Choose an option (e.g., Shoulders, Jaw)"
                                value={tensionLocation}
                                onChangeText={setTensionLocation}
                            />

                            <Text className="text-sm font-bold text-textDark mb-2">What did you notice during the body scan?</Text>
                            <TextInput
                                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-base text-textDark h-24 mb-4"
                                multiline
                                textAlignVertical="top"
                                placeholder="Sensations, thoughts..."
                                value={bodyScanReflection}
                                onChangeText={setBodyScanReflection}
                            />

                            <TouchableOpacity
                                className="bg-primary py-3 rounded-xl items-center"
                                onPress={() => handleComplete('Body Scan')}
                            >
                                <Text className="text-white font-bold text-base">Mark as Complete</Text>
                            </TouchableOpacity>
                        </View>
                    </Accordion>


                    {/* 3. Emotions Identification Tool */}
                    <Accordion title="Emotions Identification Tool" icon="heart-outline">
                        <Text className="text-textSecondary mb-4 leading-6">
                            Understanding and naming your emotions can help you process grief more effectively.
                        </Text>

                        <VideoCard videoId="Clfhv6m8heg" />

                        <View className="mt-4">
                            <Text className="text-lg font-bold text-primary mb-4 text-center" style={{ fontFamily: 'Satisfy-Regular' }}>Select the Emotions You're Experiencing</Text>

                            {/* Joy & Happiness */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-3">
                                    <Text className="text-xl mr-2">😊</Text>
                                    <Text className="text-base font-bold text-textDark">Joy & Happiness</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2">
                                    {["Joyful", "Happy", "Pleased", "Thankful", "Confident", "Cheerful", "Delighted", "Hopeful", "Content", "Ecstatic", "Optimistic"].map((emotion) => (
                                        <TouchableOpacity
                                            key={emotion}
                                            onPress={() => toggleEmotion(emotion)}
                                            className={`px-4 py-2 rounded-full border ${selectedEmotions.includes(emotion) ? 'bg-primary/10 border-primary' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`${selectedEmotions.includes(emotion) ? 'text-primary font-bold' : 'text-textSecondary'}`}>{emotion}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Sadness & Grief */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-3">
                                    <Text className="text-xl mr-2">😢</Text>
                                    <Text className="text-base font-bold text-textDark">Sadness & Grief</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2">
                                    {["Sad", "Devastated", "Depressed", "Isolated", "Abandoned", "Sorrowful", "Despairing", "Down", "Empty", "Grieving"].map((emotion) => (
                                        <TouchableOpacity
                                            key={emotion}
                                            onPress={() => toggleEmotion(emotion)}
                                            className={`px-4 py-2 rounded-full border ${selectedEmotions.includes(emotion) ? 'bg-primary/10 border-primary' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`${selectedEmotions.includes(emotion) ? 'text-primary font-bold' : 'text-textSecondary'}`}>{emotion}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Fear & Anxiety */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-3">
                                    <Text className="text-xl mr-2">😰</Text>
                                    <Text className="text-base font-bold text-textDark">Fear & Anxiety</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2">
                                    {["Anxious", "Terrified", "Apprehensive", "Frightened", "Worried", "Panicked", "Stressed", "Alarmed", "Fearful", "Nervous"].map((emotion) => (
                                        <TouchableOpacity
                                            key={emotion}
                                            onPress={() => toggleEmotion(emotion)}
                                            className={`px-4 py-2 rounded-full border ${selectedEmotions.includes(emotion) ? 'bg-primary/10 border-primary' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`${selectedEmotions.includes(emotion) ? 'text-primary font-bold' : 'text-textSecondary'}`}>{emotion}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Anger & Frustration */}
                            <View className="mb-6">
                                <View className="flex-row items-center mb-3">
                                    <Text className="text-xl mr-2">😠</Text>
                                    <Text className="text-base font-bold text-textDark">Anger & Frustration</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2">
                                    {["Angry", "Annoyed", "Hostile", "Outraged", "Furious", "Frustrated", "Aggravated", "Livid", "Enraged"].map((emotion) => (
                                        <TouchableOpacity
                                            key={emotion}
                                            onPress={() => toggleEmotion(emotion)}
                                            className={`px-4 py-2 rounded-full border ${selectedEmotions.includes(emotion) ? 'bg-primary/10 border-primary' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`${selectedEmotions.includes(emotion) ? 'text-primary font-bold' : 'text-textSecondary'}`}>{emotion}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity
                                className="bg-primary py-3 rounded-xl items-center mt-2"
                                onPress={() => handleComplete('Emotions Identification')}
                            >
                                <Text className="text-white font-bold text-base">Mark as Complete</Text>
                            </TouchableOpacity>
                        </View>
                    </Accordion>


                    {/* 4. Qigong */}
                    <Accordion title="Qigong for Stress Relief (5 minutes)" icon="fitness-outline">
                        <Text className="text-textSecondary mb-4 leading-6">
                            Gentle movement to release stress and improve energy flow.
                        </Text>
                        {/* Placeholder video for Qigong if not provided, assuming generic or similar ID */}
                        <VideoCard videoId="7zS5pD7p_k0" />
                        <Text className="text-sm font-bold text-textDark mb-2 mt-2">How do you feel after practicing qigong?</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-base text-textDark h-36 mb-4"
                            multiline
                            textAlignVertical="top"
                            placeholder="Refelct on changes in your stress level, body tension or emotional state..."
                            value={breathingReflection}
                            onChangeText={setBreathingReflection}
                        />
                        <TouchableOpacity
                            className="bg-primary py-3 rounded-xl items-center mt-4"
                            onPress={() => handleComplete('Qigong Exercise')}
                        >
                            <Text className="text-white font-bold text-base">Mark as Complete</Text>
                        </TouchableOpacity>
                    </Accordion>

                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
