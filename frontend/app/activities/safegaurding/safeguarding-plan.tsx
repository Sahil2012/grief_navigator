import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View, Modal } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { THEME } from "../../constants/theme";
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { SafeguardingDatePicker } from "../../components/ui/SafeguardingDatePicker";
import { useSanctuaryStore } from "../../store/sanctuaryStore";
import { SanctuaryCategory, SanctuaryQuestionDTO } from "../../services/api/sanctuaryPlanService";

const SectionHeader = ({ title, icon, color }: { title: string; icon: keyof typeof Ionicons.glyphMap; color: string }) => (
    <View className="flex-row items-center mb-4">
        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3`} style={{ backgroundColor: `${color}20` }}>
            <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text className="text-lg font-bold text-textDark flex-1">{title}</Text>
    </View>
);

const FormInput = ({ label, placeholder, multiline = false, value, onChangeText }: any) => (
    <View className="mb-4">
        <Text className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 ml-1">{label}</Text>
        <TextInput
            className={`bg-gray-50 border border-gray-100 rounded-2xl p-4 text-textDark text-base ${multiline ? 'min-h-[100px]' : ''}`}
            textAlignVertical="top"
            multiline={multiline}
            placeholder={placeholder}
            placeholderTextColor={THEME.COLORS.secondary}
            value={value}
            onChangeText={onChangeText}
        />
    </View>
);

export default function SafeguardingPlanScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const setPlanData = useSanctuaryStore((state) => state.setPlanData);

    // Form State
    const [name, setName] = useState("");

    // Self Care
    const [careIssue, setCareIssue] = useState("");
    const [careReason, setCareReason] = useState("");

    // Warning Signs
    const [warningTrigger, setWarningTrigger] = useState("");
    const [warningNotice, setWarningNotice] = useState("");
    const [warningFeel, setWarningFeel] = useState("");
    const [warningProblem, setWarningProblem] = useState("");

    // Action Plan
    const [planAction1, setPlanAction1] = useState("");
    const [planAction2, setPlanAction2] = useState("");
    const [planAction3, setPlanAction3] = useState("");
    const [planAction4, setPlanAction4] = useState("");

    // Support
    const [supportPersonal, setSupportPersonal] = useState("");
    const [supportProfessional, setSupportProfessional] = useState("");

    // Date Picker State
    const [range, setRange] = useState<{ startDate: DateType; endDate: DateType }>({ startDate: null, endDate: null });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formattedDateRange = range.startDate && range.endDate
        ? `${dayjs(range.startDate).format("MMM D, YYYY")} - ${dayjs(range.endDate).format("MMM D, YYYY")}`
        : "";

    const handleNext = () => {
        const questions: SanctuaryQuestionDTO[] = [];

        const addQ = (q: string, a: string, cat: SanctuaryCategory) => {
            if (a && a.trim()) {
                questions.push({ question: q, answer: a, category: cat });
            }
        };

        // CARE
        addQ("I want to take care of my...", careIssue, SanctuaryCategory.CARE);
        addQ("I want to change this because:", careReason, SanctuaryCategory.CARE);

        // WARNING
        addQ("Event that triggers problems:", warningTrigger, SanctuaryCategory.WARNING);
        addQ("I notice (thoughts, images):", warningNotice, SanctuaryCategory.WARNING);
        addQ("I feel (emotions & body):", warningFeel, SanctuaryCategory.WARNING);
        addQ("This becomes a problem for others when:", warningProblem, SanctuaryCategory.WARNING);

        // PLAN
        addQ("When I notice warning signs, I will:", planAction1, SanctuaryCategory.PLAN);
        addQ("I will remove (objects) to reduce exposure to:", planAction2, SanctuaryCategory.PLAN);
        addQ("When alone, I will:", planAction3, SanctuaryCategory.PLAN);
        addQ("When with others, I will:", planAction4, SanctuaryCategory.PLAN);

        // SUPPORT
        addQ("Friends and Family I can contact:", supportPersonal, SanctuaryCategory.SUPPORT);
        addQ("Professional Support (Doctors, Counselors):", supportProfessional, SanctuaryCategory.SUPPORT);

        setPlanData({
            name,
            startDate: range.startDate ? dayjs(range.startDate).toISOString() : undefined,
            endDate: range.endDate ? dayjs(range.endDate).toISOString() : undefined,
            sanctuaryQuestions: questions,
            sanctuaryActivities: [] // Future use
        });

        router.push("/activities/safegaurding/safeguarding-signatures");
    };

    return (
        <View className="flex-1" style={{ backgroundColor: THEME.COLORS.bg }}>
            <AppHeader title="My Action Plan" />

            <KeyboardAwareScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
            >
                {/* Intro Card */}
                <View className="bg-blue-50/50 rounded-3xl p-5 mb-6 border border-blue-100">
                    <Text className="text-textDark font-medium leading-6 text-sm">
                        This is a "living" document. Revisit and revise it regularly. Share it with trusted people who can support you.
                    </Text>
                </View>

                {/* 1. Basic Information */}
                <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-white">
                    <SectionHeader title="Basic Information" icon="person-outline" color={THEME.COLORS.blueSoft} />
                    <FormInput label="Name" placeholder="Your full name" value={name} onChangeText={setName} />

                    {/* Date Range Picker Input */}
                    <View className="mb-4">
                        <Text className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 ml-1">Effective Date Range</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex-row items-center justify-between"
                        >
                            <Text className={`text-base ${formattedDateRange ? 'text-textDark' : 'text-gray-400'}`}>
                                {formattedDateRange || "Select effective dates..."}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color={THEME.COLORS.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 2. Self Care */}
                <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-white">
                    <SectionHeader title="What I want to take care of" icon="heart-outline" color={THEME.COLORS.teal} />
                    <FormInput
                        label="I want to take care of my..."
                        placeholder="e.g., worry, sadness, impulsiveness..."
                        multiline
                        value={careIssue}
                        onChangeText={setCareIssue}
                    />
                    <FormInput
                        label="I want to change this because:"
                        placeholder="Why is this important to you?"
                        multiline
                        value={careReason}
                        onChangeText={setCareReason}
                    />
                </View>

                {/* 3. Warning Signs */}
                <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-white">
                    <SectionHeader title="Early Warning Signs & Triggers" icon="warning-outline" color="#F59E0B" />
                    <FormInput
                        label="Event that triggers problems:"
                        placeholder="Describe situations..."
                        multiline
                        value={warningTrigger}
                        onChangeText={setWarningTrigger}
                    />
                    <FormInput
                        label="I notice (thoughts, images):"
                        placeholder="What comes up in your mind?"
                        multiline
                        value={warningNotice}
                        onChangeText={setWarningNotice}
                    />
                    <FormInput
                        label="I feel (emotions & body):"
                        placeholder="Physical sensations..."
                        multiline
                        value={warningFeel}
                        onChangeText={setWarningFeel}
                    />
                    <FormInput
                        label="This becomes a problem for others when:"
                        placeholder="Who and when?"
                        multiline
                        value={warningProblem}
                        onChangeText={setWarningProblem}
                    />
                </View>

                {/* 4. Action Plan */}
                <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-white">
                    <SectionHeader title="My Action Plan" icon="shield-checkmark-outline" color={THEME.COLORS.purpleSoft} />
                    <FormInput
                        label="1. When I notice warning signs, I will:"
                        placeholder="Specific actions you will take..."
                        multiline
                        value={planAction1}
                        onChangeText={setPlanAction1}
                    />
                    <FormInput
                        label="2. I will remove (objects) to reduce exposure to:"
                        placeholder="Triggers or harmful items..."
                        multiline
                        value={planAction2}
                        onChangeText={setPlanAction2}
                    />
                    <FormInput
                        label="3. When alone, I will:"
                        placeholder="Coping strategies for solitude..."
                        multiline
                        value={planAction3}
                        onChangeText={setPlanAction3}
                    />
                    <FormInput
                        label="4. When with others, I will:"
                        placeholder="How to manage in social settings..."
                        multiline
                        value={planAction4}
                        onChangeText={setPlanAction4}
                    />
                </View>

                {/* 5. Support Network */}
                <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-white">
                    <SectionHeader title="My Support Network" icon="people-outline" color={THEME.COLORS.pinkSoft} />
                    <FormInput
                        label="Friends and Family I can contact:"
                        placeholder="Names and contact info..."
                        multiline
                        value={supportPersonal}
                        onChangeText={setSupportPersonal}
                    />
                    <FormInput
                        label="Professional Support (Doctors, Counselors):"
                        placeholder="Names and numbers..."
                        multiline
                        value={supportProfessional}
                        onChangeText={setSupportProfessional}
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-teal-500 rounded-2xl py-4 items-center shadow-md shadow-teal-200 mb-8"
                >
                    <Text className="text-white font-bold text-lg">Next: Signatures & Commitment</Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>

            {/* Date Picker Modal */}
            <SafeguardingDatePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                mode="range"
                startDate={range.startDate}
                endDate={range.endDate}
                onDateChange={({ startDate, endDate }) => setRange({ startDate, endDate })}
                title="Select Date Range"
            />
        </View>
    );
}
