import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View, Alert, Modal } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { THEME } from "../../constants/theme";
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { SafeguardingDatePicker } from "../../components/ui/SafeguardingDatePicker";
import { useSanctuaryStore } from "../../store/sanctuaryStore";
import { sanctuaryPlanService, SanctuaryPlanDTO } from "../../services/api/sanctuaryPlanService";

const FormInput = ({ label, placeholder, value, onChangeText }: any) => (
    <View className="mb-4">
        <Text className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 ml-1">{label}</Text>
        <TextInput
            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-textDark text-base"
            placeholder={placeholder}
            placeholderTextColor={THEME.COLORS.secondary}
            value={value}
            onChangeText={onChangeText}
        />
    </View>
);

interface Signature {
    id: number;
    name: string;
    date: DateType;
}

export default function SafeguardingSignaturesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { planData, reset } = useSanctuaryStore();
    const [loading, setLoading] = useState(false);

    // Initial state with one signature block
    const [signatures, setSignatures] = useState<Signature[]>([
        { id: 1, name: '', date: null }
    ]);

    // Date Picker State
    const [activeSigId, setActiveSigId] = useState<number | null>(null);
    const [tempDate, setTempDate] = useState<DateType>(dayjs());

    const addSignature = () => {
        const newId = signatures.length > 0 ? Math.max(...signatures.map(s => s.id)) + 1 : 1;
        setSignatures([...signatures, { id: newId, name: '', date: null }]);
    };

    const removeSignature = (id: number) => {
        setSignatures(signatures.filter(s => s.id !== id));
    };

    const updateSignatureName = (id: number, text: string) => {
        setSignatures(signatures.map(s =>
            s.id === id ? { ...s, name: text } : s
        ));
    };

    const openDatePicker = (id: number) => {
        setActiveSigId(id);
        setTempDate(dayjs()); // Reset temp date to now or current selection
    };

    const confirmDate = (date: DateType) => {
        if (activeSigId !== null) {
            setSignatures(signatures.map(s =>
                s.id === activeSigId ? { ...s, date: date } : s
            ));
            setActiveSigId(null);
        }
    };

    const handleComplete = async () => {
        // Collect signatures
        const finalSignatures = signatures
            .filter(s => s.name && s.date)
            .map(s => ({
                signature: s.name,
                date: dayjs(s.date).toISOString()
            }));

        const finalPlan: SanctuaryPlanDTO = {
            name: planData.name,
            startDate: planData.startDate,
            endDate: planData.endDate,
            sanctuaryQuestions: planData.sanctuaryQuestions || [],
            sanctuaryActivities: [],
            sanctuarySignatures: finalSignatures
        };

        try {
            setLoading(true);
            await sanctuaryPlanService.createSanctuaryPlan(finalPlan);
            reset();
            Alert.alert("Plan Saved", "Your Safeguarding Plan has been successfully saved.", [
                { text: "OK", onPress: () => router.push("/activities") }
            ]);
        } catch (error) {
            Alert.alert("Error", "Failed to save plan. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: THEME.COLORS.bg }}>
            <AppHeader title="Signatures" />

            <KeyboardAwareScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
            >
                {/* Intro Card */}
                <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-white">
                    <View className="flex-row items-center mb-4">
                        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 bg-teal-50`}>
                            <Ionicons name="pencil-outline" size={16} color={THEME.COLORS.teal} />
                        </View>
                        <Text className="text-lg font-bold text-textDark flex-1">Commitment</Text>
                    </View>
                    <Text className="text-textSecondary text-sm leading-5">
                        These signatures show commitment to supporting this plan.
                        Add as many supporters as you need.
                    </Text>
                </View>

                {/* Dynamic Signatures List */}
                <View className="space-y-4">
                    {signatures.map((sig, index) => (
                        <View key={sig.id} className="bg-white rounded-3xl p-5 shadow-sm border border-white relative my-2">
                            {/* Remove Button (only if more than 1) */}
                            {signatures.length > 1 && (
                                <TouchableOpacity
                                    onPress={() => removeSignature(sig.id)}
                                    className="absolute top-4 right-4 z-10 p-2 bg-red-50 rounded-full"
                                >
                                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                </TouchableOpacity>
                            )}

                            <Text className="text-base font-bold text-textDark mb-4">
                                Signature {index + 1}
                            </Text>

                            <FormInput
                                label="Name"
                                placeholder="Name of supporter"
                                value={sig.name}
                                onChangeText={(text: string) => updateSignatureName(sig.id, text)}
                            />

                            {/* Date Input Trigger */}
                            <View className="mb-4">
                                <Text className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 ml-1">Date</Text>
                                <TouchableOpacity
                                    onPress={() => openDatePicker(sig.id)}
                                    className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex-row items-center justify-between"
                                >
                                    <Text className={`text-base ${sig.date ? 'text-textDark' : 'text-gray-400'}`}>
                                        {sig.date ? dayjs(sig.date).format("MMMM D, YYYY") : "Select Date"}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={20} color={THEME.COLORS.secondary} />
                                </TouchableOpacity>
                            </View>

                        </View>
                    ))}
                </View>

                {/* Add More Button */}
                <TouchableOpacity
                    onPress={addSignature}
                    className="mt-6 flex-row items-center justify-center py-4 border-2 border-dashed border-teal-200 rounded-2xl bg-teal-50/30"
                >
                    <Ionicons name="add-circle-outline" size={24} color={THEME.COLORS.teal} />
                    <Text className="ml-2 text-teal-600 font-bold text-base">Add Another Signature</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleComplete}
                    disabled={loading}
                    className={`bg-teal-500 rounded-2xl py-4 items-center shadow-md shadow-teal-200 mt-8 ${loading ? 'opacity-50' : ''}`}
                >
                    <Text className="text-white font-bold text-lg">
                        {loading ? 'Saving...' : 'Complete Plan'}
                    </Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>

            {/* Date Picker Modal */}
            <SafeguardingDatePicker
                visible={activeSigId !== null}
                onClose={() => setActiveSigId(null)}
                mode="single"
                date={tempDate}
                onDateChange={(params: { date?: DateType }) => setTempDate(params.date)}
                title="Select Date"
                onConfirm={() => confirmDate(tempDate)}
            />
        </View>
    );
}
