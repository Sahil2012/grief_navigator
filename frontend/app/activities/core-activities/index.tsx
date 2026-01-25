import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CoreActivity {
    id: string;
    title: string;
    description: string;
    duration: string;
    path: string;
}

const CORE_ACTIVITIES: CoreActivity[] = [
    {
        id: 'body_scan',
        title: 'Activity 1: Body Scan and Grief Awareness',
        description: 'Experience how grief manifests in your body by doing a body scan meditation and observing the physical sensations that arise.',
        duration: '10 min',
        path: 'body-scan'
    },
    {
        id: 'what_is_grief',
        title: 'Activity 2: What is Grief to You?',
        description: 'Explore your personal definition of grief and how it shapes your worldview.',
        duration: '15 min',
        path: 'what-is-grief'
    },
    {
        id: 'myth_busting',
        title: 'Activity 3: Grief Myth Busting',
        description: 'Challenge common misconceptions about grief to find your own truth.',
        duration: '10 min',
        path: 'myth-busting'
    },
    {
        id: 'naming_feelings',
        title: 'Activity 4: Naming Your Feelings',
        description: 'Practice emotional granularity by identifying and naming specific emotions.',
        duration: '5 min',
        path: 'naming-feelings'
    },
    {
        id: 'grief_obstacles',
        title: 'Activity 5: Identifying Grief Obstacles',
        description: 'Recognize the internal and external factors that might be blocking your healing.',
        duration: '20 min',
        path: 'grief-obstacles'
    },
    {
        id: 'self_compassion',
        title: 'Activity 6: Self-Compassion Practice',
        description: 'Learn to treat yourself with the same kindness you would offer a friend.',
        duration: '12 min',
        path: 'self-compassion'
    },
    {
        id: 'understanding_derailers',
        title: 'Activity 7: Understanding Derailers',
        description: 'Identify behaviors and thought patterns that derail your progress.',
        duration: '15 min',
        path: 'understanding-derailers'
    },
    {
        id: 'tracking_milestones',
        title: 'Activity 8: Tracking Your Grief Milestones',
        description: 'Acknowledge the small wins and shifts in your journey.',
        duration: '10 min',
        path: 'tracking-milestones'
    },
    {
        id: 'calming_breathing',
        title: 'Activity 9: Calming Breathing Technique',
        description: 'A simple, effective breathing exercise to reduce anxiety and overwhelm.',
        duration: '5 min',
        path: 'calming-breathing'
    },
    {
        id: 'identifying_triggers',
        title: 'Activity 10: Identifying Grief Triggers',
        description: 'Map out the situations, dates, or places that trigger intense grief.',
        duration: '15 min',
        path: 'identifying-triggers'
    },
    {
        id: 'finding_meaning',
        title: 'Activity 11: Finding Meaning in Grief',
        description: 'Explore ways to find meaning and purpose even in the midst of loss.',
        duration: '20 min',
        path: 'finding-meaning'
    },
    {
        id: 'personal_rituals',
        title: 'Activity 12: Creating Personal Grief Rituals',
        description: 'Design personal rituals to honor your loss and support your healing.',
        duration: '25 min',
        path: 'personal-rituals'
    }
];

export default function CoreActivitiesScreen() {
    const router = useRouter();
    const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);

    const toggleActivity = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedActivityId(expandedActivityId === id ? null : id);
    };

    return (
        <ScreenContainer
            header={<AppHeader title="Core Activities" subtitle="Foundational Exercises" backRoute="/activities" />}
        >
            <ScrollView
                className="flex-1 bg-gray-50"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header & Unlock Status */}
                <View className="mx-4 mt-6 mb-8">
                    {/* Premium Unlock Card */}
                    <View className="rounded-3xl shadow-lg shadow-teal-900/10 overflow-hidden mb-6">
                        <LinearGradient
                            colors={['#fff', '#f0fdfa']}
                            className="p-5 border border-teal-100/50"
                        >
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 bg-teal-100 rounded-full items-center justify-center mr-3">
                                        <Ionicons name="lock-closed" size={16} color={THEME.COLORS.primary} />
                                    </View>
                                    <Text className="text-textSecondary font-bold text-xs uppercase tracking-wider">Next Unlock</Text>
                                </View>
                                <View className="bg-teal-50 px-3 py-1 rounded-full">
                                    <Text className="text-primary text-xs font-bold">6 Days Left</Text>
                                </View>
                            </View>
                            <Text className="text-textDark font-bold text-lg mb-1">When Things Are Tough</Text>
                            <Text className="text-textSecondary text-sm mb-4">Available on January 31, 2026</Text>

                            <View className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden">
                                <View style={{ width: '60%' }} className="h-full bg-primary rounded-full" />
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Progress Summary */}
                    <View className="flex-row items-center justify-between mb-2 px-1">
                        <Text className="text-textDark font-bold text-base">Your Progress</Text>
                        <Text className="text-primary font-bold text-sm">0 of 12 Completed</Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full w-full overflow-hidden mb-4">
                        <View style={{ width: '0%' }} className="h-full bg-primary rounded-full" />
                    </View>
                    <Text className="text-textSecondary text-center text-sm">You have 12 activities remaining in this section.</Text>
                </View>

                {/* Activities List */}
                <View className="mx-4">
                    {CORE_ACTIVITIES.map((activity, index) => {
                        const isExpanded = expandedActivityId === activity.id;
                        return (
                            <View key={activity.id} className="mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => toggleActivity(activity.id)}
                                    className={`p-4 flex-row items-center justify-between ${isExpanded ? 'bg-teal-50/30' : 'bg-white'}`}
                                >
                                    <Text className={`font-bold flex-1 text-base ${isExpanded ? 'text-primary' : 'text-textDark'}`}>
                                        {activity.title}
                                    </Text>
                                    <Ionicons
                                        name="chevron-down"
                                        size={20}
                                        color={isExpanded ? THEME.COLORS.primary : THEME.COLORS.textSecondary}
                                        style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                                    />
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View className="px-5 pb-6 pt-2">
                                        <View className="w-10 h-1 bg-primary/20 rounded-full mb-4" />
                                        <Text className="text-textDark text-base leading-6 font-bold mb-2">{activity.title.split(': ')[1]}</Text>
                                        <Text className="text-textSecondary text-base leading-7 mb-6">
                                            {activity.description}
                                        </Text>

                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                <Ionicons name="time-outline" size={14} color={THEME.COLORS.textSecondary} />
                                                <Text className="text-textSecondary text-xs font-bold ml-1.5">{activity.duration}</Text>
                                            </View>

                                            <TouchableOpacity
                                                className="bg-primary px-6 py-3 rounded-xl shadow-lg shadow-teal-200 flex-row items-center"
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    // Placeholder action
                                                    // @ts-ignore
                                                    router.push(`/activities/core-activities/${activity.path}` as any);
                                                }}
                                            >
                                                <Text className="text-white font-bold mr-2">Begin Activity</Text>
                                                <Ionicons name="arrow-forward" size={16} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Bottom Spacer */}
                <View className="h-10" />
            </ScrollView>
        </ScreenContainer>
    );
}
