import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CompletionStatus, cygeService } from './services/api/cygeService';
import { ScreenContainer } from './components/ui/ScreenContainer';
import { AppHeader } from './components/ui/AppHeader';
import { THEME } from './constants/theme';
import { Skeleton } from './components/ui/Skeleton';

const STEPS = [
    {
        id: CompletionStatus.LOSS_PENDING,
        title: "Tell us about your loss",
        description: "Sharing your story is the first step.",
        route: "/losssummary"
    },
    {
        id: CompletionStatus.DIFFICULTY_PENDING,
        title: "What times are hardest?",
        description: "Identify moments that trigger grief.",
        route: "/difficulttimesscreen"
    },
    {
        id: CompletionStatus.BELIEF_PENDING,
        title: "What are your beliefs?",
        description: "Explore thoughts shaping your experience.",
        route: "/beliefsscreen"
    },
    {
        id: CompletionStatus.AVOIDANCE_PENDING,
        title: "Are there things you avoid?",
        description: "Recognize patterns of avoidance.",
        route: "/griefavoidancescreen"
    },
    {
        id: CompletionStatus.FAMILY_CONFLICT_PENDING,
        title: "How is your support system?",
        description: "Understanding your environment is key.",
        route: "/familyconflictscreen"
    },
];

export default function AssessmentChecklistScreen() {
    const router = useRouter();
    const { initialStatus } = useLocalSearchParams();

    // Initialize with passed param if available to avoid unnecessary loading state
    const [readiness, setReadiness] = useState<CompletionStatus | null>(
        (initialStatus as CompletionStatus) || null
    );
    const [loading, setLoading] = useState(!initialStatus);

    useFocusEffect(
        React.useCallback(() => {
            const checkReadiness = async () => {
                // If we don't have data, show loading. If we do (from params), keep showing content while we re-verify.
                if (!readiness) setLoading(true);

                try {
                    const status = await cygeService.getReadiness();
                    setReadiness(status);
                } catch (error) {
                    console.error("Failed to check readiness", error);
                } finally {
                    setLoading(false);
                }
            };
            checkReadiness();
        }, [])
    );

    const enterCyge = useCallback((route: string) => {
        router.push(route as any);
    }, [])

    const getStatusIndex = (status: CompletionStatus | null) => {
        if (!status) return -1;
        if (status === CompletionStatus.COMPLETED) return STEPS.length;
        return STEPS.findIndex(s => s.id === status);
    };

    const currentStepIndex = getStatusIndex(readiness);

    return (
        <ScreenContainer header={<AppHeader title="Your Journey" subtitle="Personal Profile" />}>

            {/* Conversational Intro - Fixed */}
            <View className="my-2 px-5">
                <Text className="text-2xl font-bold text-textDark mb-2 leading-8">
                    Let's walk through this together.
                </Text>
                <Text className="text-base text-textSecondary leading-6">
                    We'll take this one step at a time. Your answers help us tailor a healing plan just for you.
                </Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {loading && !readiness ? (
                    <View className="relative">
                        {/* Vertical Connecting Line Skeleton */}
                        <View className="absolute left-[19px] top-4 bottom-10 w-[2px] bg-gray-100 z-0" />

                        {[1, 2, 3, 4, 5].map((_, index) => (
                            <View key={index} className="flex-row mb-6 z-10">
                                {/* Timeline Node Skeleton */}
                                <View className="w-10 h-10 rounded-full bg-white border-4 border-gray-100 items-center justify-center mr-4">
                                    <Skeleton width={12} height={12} borderRadius={6} />
                                </View>

                                {/* Card Skeleton */}
                                <View className="flex-1">
                                    <View className="rounded-2xl p-5 border border-gray-100 bg-white">
                                        <Skeleton width="60%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
                                        <Skeleton width="90%" height={14} borderRadius={4} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View className="relative">
                        {/* Vertical Connecting Line */}
                        <View
                            className="absolute left-[19px] top-4 bottom-10 w-[2px] bg-gray-200 z-0"
                        />

                        {STEPS.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const isLocked = index > currentStepIndex;

                            return (
                                <View key={index} className="flex-row mb-6 z-10">
                                    {/* Timeline Node */}
                                    <View className={`w-10 h-10 rounded-full items-center justify-center border-4 mr-4 bg-white ${isCompleted ? 'border-primary' :
                                        isCurrent ? 'border-primary' :
                                            'border-gray-200'
                                        }`}>
                                        {isCompleted && <Ionicons name="checkmark" size={16} color={THEME.COLORS.primary} />}
                                        {isCurrent && <View className="w-3 h-3 bg-primary rounded-full" />}
                                        {isLocked && <View className="w-2 h-2 bg-gray-300 rounded-full" />}
                                    </View>

                                    {/* Content Card */}
                                    <View className="flex-1">
                                        <View
                                            className={`rounded-2xl p-5 border ${isCurrent
                                                ? 'bg-white border-primary'
                                                : 'bg-transparent border-transparent'
                                                }`}
                                            style={
                                                isCurrent ? {
                                                    shadowColor: '#000',
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 2,
                                                    },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,
                                                    elevation: 5,
                                                } : undefined
                                            }
                                        >
                                            <Text className={`text-base font-bold mb-1 ${isCurrent ? 'text-textDark text-lg' :
                                                isCompleted ? 'text-textDark' :
                                                    'text-gray-400'
                                                }`}>
                                                {step.title}
                                            </Text>

                                            <Text className={`text-sm mb-3 ${isCurrent ? 'text-textSecondary' : 'text-gray-400 hidden'
                                                }`}>
                                                {step.description}
                                            </Text>

                                            {isCurrent && (
                                                <TouchableOpacity
                                                    onPress={() => enterCyge(step.route)}
                                                    activeOpacity={0.8}
                                                    className="bg-primary self-start px-6 py-3 rounded-xl mt-1 shadow-sm flex-row items-center"
                                                >
                                                    <Text className="text-white font-bold mr-2">Begin Step</Text>
                                                    <Ionicons name="arrow-forward" size={16} color="white" />
                                                </TouchableOpacity>
                                            )}

                                            {isCompleted && (
                                                <Text className="text-primary text-xs font-bold mt-1">
                                                    Completed
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {!loading && readiness === CompletionStatus.COMPLETED && (
                    <View className="bg-green-50 rounded-3xl p-6 items-center border border-green-100 mt-4">
                        <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-4 shadow-sm">
                            <Ionicons name="heart" size={32} color={THEME.COLORS.primary} />
                        </View>
                        <Text className="text-xl font-bold text-textDark mb-2">Profile Complete</Text>
                        <Text className="text-center text-textSecondary mb-6">
                            Thank you for sharing your journey. We are ready to support you.
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/dashboard')}
                            className="bg-primary px-8 py-3 rounded-xl w-full"
                        >
                            <Text className="text-white font-bold text-center">Go to Dashboard</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </ScreenContainer>
    );
}
