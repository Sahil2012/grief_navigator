import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LossDTO } from '../../services/api/lossService';
import { AssessmentAnswer } from '../../store/lossStore';
import { THEME } from '../../constants/theme';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PaginatedLossViewProps {
    currentLoss: LossDTO;
    statements: any[];
    answers: AssessmentAnswer[];
    onRate: (statementId: number, lossId: number, rating: number) => void;
    RATING_LABELS: Record<number, string>;
    currentLossIndex: number;
    totalLosses: number;
    onNext: () => void;
    onPrev: () => void;
}

// Memoized Row Component to prevent unnecessary re-renders
const StatementRow = React.memo(({
    stmt,
    index,
    lossId,
    rating,
    onRate
}: {
    stmt: any,
    index: number,
    lossId: number,
    rating: number | undefined,
    onRate: (sId: number, lId: number, r: number) => void
}) => {
    const sId = stmt.id || index + 1;
    const statementText = typeof stmt === 'string' ? stmt : (stmt.statement || stmt.text);

    return (
        <View className="py-6 border-b border-gray-100 px-2">
            {/* Statement Text Only */}
            <View className="mb-5">
                <Text className="text-[17px] font-medium text-slate-800 leading-7">
                    {statementText}
                </Text>
            </View>

            {/* Individual Rating Buttons */}
            <View className="flex-row justify-between items-center px-1 mb-2">
                {[0, 1, 2, 3, 4].map((ratingVal) => {
                    const isSelected = rating === ratingVal;
                    const activeColor = THEME.COLORS.PRIMARY;

                    return (
                        <TouchableOpacity
                            key={ratingVal}
                            onPress={() => onRate(sId, lossId, ratingVal)}
                            activeOpacity={0.7}
                            className="items-center"
                        >
                            <View
                                className={`w-11 h-11 rounded-full items-center justify-center border transition-all`}
                                style={{
                                    backgroundColor: isSelected ? activeColor : 'white',
                                    borderColor: isSelected ? activeColor : '#e5e7eb',
                                }}
                            >
                                <Text className={`font-semibold text-base ${isSelected ? 'text-white' : 'text-gray-400'
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
}, (prevProps, nextProps) => {
    // Only re-render if rating changes, lossId changes, or the statement itself changes
    return prevProps.rating === nextProps.rating &&
        prevProps.lossId === nextProps.lossId &&
        prevProps.stmt === nextProps.stmt;
});

export const PaginatedLossView: React.FC<PaginatedLossViewProps> = ({
    currentLoss,
    statements,
    answers,
    onRate,
    RATING_LABELS,
    currentLossIndex,
    totalLosses,
    onNext,
    onPrev
}) => {

    // Check if at least one answer exists for this LOSS
    const hasAnswersForLoss = statements.some(s => {
        const sId = s.id || s;
        return answers.some(a => a.relatedLossId === currentLoss.id && a.statementId === sId);
    });

    return (
        <View className="flex-1">
            {/* Progress Bar - Loss Based */}
            <View className="flex-row items-center justify-between mb-2 px-1">
                <View className="flex-row items-center space-x-2">
                    <Text className="text-primary font-bold text-lg">
                        Loss {currentLossIndex + 1}
                        <Text className="text-gray-300 font-normal text-sm"> / {totalLosses}</Text>
                    </Text>
                </View>
                <View className="flex-1 h-1 bg-gray-100 rounded-full mx-4">
                    <View
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${((currentLossIndex + 1) / totalLosses) * 100}%` }}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                <Animated.View entering={FadeIn} className="px-1">

                    {/* Hero Loss Header - Minimal */}
                    <View className="mb-6 mt-2 px-2">
                        <Text className="text-xs font-bold text-primary uppercase tracking-wider mb-1 opacity-80">
                            Reflecting On
                        </Text>
                        <Text className="text-2xl font-bold text-slate-800 leading-8">
                            {currentLoss.description}
                        </Text>
                    </View>

                    {/* Clean List of Statements using Memoized Components */}
                    <View>
                        {statements.map((stmt, index) => {
                            const sId = stmt.id || index + 1;
                            const answer = answers.find(a => a.statementId === sId && a.relatedLossId === currentLoss.id);

                            return (
                                <StatementRow
                                    key={sId}
                                    stmt={stmt}
                                    index={index}
                                    lossId={currentLoss.id}
                                    rating={answer?.rating}
                                    onRate={onRate}
                                />
                            );
                        })}
                    </View>

                </Animated.View>
            </ScrollView>

            {/* Navigation Controls */}
            <View className="flex-row justify-between items-center fixed bottom-0 pt-4 pb-6 bg-white border-t border-gray-50 px-4">
                <TouchableOpacity
                    onPress={onPrev}
                    disabled={currentLossIndex === 0}
                    className={`w-12 h-12 items-center justify-center rounded-full bg-gray-50 ${currentLossIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
                >
                    <Ionicons name="arrow-back" size={24} color={THEME.COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onNext}
                    className={`px-8 py-4 rounded-full flex-row items-center bg-slate-900`}
                >
                    <Text className={`text-white font-bold text-base mr-2`}>
                        {currentLossIndex < totalLosses - 1 ? "Next Loss" : "Finish Assessment"}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={'white'} />
                </TouchableOpacity>
            </View>
        </View>
    );
};
