import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import { LayoutAnimation, Platform, ScrollView, Text, TextInput, TouchableOpacity, UIManager, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import { AppHeader } from "../../components/ui/AppHeader";
import { Button } from "@react-navigation/elements";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface ActivityItem {
    id: string;
    title: string;
    question: string;
    placeholder: string;
}

const ACTIVITIES: ActivityItem[] = [
    {
        id: "1",
        title: "Activity 1",
        question: "Watch the video above and reflect on what 'Sanctuary' means to you right now. Where do you feel most safe?",
        placeholder: "Write your reflection here...",
    },
    {
        id: "2",
        title: "Activity 2",
        question: "Identify one boundary you can set today to protect your peace. How will you implement it?",
        placeholder: "I will set a boundary by...",
    },
    {
        id: "3",
        title: "Activity 3",
        question: "Who are the people in your life that respect your sanctuary? List them below.",
        placeholder: "My support system includes...",
    },
];

export default function SafeguardingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [expandedId, setExpandedId] = useState<string | null>("1");
    const [responses, setResponses] = useState<Record<string, string>>({});

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
        }
    };

    const handleTextChange = (id: string, text: string) => {
        setResponses((prev) => ({ ...prev, [id]: text }));
    };

    const handleOpenVideo = () => {
        // Placeholder video link (replace with actual eBook/Video link)
        Linking.openURL("https://www.youtube.com/watch?v=aqz-KE-bpKQ");
    };

    return (
        <View className="flex-1" style={{ backgroundColor: THEME.COLORS.bg }}>
            <AppHeader title="Safeguarding Sanctuary" />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                {/* Video Redirect Section - Updated */}
                <View className="bg-white rounded-3xl p-3 shadow-sm border border-white mb-8">
                    <View className="rounded-2xl overflow-hidden bg-gray-900 aspect-video relative items-center justify-center">
                        {/* Optional: Add a thumbnail image here using <Image /> */}
                        <View className="absolute opacity-50 w-full h-full bg-black/40" />

                        <TouchableOpacity
                            onPress={handleOpenVideo}
                            activeOpacity={0.8}
                            className="w-16 h-16 bg-white/20 rounded-full items-center justify-center backdrop-blur-md border border-white/30"
                        >
                            <Ionicons name="play" size={32} color="white" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>

                        <Text className="text-white font-medium mt-3 tracking-wide text-xs uppercase opacity-90">
                            Watch Video Guide
                        </Text>
                    </View>
                    <View className="mt-4 px-2 mb-2 flex-row items-center justify-between">
                        <View className="flex-1 mr-4">
                            <Text className="text-lg font-bold text-textDark">Introduction</Text>
                            <Text className="text-textSecondary text-sm mt-1 leading-5">
                                Learn how to create and protect your personal sanctuary.
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleOpenVideo}
                            className="bg-gray-100 p-2.5 rounded-full"
                        >
                            <Ionicons name="open-outline" size={20} color={THEME.COLORS.textDark} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section Header */}
                <View className="flex-row items-center mb-6">
                    <View className="h-8 w-1 bg-teal-500 rounded-full mr-3" />
                    <Text className="text-xl font-bold text-textDark">Reflective Exercises</Text>
                </View>

                {/* Accordion List - Kept Same */}
                <View className="space-y-4">
                    {ACTIVITIES.map((activity, index) => {
                        const isExpanded = expandedId === activity.id;
                        return (
                            <View
                                key={activity.id}
                                className={`bg-white my-2 rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm ${isExpanded ? 'border-teal-100' : 'border-white'
                                    }`}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => toggleExpand(activity.id)}
                                    className={`flex-row items-center p-5 ${isExpanded ? 'bg-teal-50/30' : 'bg-white'}`}
                                >
                                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isExpanded ? 'bg-teal-100' : 'bg-gray-50'
                                        }`}>
                                        <Ionicons
                                            name="home"
                                            size={20}
                                            color={isExpanded ? THEME.COLORS.teal : THEME.COLORS.textSecondary}
                                        />
                                    </View>
                                    <Text className={`text-base font-bold flex-1 ${isExpanded ? 'text-teal-900' : 'text-textDark'
                                        }`}>
                                        {activity.title}
                                    </Text>
                                    <Ionicons
                                        name={isExpanded ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color={isExpanded ? THEME.COLORS.teal : THEME.COLORS.secondary}
                                    />
                                </TouchableOpacity>

                                {/* Content */}
                                {isExpanded && (
                                    <View className="px-5 pb-6 pt-1">
                                        <Text className="text-teal-700 text-sm font-medium mb-4 leading-6 bg-teal-50 p-3 rounded-xl">
                                            {activity.question}
                                        </Text>

                                        <Text className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 ml-1">
                                            Your Response
                                        </Text>
                                        <TextInput
                                            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-textDark text-base leading-6 min-h-[120px]"
                                            textAlignVertical="top"
                                            multiline
                                            placeholder={activity.placeholder}
                                            placeholderTextColor={THEME.COLORS.secondary}
                                            value={responses[activity.id] || ''}
                                            onChangeText={(text) => handleTextChange(activity.id, text)}
                                        />

                                        <View className="flex-row justify-end mt-4">
                                            <TouchableOpacity className="bg-teal-500 py-2.5 px-6 rounded-xl shadow-sm">
                                                <Text className="text-white font-bold text-sm">Save Note</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            <View
                style={{ paddingBottom: insets.bottom + 12, paddingHorizontal: 20, paddingTop: 8 }}
                className="bg-white border-t border-gray-100 shadow-sm"
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push("/activities/safegaurding/safeguarding-plan")}
                    className="bg-teal-500 rounded-2xl py-4 items-center shadow-md shadow-teal-200"
                >
                    <Text className="text-white font-bold text-lg">Create / View Safeguarding Plan</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
