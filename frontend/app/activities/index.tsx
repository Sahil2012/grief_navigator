import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../constants/theme";
import { AppHeader } from "../components/ui/AppHeader";

interface ActivitySection {
    id: string;
    title: string;
    subtitle: string;
    count: number;
    total: number;
    icon: keyof typeof Ionicons.glyphMap;
    themeColor: string;
    themeBg: string; // Tailwind class-like, but we'll use hex for inline styles or map manually
}

const ACTIVITY_SECTIONS: ActivitySection[] = [
    {
        id: "safeguarding",
        title: "Safeguarding the Sanctuary",
        subtitle: "Protect your space and peace.",
        count: 0,
        total: 7,
        icon: "shield-checkmark-outline",
        themeColor: THEME.COLORS.teal,
        themeBg: "#effcfc", // Soft teal
    },
    {
        id: "finding_mix",
        title: "Finding the Right Mix",
        subtitle: "Balance your emotions and daily life.",
        count: 0,
        total: 1,
        icon: "options-outline",
        themeColor: THEME.COLORS.blueSoft,
        themeBg: "#eef2ff", // Soft blue
    },
    {
        id: "support_network",
        title: "Support Network",
        subtitle: "Connect with those who care.",
        count: 0,
        total: 1,
        icon: "people-outline",
        themeColor: THEME.COLORS.purpleSoft,
        themeBg: "#f3e8ff", // Soft purple
    },
    {
        id: "tough_times",
        title: "When Things Are Tough",
        subtitle: "Strategies for difficult moments.",
        count: 0,
        total: 1,
        icon: "rainy-outline", // Or 'fitness' or 'bandage'
        themeColor: THEME.COLORS.pinkSoft,
        themeBg: "#fdf2f8", // Soft pink
    },
    {
        id: "grief_derailers",
        title: "Grief Derailers",
        subtitle: "Identifying common setbacks.",
        count: 0,
        total: 1,
        icon: "warning-outline",
        themeColor: "#F59E0B", // Amber 500
        themeBg: "#fef3c7", // Amber 50
    },
    {
        id: "core_activities",
        title: "Core Activities",
        subtitle: "Activities to help you through your grief journey.",
        count: 0,
        total: 12,
        icon: "locate-outline",
        themeColor: "#f50b0bff", // Amber 500
        themeBg: "#fec7c7ff", // Amber 50
    },
    {
        id: "grief_milestones",
        title: "Grief Milestones",
        subtitle: "Marking significant moments in your grief journey.",
        count: 6,
        total: 6,
        icon: "flag-outline",
        themeColor: "#F59E0B", // Amber 500
        themeBg: "#fef3c7", // Amber 50
    },
];

export default function ActivityListScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1" style={{ backgroundColor: THEME.COLORS.bg }}>
            {/* Header */}
            <AppHeader title="Activities" />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

                {/* Intro */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-textDark mb-1">Your Journey</Text>
                    <Text className="text-textSecondary text-base">Step-by-step exercises for healing.</Text>
                </View>

                {/* Unlock Banner - Premium Card Style */}
                <View className="bg-white rounded-3xl p-5 mb-8 shadow-sm border border-white relative overflow-hidden">
                    {/* Subtle decoration background */}
                    <View className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50" />

                    <View className="flex-row items-start">
                        <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-3">
                            <Ionicons name="lock-closed-outline" size={20} color={THEME.COLORS.blueSoft} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Up Next</Text>
                            <Text className="text-textDark font-bold text-lg mb-1">Finding the Right Mix</Text>
                            <Text className="text-textSecondary text-sm leading-5">
                                Available in <Text className="font-bold text-textDark">3 days</Text> (Jan 17).
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Activity List */}
                <View className="space-y-4">
                    {ACTIVITY_SECTIONS.map((section, index) => (
                        <TouchableOpacity
                            key={section.id}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (section.id === "safeguarding") {
                                    router.push("/activities/safegaurding/safeguarding");
                                } else if (section.id === "finding_mix") {
                                    router.push("/activities/finding-right-mix");
                                } else if (section.id === "tough_times") {
                                    router.push("/activities/though-days");
                                } else if (section.id === "grief_derailers") {
                                    router.push("/activities/grief-derailers");
                                } else if (section.id === "grief_milestones") {
                                    router.push("/activities/grief-milestones");
                                } else if (section.id === "core_activities") {
                                    router.push("/activities/core-activities");
                                } else {
                                    router.push("/coming-soon");
                                }
                            }}
                            className="bg-white rounded-3xl p-4 flex-row items-center shadow-sm border border-white my-2"
                        >
                            {/* Icon Box */}
                            <View
                                className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                style={{ backgroundColor: section.themeBg }}
                            >
                                <Ionicons name={section.icon} size={24} color={section.themeColor} />
                            </View>

                            {/* Text Content */}
                            <View className="flex-1">
                                <Text className="text-textDark font-bold text-base mb-0.5">{section.title}</Text>
                                <Text className="text-textSecondary text-xs">{section.subtitle}</Text>
                            </View>

                            {/* Progress/Arrow */}
                            <View className="items-end pl-2">
                                {section.count === section.total ? (
                                    <Ionicons name="checkmark-circle" size={24} color={THEME.COLORS.greenSoft} />
                                ) : (
                                    <View className="flex-row items-center">
                                        <Text className="text-xs font-medium text-textSecondary mr-2">{section.count}/{section.total}</Text>
                                        <Ionicons name="chevron-forward" size={18} color={THEME.COLORS.secondary} />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}
