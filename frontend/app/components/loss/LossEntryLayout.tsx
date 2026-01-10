import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../ui/ScreenContainer';
import { AppHeader } from '../ui/AppHeader';
import { DifficultySelector, DIFFICULTY_OPTIONS } from '../ui/DifficultySelector';
import { THEME } from '../../constants/theme';
import { useLossLogic, LossType } from '../../hooks/useLossLogic';
import { useLossStore } from '../../store/lossStore';

interface LossEntryLayoutProps {
    type: LossType;
    title: string;
    subtitle: string;
    description: string;
    inputLabel: string;
    placeholder: string;
    nextRoute: string;
}

import Animated, { FadeIn } from 'react-native-reanimated';

export const LossEntryLayout: React.FC<LossEntryLayoutProps> = ({
    type,
    title,
    subtitle,
    description,
    inputLabel,
    placeholder,
    nextRoute,
}) => {
    // ... (keep global and local state)
    const router = useRouter();
    const { losses, addLoss, removeLoss } = useLossLogic(type);

    // Global state for validation
    const relationshipLosses = useLossStore(state => state.relationshipLosses);
    const thingLosses = useLossStore(state => state.thingLosses);
    const identityLosses = useLossStore(state => state.identityLosses);

    const totalEntryCount = relationshipLosses.length + thingLosses.length + identityLosses.length;

    const [modalVisible, setModalVisible] = useState(false);
    const [entryTitle, setEntryTitle] = useState('');
    const [timeAgo, setTimeAgo] = useState('');
    const [difficulty, setDifficulty] = useState<number>(0);

    const handleAdd = () => {
        if (entryTitle.trim() && timeAgo.trim()) {
            addLoss({
                title: entryTitle,
                timeAgo,
                difficulty,
            });
            setEntryTitle('');
            setTimeAgo('');
            setDifficulty(0);
            setModalVisible(false);
        }
    };

    const handleNext = () => {
        // Allow navigation if we have at least one entry across ALL categories
        if (totalEntryCount > 0) {
            router.push(nextRoute as any);
        }
    };

    const getDifficultyTextColor = (val: number) => {
        if (val <= 4) return THEME.RATING_SCALE_COLORS[val];
        return THEME.RATING_SCALE_COLORS[4];
    };

    return (
        <ScreenContainer header={<AppHeader title={title} subtitle={subtitle} />}>
            <Animated.View className="flex-1" entering={FadeIn}>

                <Text className="text-base text-textSecondary mb-6 leading-6">
                    {description}
                </Text>

                {/* CONTENT */}
                <View className="flex-1">
                    <FlatList
                        data={losses}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        renderItem={({ item, index }) => {
                            const difficultyLabel = DIFFICULTY_OPTIONS.find(opt => opt.value === item.difficulty)?.label || "Difficulty";
                            const difficultyColor = getDifficultyTextColor(item.difficulty);

                            return (
                                <View className="bg-white p-4 mb-3 rounded-2xl border border-gray-100 shadow-sm flex-row items-center justify-between">
                                    {/* Details */}
                                    <View className="flex-1 mr-4">
                                        <Text className="text-lg font-bold text-textDark mb-1" numberOfLines={1} ellipsizeMode='tail'>
                                            {item.title}
                                        </Text>
                                        <View className="flex-row items-center">
                                            <Text className="text-sm text-textSecondary mr-2">{item.timeAgo}</Text>
                                            <Text className="text-xs text-gray-300 mr-2">•</Text>
                                            <Text
                                                className="text-sm font-medium"
                                                style={{ color: difficultyColor }}
                                            >
                                                {difficultyLabel}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Delete */}
                                    <TouchableOpacity
                                        onPress={() => removeLoss(index)}
                                        className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons name="trash-outline" size={18} color={THEME.COLORS.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                                <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mb-4">
                                    <Ionicons name="heart-outline" size={32} color={THEME.COLORS.textSecondary} />
                                </View>
                                <Text className="text-lg font-bold text-textDark mb-2">No entries yet</Text>
                                <Text className="text-textSecondary text-center px-10">
                                    Tap the button below to add an entry.
                                </Text>
                            </View>
                        }
                    />
                </View>

                {/* ADD BUTTON */}
                <TouchableOpacity
                    className={`flex-row items-center justify-center py-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 mb-4 ${losses.length >= 5 ? 'opacity-50' : ''}`}
                    onPress={() => setModalVisible(true)}
                    disabled={losses.length >= 5}
                >
                    <Ionicons name="add-circle" size={24} color={THEME.COLORS.primary} className="mr-2" />
                    <Text className="text-primary font-bold text-base ml-2">Add Entry</Text>
                </TouchableOpacity>

                {/* CONTINUE BUTTON */}
                <TouchableOpacity
                    className={`bg-primary py-4 rounded-xl shadow-sm mb-5 ${totalEntryCount < 1 ? 'opacity-50' : ''}`}
                    onPress={handleNext}
                    disabled={totalEntryCount < 1}
                >
                    <Text className="text-white font-bold text-lg text-center">Continue</Text>
                </TouchableOpacity>

            </Animated.View>

            {/* MODAL */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 justify-end bg-black/60"
                >
                    <View className="bg-white rounded-t-[32px] p-6 pb-10 max-h-[90%]">
                        <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-6" />

                        <Text className="text-2xl font-bold mb-6 text-textDark text-center">
                            Add Entry
                        </Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="space-y-4">
                                <View>
                                    <Text className="text-sm font-bold text-textDark mb-2 ml-1">{inputLabel}</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-base text-textDark"
                                        placeholder={placeholder}
                                        placeholderTextColor={THEME.COLORS.textSecondary}
                                        value={entryTitle}
                                        onChangeText={setEntryTitle}
                                    />
                                </View>

                                <View>
                                    <Text className="text-sm font-bold text-textDark mb-2 ml-1 mt-2">When did this happen?</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-base text-textDark"
                                        placeholder="e.g., 2 years ago, Last month"
                                        placeholderTextColor={THEME.COLORS.textSecondary}
                                        value={timeAgo}
                                        onChangeText={setTimeAgo}
                                    />
                                </View>

                                <View>
                                    <Text className="text-sm font-bold text-textDark mb-2 ml-1 mt-2">How difficult is this for you now?</Text>
                                    <DifficultySelector selectedDifficulty={difficulty} onSelect={setDifficulty} />
                                </View>
                            </View>

                            <View className="flex-row mt-8 gap-4">
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    className="flex-1 bg-gray-100 py-4 rounded-xl"
                                >
                                    <Text className="text-textDark font-bold text-base text-center">Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className={`flex-1 bg-primary py-4 rounded-xl ${!entryTitle.trim() || !timeAgo.trim() ? "opacity-50" : ""}`}
                                    onPress={handleAdd}
                                    disabled={!entryTitle.trim() || !timeAgo.trim()}
                                >
                                    <Text className="text-white font-bold text-base text-center">Add Entry</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </ScreenContainer>
    );
};
