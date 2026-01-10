import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Share, Alert } from 'react-native';
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { JournalEntryDTO } from '../../services/api/journalService';
import { THEME } from '../../constants/theme';

interface JournalEntryCardProps {
    entry: JournalEntryDTO;
}

export const JournalEntryCard = memo(({ entry }: JournalEntryCardProps) => {
    const router = useRouter();
    const colors = THEME.COLORS;

    const formattedDate = new Date(entry.entryDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    const formattedTime = new Date(entry.entryDate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${entry.title || 'My Journal Entry'}\n\n${entry.content}`,
            });
        } catch (error) {
            Alert.alert("Error", "Failed to share journal entry.");
        }
    };

    const handlePress = () => {
        // Navigate to detail view (to be implemented)
        router.push(`/entry/${entry.id}`);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2
            }}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center">
                    <View className="bg-purple-50 px-2 py-1 rounded-lg mr-2">
                        <Text className="text-purple-600 font-bold text-xs uppercase">
                            {formattedDate}
                        </Text>
                    </View>
                    <Text className="text-gray-400 text-xs">
                        {formattedTime}
                    </Text>
                </View>

                <TouchableOpacity onPress={handleShare} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="share-outline" size={20} color={colors.secondary} />
                </TouchableOpacity>
            </View>

            <Text className="text-xl font-semibold text-gray-800 mb-2 leading-tight" numberOfLines={1}>
                {entry.title || "Untitled Entry"}
            </Text>

            <Text className="text-gray-500 text-base leading-6" numberOfLines={3}>
                {entry.content}
            </Text>

            {entry.relatedLossId && (
                <View className="mt-3 flex-row items-center">
                    <FontAwesome6 name="link" size={10} color={colors.secondary} />
                    <Text className="text-xs text-gray-400 ml-1 italic">
                        Linked to loss
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
});
