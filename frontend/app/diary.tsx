import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useRouter } from "expo-router";

import { THEME } from "./constants/theme";
import { journalService } from "./services/api/journalService";
import { lossService, LossDTO } from "./services/api/lossService";
import { Skeleton } from "./components/ui/Skeleton";
import { AppHeader } from "./components/ui/AppHeader";
import { JournalEditor } from "./components/journal/JournalEditor";
import { LossSelector } from "./components/journal/LossSelector";

const DiaryScreen: React.FC = () => {
  const router = useRouter();
  const colors = THEME.COLORS;

  // Parent State (Synced Debounced)
  const [entry, setEntry] = useState("");
  const [title, setTitle] = useState("");
  const [selectedLossId, setSelectedLossId] = useState<number | null>(null);

  // Key to force re-mounting of the editor on reset
  const [formKey, setFormKey] = useState(0);

  const [availableLosses, setAvailableLosses] = useState<LossDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLosses();
  }, []);

  const fetchLosses = async () => {
    try {
      setIsLoading(true);
      const losses = await lossService.getAllLosses();
      setAvailableLosses(losses);
    } catch (error) {
      console.error("Failed to fetch losses:", error);
      Alert.alert("Error", "Failed to load your losses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for debounced updates from the Editor
  const handleEntryChange = useCallback((newTitle: string, newContent: string) => {
    setTitle(newTitle);
    setEntry(newContent);
  }, []);

  const handleSelectLoss = useCallback((id: number | null) => {
    setSelectedLossId(id);
  }, []);

  const handleSave = async () => {
    if (!selectedLossId) {
      Alert.alert("Connection Required", "Please select a related loss to connect this entry to your grief journey.");
      return;
    }

    if (!entry.trim() || entry.length < 50) {
      Alert.alert("Reflect a bit more", "Please write at least 50 characters to truly capture your thoughts.");
      return;
    }

    try {
      setIsSaving(true);
      await journalService.saveJournalEntry({
        entryDate: new Date().toISOString(),
        title: title.trim() || undefined,
        content: entry,
        relatedLossId: selectedLossId,
      });

      Alert.alert("Journal Saved", "Your entry has been safely stored.", [
        {
          text: "Done",
          onPress: () => {
            // Reset parent state
            setEntry("");
            setTitle("");
            setSelectedLossId(null);
            // Increment key to force JournalEditor to remount and reset its local state
            setFormKey(prev => prev + 1);
          }
        }
      ]);
    } catch (error) {
      console.error("Failed to save journal entry:", error);
      Alert.alert("Error", "Failed to save journal entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <AppHeader title="Grief Journal" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          className="flex-1 px-5 pt-6"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} className="mb-6">
            <View className="flex-row items-center mb-2">
              <View className="p-2 bg-purple-100 rounded-xl mr-3">
                <FontAwesome6 name="book-open" size={20} color={colors.purpleSoft} />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                Today's Reflection
              </Text>
            </View>
            <Text className="text-gray-500 text-base leading-6 ml-1">
              Processing your emotions is a vital part of healing. Take your time.
            </Text>
          </Animated.View>

          {isLoading ? (
            <Animated.View entering={FadeInDown.delay(200)} layout={Layout}>
              <Skeleton width="100%" height={200} borderRadius={24} style={{ marginBottom: 20 }} />
              <Skeleton width="100%" height={60} borderRadius={16} />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.delay(300).springify()}>

              <JournalEditor
                key={formKey}
                initialTitle=""
                initialContent=""
                onEntryChange={handleEntryChange}
                currentDate={currentDate}
              />

              <LossSelector
                losses={availableLosses}
                selectedLossId={selectedLossId}
                onSelectLoss={handleSelectLoss}
              />

            </Animated.View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Action Button for Save - Stable Mount (No Unmounting) */}
      <View className="absolute bottom-6 left-5 right-5">
        <TouchableOpacity
          className={`w-full rounded-2xl flex-row justify-center items-center h-14 shadow-lg ${entry.length < 50 || !selectedLossId ? 'bg-gray-300' : 'bg-[#2FC5C0]'}`}
          style={{
            shadowColor: entry.length < 50 || !selectedLossId ? "#9CA3AF" : THEME.COLORS.teal,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
          onPress={handleSave}
          disabled={isSaving || entry.length < 50 || !selectedLossId}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : (
            <Ionicons name="checkmark-circle" size={24} color="white" className="mr-2" />
          )}
          <Text className="text-white font-bold text-lg tracking-wide">
            {isSaving ? "Saving..." : "Save Journal"}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default DiaryScreen;