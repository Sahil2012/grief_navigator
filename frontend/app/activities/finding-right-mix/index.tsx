import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useMemo, useEffect } from "react";
import { Platform, Text, TouchableOpacity, View, TextInput, ScrollView, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { THEME } from "../../constants/theme";
import { useLossStore } from "../../store/lossStore";
import { SliderInput } from "../../components/ui/SliderInput";
import { lossService } from "../../services/api/lossService";
import { LossPickerSheet } from "../../components/ui/LossPickerSheet";

export default function FindingRightMixScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const {
        relationshipLosses,
        identityLosses,
        thingLosses,
        supports,
        addSupport,
        removeSupport,
        setRelationshipLosses,
        setIdentityLosses,
        setThingLosses
    } = useLossStore();

    // Data Fetching
    useEffect(() => {
        const fetchLosses = async () => {
            try {
                const losses = await lossService.getAllLosses();
                // Map to store format
                const relationship = losses.filter(l => l.type === 'RELATIONSHIP').map(l => ({ id: l.id, title: l.description, timeAgo: l.time, difficulty: 5 }));
                const identity = losses.filter(l => l.type === 'IDENTITY').map(l => ({ id: l.id, title: l.description, timeAgo: l.time, difficulty: 5 }));
                const thing = losses.filter(l => l.type === 'THING').map(l => ({ id: l.id, title: l.description, timeAgo: l.time, difficulty: 5 }));

                setRelationshipLosses(relationship);
                setIdentityLosses(identity);
                setThingLosses(thing);
            } catch (error) {
                console.error("Failed to fetch losses:", error);
            }
        };
        fetchLosses();
    }, []);

    const allLosses = useMemo(() => [
        ...relationshipLosses.map(l => ({ ...l, type: 'Relationship' })),
        ...identityLosses.map(l => ({ ...l, type: 'Identity' })),
        ...thingLosses.map(l => ({ ...l, type: 'Thing' }))
    ], [relationshipLosses, identityLosses, thingLosses]);

    const [selectedLossId, setSelectedLossId] = useState<number | string | null>(null);
    const [isSheetVisible, setIsSheetVisible] = useState(false);

    // Auto-select first loss
    useEffect(() => {
        if (!selectedLossId && allLosses.length > 0) {
            setSelectedLossId(allLosses[0].id!);
        }
    }, [allLosses]);

    const selectedLoss = useMemo(() =>
        allLosses.find(l => l.id === selectedLossId),
        [allLosses, selectedLossId]);

    // Form State
    const [name, setName] = useState("");
    const [impact, setImpact] = useState(0);
    const [accessibility, setAccessibility] = useState(0);

    const handleAdd = () => {
        if (!name.trim()) {
            Alert.alert("Please enter a name");
            return;
        }
        if (!selectedLossId) return;

        addSupport({
            id: Date.now().toString(),
            lossId: selectedLossId.toString(),
            name: name,
            impactOnPain: impact,
            accessibility: accessibility
        });

        // Reset
        setName("");
        setImpact(0);
        setAccessibility(0);
    };

    const currentSupports = useMemo(() =>
        supports.filter(s => s.lossId == selectedLossId?.toString()),
        [supports, selectedLossId]);

    return (
        <View className="flex-1 bg-gray-50">
            <AppHeader title="Finding the Right Mix" />

            {/* Picker Sheet */}
            <LossPickerSheet
                isVisible={isSheetVisible}
                onClose={() => setIsSheetVisible(false)}
                losses={allLosses}
                onSelect={(loss) => setSelectedLossId(loss.id!)}
                selectedLossId={selectedLossId}
            />

            <KeyboardAwareScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                enableOnAndroid
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Loss Selector Trigger */}
                <View className="pt-6 px-5 pb-2">
                    <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Selected Loss</Text>
                    <TouchableOpacity
                        onPress={() => setIsSheetVisible(true)}
                        className="bg-white border border-gray-200 rounded-xl p-4 flex-row items-center justify-between shadow-sm active:scale-95 transition-transform"
                    >
                        <View className="flex-row items-center flex-1">
                            <View className="bg-teal-100 p-2 rounded-lg mr-3">
                                <Ionicons name="heart" size={20} color={THEME.COLORS.primary} />
                            </View>
                            <View>
                                <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                                    {selectedLoss?.title || "Select a Loss"}
                                </Text>
                                {selectedLoss && <Text className="text-xs text-gray-500">{selectedLoss.timeAgo}</Text>}
                            </View>
                        </View>
                        <Ionicons name="chevron-down" size={20} color={THEME.COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* 2. Dynamic Header & Form */}
                {selectedLoss && (
                    <View className="px-5 mt-4">
                        <Text className="text-2xl font-bold text-gray-900 mb-6">
                            Analysis for <Text className="text-teal-600">{selectedLoss.title}</Text>
                        </Text>

                        {/* Input Card */}
                        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                            {/* Name Input */}
                            <Text className="text-sm font-bold text-gray-700 mb-2">Support Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. Best Friend, Walking the Dog..."
                                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-base text-gray-900 mb-6"
                                placeholderTextColor="#9CA3AF"
                            />

                            {/* Sliders */}
                            <SliderInput
                                label="Impact on Pain"
                                value={impact}
                                onValueChange={setImpact}
                                minLabel="Whens pain"
                                maxLabel="Helps pain"
                            />
                            <View className="h-4" />
                            <SliderInput
                                label="Accessibility"
                                value={accessibility}
                                onValueChange={setAccessibility}
                                minLabel="Hard to reach"
                                maxLabel="Always there"
                            />

                            {/* Add Button */}
                            <TouchableOpacity
                                onPress={handleAdd}
                                className="mt-6 bg-gray-900 rounded-xl py-4 items-center shadow-lg active:bg-gray-800"
                            >
                                <Text className="text-white font-bold text-base flex-row items-center">
                                    <Ionicons name="add-circle-outline" size={18} color="white" /> Add to List
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* 3. List of Supports */}
                        {currentSupports.length > 0 && (
                            <View className="mb-6">
                                <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Your Support Mix</Text>
                                {currentSupports.map((item, index) => (
                                    <View key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 mb-3 flex-row items-center justify-between shadow-sm">
                                        <View className="flex-1">
                                            <Text className="text-base font-bold text-gray-900">{item.name}</Text>
                                            <View className="flex-row mt-1">
                                                <Text className={`text-xs mr-3 ${item.impactOnPain > 0 ? 'text-teal-600' : 'text-red-500'}`}>
                                                    Impact: {item.impactOnPain > 0 ? '+' : ''}{item.impactOnPain}
                                                </Text>
                                                <Text className={`text-xs ${item.accessibility > 0 ? 'text-teal-600' : 'text-red-500'}`}>
                                                    Access: {item.accessibility > 0 ? '+' : ''}{item.accessibility}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => removeSupport(item.id)} className="p-2 bg-red-50 rounded-lg">
                                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </KeyboardAwareScrollView>

            {/* 4. Footer Actions */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 pt-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
                <TouchableOpacity className="bg-teal-500 w-full py-4 rounded-xl items-center shadow-lg shadow-teal-200 mb-3" onPress={() => router.back()}>
                    <Text className="text-white font-bold text-lg">Register this Mix</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-2 items-center" onPress={() => router.back()}>
                    <Text className="text-gray-400 font-medium text-sm">I can't think of any support for this</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
