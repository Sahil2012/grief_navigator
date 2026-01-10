import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, Platform } from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../ui/AppHeader";
import { ScreenContainer } from "../ui/ScreenContainer";
import { lossService, LossDTO } from "../../services/api/lossService";
import { useLossStore, AssessmentAnswer } from "../../store/lossStore";
import { THEME } from "../../constants/theme";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AssessmentInstructionsView } from './AssessmentInstructionsView';
import { PaginatedLossView } from './PaginatedLossView';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Skeleton } from "../ui/Skeleton";

interface StatementAssessmentLayoutProps {
    type: 'BELIEF' | 'AVOIDANCE';
    title: string;
    subtitle: string;
    description: string;
    nextRoute: string;
    fetchStatements: () => Promise<any[]>;
    backRoute?: string;
}

export const StatementAssessmentLayout: React.FC<StatementAssessmentLayoutProps> = ({
    type,
    title,
    subtitle,
    description,
    nextRoute,
    fetchStatements,
    backRoute
}) => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [statements, setStatements] = useState<any[]>([]);
    const [losses, setLosses] = useState<LossDTO[]>([]);
    const [showInstructions, setShowInstructions] = useState(true);

    // Store actions
    const setBeliefAnswers = useLossStore(state => state.setBeliefAnswers);
    const setAvoidanceAnswers = useLossStore(state => state.setAvoidanceAnswers);

    // Store actions for indices
    const currentBeliefIndex = useLossStore(state => state.currentBeliefIndex);
    const currentAvoidanceIndex = useLossStore(state => state.currentAvoidanceIndex);
    const setCurrentBeliefIndex = useLossStore(state => state.setCurrentBeliefIndex);
    const setCurrentAvoidanceIndex = useLossStore(state => state.setCurrentAvoidanceIndex);

    // Get existing answers from store for hydration
    const storedBeliefAnswers = useLossStore(state => state.beliefAnswers);
    const storedAvoidanceAnswers = useLossStore(state => state.avoidanceAnswers);

    const initialIndex = type === 'BELIEF' ? currentBeliefIndex : currentAvoidanceIndex;

    const handleIndexChange = (index: number) => {
        if (type === 'BELIEF') {
            setCurrentBeliefIndex(index);
        } else {
            setCurrentAvoidanceIndex(index);
        }
    };

    // Initialize answers from store
    const [answers, setAnswers] = useState<AssessmentAnswer[]>(
        type === 'BELIEF' ? storedBeliefAnswers : storedAvoidanceAnswers
    );

    // Sync local answers back to store whenever they change
    useEffect(() => {
        if (type === 'BELIEF') {
            setBeliefAnswers(answers);
        } else {
            setAvoidanceAnswers(answers);
        }
    }, [answers, type, setBeliefAnswers, setAvoidanceAnswers]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [lossData, statementData] = await Promise.all([
                    lossService.getAllLosses(),
                    fetchStatements()
                ]);
                setLosses(lossData);
                setStatements(statementData);
            } catch (error) {
                console.error("Failed to load assessment data", error);
                Alert.alert("Error", "Could not load content.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const getStatementId = (item: any, index: number) => {
        return item?.id || index + 1;
    };

    // UPSERT ANSWER (Directly exposed for inline rating)
    const upsertAnswer = (statementId: number, lossId: number, rating: number) => {
        setAnswers(prev => {
            const existingIndex = prev.findIndex(a => a.statementId === statementId && a.relatedLossId === lossId);
            if (existingIndex >= 0) {
                // If clicking the same rating, toggle off (remove)
                if (prev[existingIndex].rating === rating) {
                    const newArr = [...prev];
                    newArr.splice(existingIndex, 1);
                    return newArr;
                }
                // Otherwise update
                const newArr = [...prev];
                newArr[existingIndex] = { ...newArr[existingIndex], rating };
                return newArr;
            } else {
                return [...prev, { statementId, relatedLossId: lossId, rating }];
            }
        });
    };

    const handleNext = () => {
        const allStatementsCovered = statements.every((_, index) => {
            const sId = getStatementId(statements[index], index);
            return answers.some(a => a.statementId === sId);
        });

        if (!allStatementsCovered) {
            Alert.alert("Incomplete", "Please provide at least one rating for the statement.");
            return;
        }

        if (type === 'BELIEF') {
            setBeliefAnswers(answers);
        } else {
            setAvoidanceAnswers(answers);
        }

        router.push(nextRoute as any);
    };

    const RATING_LABELS: Record<number, string> = {
        0: "Not at all",
        1: "Slightly",
        2: "Moderately",
        3: "Mostly",
        4: "Completely"
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white" style={{ paddingTop: Platform.OS === 'android' ? 48 : 0 }}>
                <View className="px-5 pb-4 flex-1">
                    <View className="flex-row items-center justify-between mb-2">
                        <View>
                            <Skeleton width={120} height={20} borderRadius={4} style={{ marginBottom: 4 }} />
                            <Skeleton width={80} height={14} borderRadius={4} />
                        </View>
                        <Skeleton width={40} height={40} borderRadius={20} />
                    </View>
                    <View className="mb-4 mt-4">
                        <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
                        <Skeleton width="90%" height={16} borderRadius={4} />
                    </View>
                    {[1, 2, 3].map((i) => (
                        <View key={i} className="mb-4 p-5 rounded-2xl border border-gray-100 bg-white">
                            <Skeleton width="80%" height={20} borderRadius={4} style={{ marginBottom: 12 }} />
                            <View className="flex-row justify-between items-center mt-2">
                                <Skeleton width="40%" height={30} borderRadius={12} />
                                <Skeleton width="30%" height={16} borderRadius={4} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    const currentLoss = losses[initialIndex];
    if (!currentLoss && losses.length > 0 && !loading) {
        // Fallback or error state if index is out of bounds
        return <View><Text>Error loading loss.</Text></View>;
    }

    const handleNextLoss = () => {
        if (initialIndex < losses.length - 1) {
            handleIndexChange(initialIndex + 1);
        } else {
            // Finish
            if (type === 'BELIEF') {
                setBeliefAnswers(answers);
            } else {
                setAvoidanceAnswers(answers);
            }
            router.push(nextRoute as any);
        }
    };

    const handlePrevLoss = () => {
        if (initialIndex > 0) {
            handleIndexChange(initialIndex - 1);
        }
    };

    return (
        <ScreenContainer header={<AppHeader title={title} subtitle={subtitle} backRoute={backRoute} />}>
            {showInstructions ? (
                <AssessmentInstructionsView onStart={() => setShowInstructions(false)} />
            ) : (
                <Animated.View className="flex-1" entering={FadeIn}>
                    <View className="mb-2 pt-1">
                        <Text className="text-base text-textSecondary leading-6 px-1">
                            {description}
                        </Text>
                    </View>

                    {currentLoss && (
                        <PaginatedLossView
                            currentLoss={currentLoss}
                            statements={statements}
                            answers={answers}
                            onRate={upsertAnswer}
                            RATING_LABELS={RATING_LABELS}
                            currentLossIndex={initialIndex}
                            totalLosses={losses.length}
                            onNext={handleNextLoss}
                            onPrev={handlePrevLoss}
                        />
                    )}
                </Animated.View>
            )}
        </ScreenContainer>
    );
};
