import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lossService, LossDTO } from './services/api/lossService';
import { useLossStore } from './store/lossStore';
import { ScreenContainer } from './components/ui/ScreenContainer';
import { AppHeader } from './components/ui/AppHeader';
import { DifficultySelector, DIFFICULTY_OPTIONS } from './components/ui/DifficultySelector';
import { THEME } from './constants/theme';
import { useCustomBackHandler } from './hooks/useCustomBackHandler';

import Animated, { FadeIn } from 'react-native-reanimated';

export default function DifficultTimesScreen() {
  const router = useRouter();

  useCustomBackHandler(router, "/assessmentchecklist");

  const difficultTimes = useLossStore(state => state.difficultTimes);
  const addDifficultTime = useLossStore(state => state.addDifficultTime);
  const removeDifficultTime = useLossStore(state => state.removeDifficultTime);

  const [allLossLabels, setAllLossLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [dayOrTime, setDayOrTime] = useState('');
  const [difficulty, setDifficulty] = useState(0);
  const [relatedLoss, setRelatedLoss] = useState('');
  const [relatedDropdownOpen, setRelatedDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchLosses = async () => {
      try {
        const losses: LossDTO[] = await lossService.getAllLosses();
        // Since we save descriptions, we use them for the dropdown
        setAllLossLabels(losses.map(l => l.description));
      } catch (err) {
        console.error('Failed to fetch losses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLosses();
  }, []);

  const handleAdd = () => {
    if (!dayOrTime.trim() || !relatedLoss.trim()) return;

    addDifficultTime({
      dayOrTime,
      difficulty,
      relatedLoss
    });

    setDayOrTime('');
    setDifficulty(0);
    setRelatedLoss('');
    setModalVisible(false);
  };

  const handleNext = () => {
    // Navigate to review regardless of count (allow skip logic if needed, or enforce >0 in review)
    // Assuming allow skip if empty? Or enforce > 0? User said "continue enabled if size > 1" for losses.
    // For consistency, let's allow continue if > 0, or just let them skip if they have none.
    // Let's assume > 0 is better, but since it's "Difficult Times", maybe they don't have any specific ones?
    // Let's allow continue.
    router.push("/difficulttimesreview");
  };

  const getDifficultyTextColor = (val: number) => {
    if (val <= 4) return THEME.RATING_SCALE_COLORS[val];
    return THEME.RATING_SCALE_COLORS[4];
  };

  return (
    <ScreenContainer
      header={<AppHeader title="When is it hardest?" subtitle="Triggers & Timing" backRoute="/assessmentchecklist" />}
    >
      <Animated.View className="flex-1" entering={FadeIn}>

        <Text className="text-base text-textSecondary mb-6 leading-6">
          Grief often has its own schedule. Identifying specific days, times, or anniversaries that trigger you can help us prepare together.
        </Text>

        {/* LIST CONTENT */}
        <View className="flex-1">
          <FlatList
            data={difficultTimes}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => {
              const difficultyLabel = DIFFICULTY_OPTIONS.find(opt => opt.value === item.difficulty)?.label || "Difficulty";
              const difficultyColor = getDifficultyTextColor(item.difficulty);

              return (
                <View className="bg-white p-4 mb-3 rounded-2xl border border-gray-100 shadow-sm flex-row items-center justify-between">
                  <View className="flex-1 mr-4">
                    <Text className="text-lg font-bold text-textDark mb-1">
                      {item.dayOrTime}
                    </Text>

                    <View className="flex-row items-center flex-wrap">
                      <Text className="text-sm text-textSecondary mr-2">
                        Linked to: <Text className="font-medium text-textDark">{item.relatedLoss}</Text>
                      </Text>
                      <Text className="text-xs text-gray-300 mr-2">•</Text>
                      <Text className={`text-sm font-medium`} style={{ color: difficultyColor }}>
                        {difficultyLabel}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => removeDifficultTime(index)}
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
                  <Ionicons name="time-outline" size={32} color={THEME.COLORS.textSecondary} />
                </View>
                <Text className="text-lg font-bold text-textDark mb-2">No entries yet</Text>
                <Text className="text-textSecondary text-center px-10">
                  Tap the button below to add a difficult time you want to track.
                </Text>
              </View>
            }
          />
        </View>

        {/* ADD BUTTON */}
        <TouchableOpacity
          className={`flex-row items-center justify-center py-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 mb-4 ${difficultTimes.length >= 5 ? 'opacity-50' : ''}`}
          onPress={() => setModalVisible(true)}
          disabled={difficultTimes.length >= 5}
        >
          <Ionicons name="add-circle" size={24} color={THEME.COLORS.primary} className="mr-2" />
          <Text className="text-primary font-bold text-base ml-2">Add Difficult Time</Text>
        </TouchableOpacity>

        {/* NEXT BUTTON */}
        <TouchableOpacity
          className={`bg-primary py-4 rounded-xl shadow-sm mb-5`}
          onPress={handleNext}
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
          <View className="bg-white rounded-t-[32px] p-6 pb-10 h-[85%]">
            <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-6" />
            <Text className="text-2xl font-bold mb-6 text-textDark text-center">
              Add Difficult Time
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-bold text-textDark mb-2 ml-1">When is it hard?</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-base text-textDark"
                    placeholder="e.g., Saturday Mornings, Holidays"
                    placeholderTextColor={THEME.COLORS.textSecondary}
                    value={dayOrTime}
                    onChangeText={setDayOrTime}
                  />
                </View>

                <View>
                  <Text className="text-sm font-bold text-textDark mb-2 ml-1 mt-2">Which loss brings this up?</Text>

                  <View className="relative z-50">
                    {/* Custom Dropdown Trigger */}
                    <TouchableOpacity
                      className={`bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 flex-row justify-between items-center ${relatedDropdownOpen ? 'border-primary' : ''}`}
                      onPress={() => setRelatedDropdownOpen(!relatedDropdownOpen)}
                    >
                      <Text className={`text-base ${relatedLoss ? 'text-textDark' : 'text-textSecondary'}`}>
                        {relatedLoss || "Select Related Loss"}
                      </Text>
                      <Ionicons name={relatedDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color={THEME.COLORS.textSecondary} />
                    </TouchableOpacity>

                    {/* Dropdown Content */}
                    {relatedDropdownOpen && (
                      <View className="absolute top-full w-full my-1 z-50 bg-white border border-gray-100 rounded-xl max-h-40 overflow-hidden shadow-lg elevation-5">
                        <ScrollView nestedScrollEnabled>
                          {allLossLabels.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              className="px-4 py-3 border-b border-gray-50 active:bg-gray-50"
                              onPress={() => {
                                setRelatedLoss(item);
                                setRelatedDropdownOpen(false);
                              }}
                            >
                              <Text className="text-textDark text-base">{item}</Text>
                            </TouchableOpacity>
                          ))}
                          {allLossLabels.length === 0 && (
                            <Text className="px-4 py-3 text-textSecondary italic">No losses found</Text>
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-bold text-textDark mb-2 ml-1 mt-2">How difficult is it?</Text>
                  <DifficultySelector selectedDifficulty={difficulty} onSelect={setDifficulty} />
                </View>
              </View>
            </ScrollView>

            <View className="flex-row mt-6 gap-4">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-gray-100 py-4 rounded-xl"
              >
                <Text className="text-textDark font-bold text-base text-center">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 bg-primary py-4 rounded-xl ${!dayOrTime.trim() || !relatedLoss.trim() ? "opacity-50" : ""}`}
                onPress={handleAdd}
                disabled={!dayOrTime.trim() || !relatedLoss.trim()}
              >
                <Text className="text-white font-bold text-base text-center">Add Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}
