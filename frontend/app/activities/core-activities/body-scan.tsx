import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import Slider from '@react-native-community/slider';

// Emotion options matching the reference image
const EMOTIONS = [
    { id: 'calm', label: 'Calm' },
    { id: 'anxious', label: 'Anxious' },
    { id: 'sad', label: 'Sad' },
    { id: 'angry', label: 'Angry' },
    { id: 'numb', label: 'Numb' },
    { id: 'peaceful', label: 'Peaceful' },
    { id: 'overwhelmed', label: 'Overwhelmed' },
    { id: 'other', label: 'Other' },
];

export default function BodyScanScreen() {
    const router = useRouter();

    // State
    const [duration, setDuration] = useState(2); // 2 to 20 mins
    const [tension, setTension] = useState(1); // 1 to 10
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
    const [isEmotionPickerOpen, setIsEmotionPickerOpen] = useState(false);

    const handleBegin = () => {
        // In a real app, this might start a timer or play audio
        alert(`Starting Body Scan for ${Math.floor(duration)} minutes. Tension: ${Math.floor(tension)}. Emotion: ${selectedEmotion || 'None'}`);
    };

    return (
        <ScreenContainer
            header={<AppHeader title="Body Scan" subtitle="Core Activity 1" backRoute="/activities/core-activities" />}
        >
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Instructions Card */}
                <View className="mx-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                    <Text className="text-lg font-bold text-textDark mb-4">Instructions:</Text>

                    <View className="space-y-4">
                        {[
                            "Find a comfortable position sitting or lying down",
                            "Take a few deep breaths to settle in",
                            "Bring gentle attention to each part of your body",
                            "Notice any sensations without judgment",
                            "If your mind wanders, gently bring attention back to the body scan"
                        ].map((step, index) => (
                            <View key={index} className="flex-row items-start">
                                <View className="w-6 h-6 rounded-full bg-teal-50 items-center justify-center mr-3 mt-0.5">
                                    <Text className="text-primary font-bold text-xs">{index + 1}</Text>
                                </View>
                                <Text className="text-textDark flex-1 text-base leading-6">{step}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Duration Slider */}
                <View className="mx-4 mb-10">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-textDark">Meditation duration</Text>
                        <View className="bg-teal-50 px-3 py-1 rounded-full">
                            <Text className="text-primary font-bold">{Math.floor(duration)} min</Text>
                        </View>
                    </View>

                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={2}
                        maximumValue={20}
                        step={1}
                        value={duration}
                        onValueChange={setDuration}
                        minimumTrackTintColor={THEME.COLORS.primary}
                        maximumTrackTintColor="#E5E7EB"
                        thumbTintColor={THEME.COLORS.primary}
                    />
                    <View className="flex-row justify-between px-2">
                        <Text className="text-textSecondary text-xs">2 min</Text>
                        <Text className="text-textSecondary text-xs">20 min</Text>
                    </View>
                </View>

                {/* 'Before we begin' Section */}
                <View className="mx-4 item-center mb-6">
                    <Text className="text-2xl font-bold text-center text-primary mb-8" style={{ fontFamily: 'Satisfy-Regular' }}>Before we begin:</Text>

                    {/* Tension Slider */}
                    <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-base font-bold text-textDark">Rate your tension level</Text>
                            <View className="bg-orange-50 px-3 py-1 rounded-full">
                                <Text className="text-orange-500 font-bold">{Math.floor(tension)}/10</Text>
                            </View>
                        </View>

                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={1}
                            maximumValue={10}
                            step={1}
                            value={tension}
                            onValueChange={setTension}
                            minimumTrackTintColor="#F97316" // Orange
                            maximumTrackTintColor="#E5E7EB"
                            thumbTintColor="#F97316"
                        />
                        <View className="flex-row justify-between px-2">
                            <Text className="text-textSecondary text-xs">Low (1)</Text>
                            <Text className="text-textSecondary text-xs">High (10)</Text>
                        </View>
                    </View>

                    {/* Emotion Picker */}
                    <View className="mb-8">
                        <Text className="text-base font-bold text-textDark mb-3">What emotions are you feeling right now?</Text>
                        <TouchableOpacity
                            onPress={() => setIsEmotionPickerOpen(true)}
                            className="bg-white border border-gray-200 rounded-xl p-4 flex-row justify-between items-center shadow-sm"
                        >
                            <Text className={selectedEmotion ? "text-textDark font-medium" : "text-textSecondary"}>
                                {selectedEmotion ? EMOTIONS.find(e => e.id === selectedEmotion)?.label : "Choose an option"}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color={THEME.COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Begin Button */}
                    <TouchableOpacity
                        onPress={handleBegin}
                        activeOpacity={0.8}
                        className="bg-primary w-full py-4 rounded-xl items-center shadow-lg shadow-teal-200"
                    >
                        <Text className="text-white font-bold text-lg">Begin Meditation</Text>
                    </TouchableOpacity>
                </View>

                {/* Emotion Selection Bottom Sheet Modal */}
                <Modal
                    visible={isEmotionPickerOpen}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsEmotionPickerOpen(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsEmotionPickerOpen(false)} />
                        <View className="bg-white rounded-t-3xl p-6 h-[50%]">
                            <View className="items-center mb-6">
                                <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
                            </View>
                            <Text className="text-xl font-bold text-textDark mb-6 text-center">Select an Emotion</Text>

                            <FlatList
                                data={EMOTIONS}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedEmotion(item.id);
                                            setIsEmotionPickerOpen(false);
                                        }}
                                        className={`p-4 mb-2 rounded-xl border flex-row items-center justify-between ${selectedEmotion === item.id ? 'bg-teal-50 border-teal-200' : 'border-gray-100'}`}
                                    >
                                        <Text className={`text-base ${selectedEmotion === item.id ? 'text-primary font-bold' : 'text-textDark'}`}>
                                            {item.label}
                                        </Text>
                                        {selectedEmotion === item.id && <Ionicons name="checkmark-circle" size={20} color={THEME.COLORS.primary} />}
                                    </TouchableOpacity>
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </ScreenContainer>
    );
}
