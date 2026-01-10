import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/ui/AppHeader";
import { journalService, JournalEntryDTO } from "../services/api/journalService";
import { JournalDetailSkeleton } from "../components/journal/JournalDetailSkeleton";
import { lossService, LossDTO } from "../services/api/lossService";
import { THEME } from "../constants/theme";

const JournalEntryDetail: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const colors = THEME.COLORS;

    const [entry, setEntry] = useState<JournalEntryDTO | null>(null);
    const [relatedLoss, setRelatedLoss] = useState<LossDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const entryData = await journalService.getJournalEntry(Number(id));
                setEntry(entryData);

                if (entryData.relatedLossId) {
                    // Optimized: Fetch all losses from cache/store would be better, but fetching all for this is fine for now
                    // Ideally lossService has getById, if not we fetch all and find. 
                    const losses = await lossService.getAllLosses();
                    const loss = losses.find(l => l.id === entryData.relatedLossId);
                    setRelatedLoss(loss || null);
                }
            } catch (error) {
                console.error("Failed to load entry:", error);
                Alert.alert("Error", "Could not load journal entry.");
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 bg-[#FDFBF7]">
                <AppHeader title="Journal Entry" showBack={true} />
                <JournalDetailSkeleton />
            </View>
        );
    }

    if (!entry) return null;

    const formattedDate = new Date(entry.entryDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = new Date(entry.entryDate).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
    });

    const handleDelete = () => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this journal entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            if (entry.id) {
                                await journalService.deleteJournalEntry(entry.id);
                                router.back();
                            }
                        } catch (error) {
                            console.error("Failed to delete entry:", error);
                            Alert.alert("Error", "Could not delete entry.");
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-[#FDFBF7]">
            <AppHeader title="Journal Entry" showBack={true} />

            {/* Background Feather Watermark */}
            <View className="absolute bottom-[-50] right-[-30] opacity-5 pointer-events-none z-0">
                <FontAwesome6 name="feather" size={300} color={colors.primary} />
            </View>

            <ScrollView
                className="flex-1 px-6 pt-5"
                contentContainerStyle={{ paddingBottom: 60 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Title & Metadata Block */}
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-gray-900 leading-tight mb-2 text-left">
                        {entry.title || "Untitled Entry"}
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="font-semibold text-sm" style={{ color: colors.primary }}>
                            {formattedDate} • {formattedTime}
                        </Text>
                    </View>
                </View>

                {/* Connected Loss & Actions */}
                <View className="flex-row items-center justify-between mb-6 pb-4 border-b border-gray-200/60">
                    <View className="flex-1 mr-4">
                        {relatedLoss ? (
                            <View className="bg-purple-50 px-3 py-1.5 rounded-full self-start flex-row items-center">
                                <FontAwesome6 name="link" size={10} color={colors.purpleSoft} />
                                <Text className="text-purple-700 text-xs font-semibold ml-2" numberOfLines={1}>
                                    {relatedLoss.description}
                                </Text>
                            </View>
                        ) : (
                            <View className="h-6" /> // spacer
                        )}
                    </View>

                    <View className="flex-row gap-2">
                        <TouchableOpacity className="p-2 bg-white rounded-full border border-gray-200 shadow-sm active:bg-gray-50">
                            <Ionicons name="share-outline" size={18} color={colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDelete}
                            className="p-2 bg-white rounded-full border border-gray-200 shadow-sm active:bg-gray-50"
                        >
                            <Ionicons name="trash-outline" size={18} color={colors.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content Area - Native Font, Proper spacing */}
                <View className="min-h-[300px]">
                    <Text className="text-lg text-gray-800 leading-8 font-normal" style={{ fontFamily: 'System' }}>
                        {entry.content}
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
};

export default JournalEntryDetail;
