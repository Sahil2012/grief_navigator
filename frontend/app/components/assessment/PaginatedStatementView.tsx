import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LossDTO } from '../../services/api/lossService';
import { AssessmentAnswer } from '../../store/lossStore';
import { THEME } from '../../constants/theme';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PaginatedStatementViewProps {
    statements: any[];
    losses: LossDTO[];
    answers: AssessmentAnswer[];
    onRate: (statementId: number, lossId: number, rating: number) => void;
    RATING_LABELS: Record<number, string>;
    initialIndex: number;
    onIndexChange: (index: number) => void;
}

export const PaginatedStatementView: React.FC<PaginatedStatementViewProps> = ({
    statements,
    losses,
    answers,
    onRate,
    RATING_LABELS,
    initialIndex = 0,
    onIndexChange
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handleNext = () => {
        if (!hasAnswers) {
            Alert.alert("Incomplete", "Please provide at least one rating.");
            return;
        }
        if (currentIndex < statements.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            onIndexChange(newIndex);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            onIndexChange(newIndex);
        }
    };

    const currentStatement = statements[currentIndex];
    if (!currentStatement) return null;

    const statementId = currentStatement?.id || currentIndex + 1;
    const statementText = typeof currentStatement === 'string' ? currentStatement : (currentStatement.statement || currentStatement.text || JSON.stringify(currentStatement));

    // Check if at least one answer exists for this statement
    const hasAnswers = answers.some(a => a.statementId === statementId);

    return (
        <View className="flex-1">
            {/* Progress Bar - Minimalist */}
            <View className="flex-row items-center justify-between mb-6 px-1">
                <View className="flex-row items-center space-x-2">
                    <Text className="text-primary font-bold text-lg">
                        {currentIndex + 1}
                        <Text className="text-gray-300 font-normal text-sm"> / {statements.length}</Text>
                    </Text>
                </View>
                <View className="flex-1 h-1 bg-gray-100 rounded-full mx-4">
                    <View
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${((currentIndex + 1) / statements.length) * 100}%` }}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                <Animated.View entering={FadeIn} className="px-1">

                    {/* Hero Statement */}
                    <Text className="text-2xl font-semibold text-slate-800 leading-9 mb-8 tracking-tight">
                        {statementText}
                    </Text>

                    {/* Losses List */}
                    <View className="space-y-4">
                        {losses.map((loss) => {
                            const answer = answers.find(a => a.statementId === statementId && a.relatedLossId === loss.id);
                            const currentRating = answer?.rating;
                            const hasRating = currentRating !== undefined;

                            return (
                                <View
                                    key={loss.id}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: 20,
                                        padding: 20,
                                        // Use native shadow styles instead of utility classes to prevent crashes
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 8,
                                        elevation: 3,
                                    }}
                                    className="mb-2"
                                >
                                    <View className="flex-row justify-between items-center mb-4">
                                        <Text className="font-bold text-slate-700 text-[15px] flex-1 mr-2">
                                            {loss.description}
                                        </Text>
                                        {hasRating && (
                                            <Animated.View entering={FadeIn} className="bg-primary/10 px-3 py-1 rounded-full">
                                                <Text className="text-primary text-xs font-bold uppercase tracking-wide">
                                                    {RATING_LABELS[currentRating]}
                                                </Text>
                                            </Animated.View>
                                        )}
                                    </View>

                                    {/* Rating Strip */}
                                    <View className="bg-slate-50 rounded-xl p-1 flex-row relative h-12 items-center">
                                        {[0, 1, 2, 3, 4].map((ratingVal) => {
                                            const isSelected = currentRating === ratingVal;
                                            return (
                                                <TouchableOpacity
                                                    key={ratingVal}
                                                    onPress={() => onRate(statementId, loss.id, ratingVal)}
                                                    activeOpacity={0.8}
                                                    className="flex-1 h-full"
                                                >
                                                    <View className={`flex-1 items-center justify-center rounded-lg transition-all ${isSelected ? 'bg-white' : ''
                                                        }`}
                                                        style={isSelected ? {
                                                            shadowColor: "#000",
                                                            shadowOffset: { width: 0, height: 1 },
                                                            shadowOpacity: 0.1,
                                                            shadowRadius: 2,
                                                            elevation: 2
                                                        } : undefined}
                                                    >
                                                        <Text className={`font-bold text-base ${isSelected ? 'text-primary' : 'text-slate-300'
                                                            }`}>
                                                            {ratingVal}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {losses.length === 0 && (
                        <View className="items-center justify-center p-8 bg-gray-50 rounded-3xl mb-6 border border-dashed border-gray-200">
                            <Ionicons name="alert-circle-outline" size={32} color={THEME.COLORS.textSecondary} style={{ opacity: 0.5, marginBottom: 8 }} />
                            <Text className="text-textSecondary text-center">No active losses found.</Text>
                        </View>
                    )}

                </Animated.View>

            </ScrollView>

            {/* Navigation Controls */}
            <View className="flex-row justify-between items-center fixed bottom-0 pt-4 pb-6 bg-white border-t border-gray-50">
                <TouchableOpacity
                    onPress={handlePrev}
                    disabled={currentIndex === 0}
                    className={`w-12 h-12 items-center justify-center rounded-full bg-gray-50 ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
                >
                    <Ionicons name="arrow-back" size={24} color={THEME.COLORS.textSecondary} />
                </TouchableOpacity>

                {currentIndex < statements.length - 1 && (
                    <TouchableOpacity
                        onPress={handleNext}
                        className={`${hasAnswers ? 'bg-slate-900' : 'bg-gray-100'} px-8 py-4 rounded-2xl flex-row items-center`}
                        disabled={!hasAnswers}
                        style={hasAnswers ? {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 5
                        } : {}}
                    >
                        <Text className={`${hasAnswers ? 'text-white' : 'text-gray-400'} font-bold text-base mr-2`}>Next Statement</Text>
                        <Ionicons name="arrow-forward" size={20} color={hasAnswers ? 'white' : '#9CA3AF'} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
