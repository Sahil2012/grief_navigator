import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../../constants/theme';
import { LossRow } from '../../store/lossStore';

interface LossPickerSheetProps {
    isVisible: boolean;
    onClose: () => void;
    losses: LossRow[];
    onSelect: (loss: LossRow) => void;
    selectedLossId?: number | string | null;
}

export const LossPickerSheet = ({ isVisible, onClose, losses, onSelect, selectedLossId }: LossPickerSheetProps) => {
    const insets = useSafeAreaInsets();

    const renderItem = ({ item }: { item: LossRow }) => {
        const isSelected = (item.id || item.title) === selectedLossId;
        return (
            <TouchableOpacity
                onPress={() => {
                    onSelect(item);
                    onClose();
                }}
                className={`flex-row items-center p-4 border-b border-gray-100 ${isSelected ? 'bg-teal-50' : 'bg-white'}`}
            >
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isSelected ? 'bg-teal-100' : 'bg-gray-100'}`}>
                    <Ionicons
                        name={isSelected ? "checkmark" : "heart-outline"} // Generic icon, could be dynamic based on type
                        size={20}
                        color={isSelected ? THEME.COLORS.primary : THEME.COLORS.textSecondary}
                    />
                </View>
                <View className="flex-1">
                    <Text className={`text-base ${isSelected ? 'font-bold text-teal-900' : 'font-medium text-textDark'}`}>
                        {item.title}
                    </Text>
                    <Text className="text-xs text-textSecondary">{item.timeAgo}</Text>
                </View>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={THEME.COLORS.primary} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <TouchableOpacity className="flex-1" onPress={onClose} activeOpacity={1} />

                <View className="bg-white rounded-t-3xl overflow-hidden shadow-2xl" style={{ maxHeight: '80%', paddingBottom: insets.bottom }}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                        <Text className="text-lg font-bold text-textDark">Select a Loss</Text>
                        <TouchableOpacity onPress={onClose} className="p-1 bg-gray-200 rounded-full">
                            <Ionicons name="close" size={20} color={THEME.COLORS.textDark} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    {losses.length === 0 ? (
                        <View className="p-8 items-center">
                            <Text className="text-textSecondary text-center">No losses found to select.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={losses}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};
