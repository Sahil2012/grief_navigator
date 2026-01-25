import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, LayoutAnimation, ScrollView, Animated, Platform, UIManager, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { griefMilestoneService, GriefFocus } from '../../services/api/griefMilestoneService';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppHeader } from '../../components/ui/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MilestoneQuestion {
    id: string;
    label: string;
    placeholder?: string;
    multiline?: boolean;
    lines?: number;
}

interface MilestoneData {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    description: string;
    activityTitle: string;
    activitySteps: string[];
    questions: MilestoneQuestion[];
}

const MILESTONES: MilestoneData[] = [
    {
        id: 'UNDERSTAND_ACCEPT',
        title: 'Understand and Accept Loss',
        icon: 'book-outline',
        description: 'Understanding and accepting change is challenging. Questions arise about what this change might mean to your self-image and future.',
        activityTitle: 'Loss Awareness Activity',
        activitySteps: [
            "Grab a timer (phone or any clock will do). If this is your first time, start with 5 seconds.",
            "Start the timer and bring any part of your first loss to mind.",
            "Take note of the statements that come to mind.",
            "Look at the list you have created – which ones acknowledge that the loss happened with a context that makes sense to you?"
        ],
        questions: [
            { id: 'q2', label: 'How long did you sit with it?', multiline: false },
            { id: 'q1', label: 'Statements that came to mind', placeholder: 'Type here...', multiline: true, lines: 4 }
        ]
    },
    {
        id: 'MANAGE_EMOTIONS',
        title: 'Manage Emotions',
        icon: 'water-outline',
        description: 'Grief brings a tidal wave of emotions. Learning to surf these waves rather than being drowned by them is key.',
        activityTitle: 'Emotion Regulation',
        activitySteps: [
            "For each loss from your CYGE (Collate Your Grief Experience), rate how hard you expect it to be to sit with the painful emotions.",
            "Complete the Grief Diary for one week at the end of each day.",
            "At the end of the week, reflect: For the things that were hard – can you see that you were able to tolerate some challenges? Were there days that made the pain less – what happened to make these moments different?"
        ],
        questions: [
            { id: 'q1', label: 'Start of the Week – what do you expect?', placeholder: 'Type here...', multiline: true, lines: 4 },
            { id: 'q2', label: 'End of the Week – what trends did you see?', placeholder: 'Type here...', multiline: true, lines: 4 }
        ]
    },
    {
        id: 'PROMISING_FUTURE',
        title: 'See A Promising Future',
        icon: 'telescope-outline',
        description: 'Imagining a future where joy and purpose exist again, even while honoring your loss.',
        activityTitle: 'Future Visualization',
        activitySteps: [
            "For each loss identified in your CYGE, describe below what you envision is the future for you after this loss.",
            "Looking at this list – highlight the ones that are promising, where there is an element of hope or enthusiasm."
        ],
        questions: [
            { id: 'q1', label: 'In a few words – what future do you see for yourself in relation to this loss?', placeholder: 'Describe the scene...', multiline: true, lines: 3 },
        ]
    },
    {
        id: 'STRENGTHEN_RELATIONSHIPS',
        title: 'Strengthen Relationships',
        icon: 'people-outline',
        description: 'Relationships provide the safety net for our grief. Nurturing them ensures we don’t grieve in isolation.',
        activityTitle: 'Connection Builder',
        activitySteps: [
            "Refer to your CYGE. For each loss, state who and how people are supporting you with the milestones above.",
            "Is there anyone else that you could lean towards now that you had not before?",
        ],
        questions: [
            { id: 'q1', label: 'Who is supporting moments of grief now & How?', placeholder: 'Name and support type...', multiline: true, lines: 3 },
            { id: 'q2', label: 'What other relationships are you ready to strengthen?', placeholder: 'Names or groups...', multiline: true, lines: 3 }
        ]
    },
    {
        id: 'TELL_STORY',
        title: 'Tell the Story of the Loss',
        icon: 'chatbubble-ellipses-outline',
        description: 'Narrating your story helps integrate the loss into your life history, making it manageable.',
        activityTitle: 'Narrative Journaling',
        activitySteps: [
            "Share the story of how you came to the first loss according to your CYGE, the moment you were exposed to it. You can do this with a person you can trust in a safe confidential setting such as with a close friend, a conflict coach, or a telephone counselor.",
            "Notice how your discomfort fluctuated.",
            "Reflect on what it is like to have shared the experience.",
            "Repeat for each loss according to your CYGE."
        ],
        questions: [
            { id: 'q1', label: 'Who, When, How & what is it like now having shared your experience?', placeholder: 'Start writing here...', multiline: true, lines: 8 },
        ]
    },
    {
        id: 'REMINDERS',
        title: 'Live with Reminders that Trigger Grief',
        icon: 'notifications-outline',
        description: 'Triggers are inevitable. Developing strategies to handle sudden reminders empowers you.',
        activityTitle: 'Trigger Planning',
        activitySteps: [
            "Identify one specific trigger that affects you (e.g., a song, a date).",
            "Write down what physically happens when you are triggered.",
            "Create a 'safety plan' - one action you can take immediately (e.g., deep breathing, calling a friend).",
            "Practice this action mentally."
        ],
        questions: [
            { id: 'q1', label: 'Identify the trigger', placeholder: 'e.g., Only You song...', multiline: false },
            { id: 'q2', label: 'Physical reaction', placeholder: 'e.g., Crying, shaking...', multiline: true, lines: 2 },
            { id: 'q3', label: 'My Safety Plan action', placeholder: 'I will...', multiline: true, lines: 2 }
        ]
    }
];

export default function GriefMilestonesScreen() {
    const router = useRouter();
    const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(MILESTONES[0].id);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // Form State
    const [duration, setDuration] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [indicators, setIndicators] = useState({
        articulate: false,
        recognize: false,
        acknowledge: false,
        path: false,
        context: false,
    });

    const selectedMilestone = MILESTONES.find(m => m.id === selectedMilestoneId) || MILESTONES[0];

    const resetForm = () => {
        setDuration(0);
        setAnswers({});
        setIndicators({
            articulate: false,
            recognize: false,
            acknowledge: false,
            path: false,
            context: false,
        });
    };

    // Reset form when milestone changes
    useEffect(() => {
        resetForm();
    }, [selectedMilestoneId]);

    const handleAnswerChange = (questionLabel: string, text: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionLabel]: text
        }));
    };

    const toggleIndicator = (key: keyof typeof indicators) => {
        setIndicators(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const [isSaving, setIsSaving] = useState(false);

    const getGriefFocus = (id: string): GriefFocus => {
        switch (id) {
            case 'UNDERSTAND_ACCEPT': return GriefFocus.UNDERSTAND_AND_ACCEPT_LOSS;
            case 'MANAGE_EMOTIONS': return GriefFocus.MANAGE_EMITIONS;
            case 'PROMISING_FUTURE': return GriefFocus.FUTURE;
            case 'STRENGTHEN_RELATIONSHIPS': return GriefFocus.STRENGTHENING_RELATIONSHIPS;
            case 'TELL_STORY': return GriefFocus.STORY_OF_LOSS;
            case 'REMINDERS': return GriefFocus.GIREF_TRIGGERS;
            default: return GriefFocus.UNDERSTAND_AND_ACCEPT_LOSS;
        }
    };

    const handleSave = async () => {
        if (isSaving) return;

        // Basic validation
        if (duration === 0 && Object.keys(answers).length === 0) {
            Alert.alert("Empty Entry", "Please enter a duration or answer some questions before saving.");
            return;
        }

        setIsSaving(true);
        try {
            const activeIndicators = Object.entries(indicators)
                .filter(([_, value]) => value)
                .map(([key, _]) => key);

            await griefMilestoneService.createGriefMilestone({
                focus: getGriefFocus(selectedMilestoneId),
                timeDuration: duration,
                reflections: answers,
                indicators: activeIndicators,
            });


            Alert.alert("Success", "Your milestone progress has been saved successfully.");
            resetForm();
        } catch (error) {
            console.error("Failed to save milestone:", error);
            Alert.alert("Error", "Failed to save your progress. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // Animation for dropdown
    const toggleSelector = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsSelectorOpen(!isSelectorOpen);
    };

    const selectMilestone = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedMilestoneId(id);
        setIsSelectorOpen(false);
    };

    const overallProgress = 0.5; // Demo value

    return (
        <ScreenContainer
            header={<AppHeader title="Grief Milestones" subtitle="Your Healing Journey" backRoute="/activities" />}
        >
            <KeyboardAwareScrollView
                className="flex-1 bg-gray-50"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                enableOnAndroid={true}
                extraScrollHeight={100}
            >
                {/* Journey Summary Card */}
                <View className="mx-2 mt-6 mb-6 shadow-lg shadow-blue-900/10 rounded-3xl overflow-hidden">
                    <LinearGradient
                        colors={[THEME.COLORS.primary, '#0D9488']} // Gradient from Teal to darker Teal
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="p-6"
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 pr-4">
                                <Text className="text-white text-2xl font-bold mb-1" style={{ fontFamily: 'Satisfy-Regular' }}>Your Journey</Text>
                                <Text className="text-white/80 text-sm mb-4">6 of 6 milestones unlocked</Text>
                                <View className="flex-row items-center">
                                    <View className="bg-white/20 px-3 py-1 rounded-full mr-2">
                                        <Text className="text-white text-xs font-bold">Week 6</Text>
                                    </View>
                                    <Text className="text-white/60 text-xs">Keep going!</Text>
                                </View>
                            </View>
                            <Progress.Circle
                                size={60}
                                progress={overallProgress}
                                color="white"
                                indeterminate={false}
                                thickness={6}
                                showsText={true}
                                formatText={() => `${Math.round(overallProgress * 100)}%`}
                                textStyle={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}
                                borderWidth={0}
                            />
                        </View>
                    </LinearGradient>
                </View>

                {/* Milestone Selector Button */}
                <View className="mx-2 mb-6">
                    <Text className="text-textSecondary text-xs font-bold uppercase tracking-wider mb-2 ml-1">Current Focus</Text>
                    <TouchableOpacity
                        onPress={() => setIsSelectorOpen(true)}
                        className="bg-white rounded-2xl border border-gray-100 p-4 flex-row items-center justify-between shadow-sm"
                        activeOpacity={0.8}
                    >
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 rounded-full bg-teal-50 items-center justify-center mr-3">
                                <Ionicons name={selectedMilestone.icon} size={20} color={THEME.COLORS.primary} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-textDark font-bold text-base" numberOfLines={1}>{selectedMilestone.title}</Text>
                                <Text className="text-textSecondary text-xs">Tap to change milestone</Text>
                            </View>
                        </View>
                        <Ionicons
                            name="chevron-down"
                            size={20}
                            color={THEME.COLORS.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Milestone Selection Modal (Bottom Sheet) */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isSelectorOpen}
                    onRequestClose={() => setIsSelectorOpen(false)}
                >
                    <View className="flex-1 justify-end bg-black/50">
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            activeOpacity={1}
                            onPress={() => setIsSelectorOpen(false)}
                        />
                        <View className="bg-white rounded-t-3xl p-6 pb-10 shadow-2xl h-[70%]">
                            <View className="items-center mb-6">
                                <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
                            </View>
                            <Text className="text-xl font-bold text-textDark mb-6 text-center">Select a Milestone</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {MILESTONES.map((m) => (
                                    <TouchableOpacity
                                        key={m.id}
                                        onPress={() => selectMilestone(m.id)}
                                        className={`p-4 mb-3 rounded-2xl border flex-row items-center ${selectedMilestoneId === m.id ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-100'}`}
                                    >
                                        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${selectedMilestoneId === m.id ? 'bg-white' : 'bg-gray-50'}`}>
                                            <Ionicons
                                                name={m.icon}
                                                size={20}
                                                color={selectedMilestoneId === m.id ? THEME.COLORS.primary : THEME.COLORS.textSecondary}
                                            />
                                        </View>
                                        <Text className={`flex-1 text-base ${selectedMilestoneId === m.id ? 'text-primary font-bold' : 'text-textDark font-medium'}`}>
                                            {m.title}
                                        </Text>
                                        {selectedMilestoneId === m.id && (
                                            <Ionicons name="checkmark-circle" size={24} color={THEME.COLORS.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Main Content Area */}
                <View className="mx-2">
                    {/* Description Card */}
                    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                        <Text className="text-lg font-bold text-primary mb-3" style={{ fontFamily: 'Satisfy-Regular' }}>Understanding the Milestone</Text>
                        <Text className="text-textDark text-base leading-7">
                            {selectedMilestone.description}
                        </Text>
                    </View>

                    {/* Activity Section */}
                    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        <View className="bg-orange-50/50 p-4 border-b border-orange-100 flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-3">
                                <Ionicons name="fitness" size={16} color="#F97316" />
                            </View>
                            <Text className="text-textDark font-bold text-lg">{selectedMilestone.activityTitle}</Text>
                        </View>

                        <View className="p-6">

                            {/* Steps */}
                            <Text className="text-textSecondary text-xs font-bold uppercase tracking-wider mb-4">Instructions</Text>
                            <View className="mb-8">
                                {selectedMilestone.activitySteps.map((step, index) => (
                                    <View key={index} className="flex-row mb-4">
                                        <Text className="text-orange-500 font-bold mr-3">{index + 1}.</Text>
                                        <Text className="text-textDark flex-1 leading-6">{step}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Duration */}
                            <Text className="text-textSecondary text-xs font-bold uppercase tracking-wider mb-3">How Long? (Seconds)</Text>
                            <View className="flex-row items-center mb-8 bg-gray-50 rounded-xl p-2 self-start border border-gray-100">
                                <TouchableOpacity
                                    onPress={() => setDuration(Math.max(0, duration - 5))}
                                    className="w-10 h-10 bg-white rounded-lg items-center justify-center shadow-sm"
                                >
                                    <Ionicons name="remove" size={20} color={THEME.COLORS.textDark} />
                                </TouchableOpacity>
                                <Text className="px-6 font-bold text-xl text-textDark min-w-[80px] text-center">{duration}</Text>
                                <TouchableOpacity
                                    onPress={() => setDuration(duration + 5)}
                                    className="w-10 h-10 bg-primary rounded-lg items-center justify-center shadow-sm"
                                >
                                    <Ionicons name="add" size={20} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* Dynamic Questions */}
                            <Text className="text-textSecondary text-xs font-bold uppercase tracking-wider mb-2">My Reflections</Text>

                            {selectedMilestone.questions.map((q) => (
                                <View key={q.id} className="mb-4">
                                    <Text className="text-textSecondary text-sm mb-2">{q.label}</Text>
                                    <TextInput
                                        className={`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-textDark ${q.multiline ? 'min-h-[100px] text-top' : 'h-12'}`}
                                        multiline={q.multiline}
                                        numberOfLines={q.lines || 1}
                                        textAlignVertical={q.multiline ? "top" : "center"}
                                        placeholder={q.placeholder}
                                        placeholderTextColor="#9CA3AF"
                                        value={answers[q.label] || ''}
                                        onChangeText={(text) => handleAnswerChange(q.label, text)}
                                    />
                                </View>
                            ))}

                            {/* Progress Indicators */}
                            <Text className="text-textSecondary text-xs font-bold uppercase tracking-wider mb-3 mt-4">Progress Indicators</Text>
                            <View className="space-y-4 mb-8 gap-4">
                                <TouchableOpacity
                                    className="flex-row items-start"
                                    onPress={() => toggleIndicator('articulate')}
                                    activeOpacity={0.7}
                                >
                                    <View className={`w-6 h-6 rounded-md border mr-3 items-center justify-center ${indicators.articulate ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                                        {indicators.articulate && <Ionicons name="checkmark" size={16} color="white" />}
                                    </View>
                                    <Text className="flex-1 text-textDark leading-6">Can engage with reminders of the loss without being overwhelmed</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-start"
                                    onPress={() => toggleIndicator('recognize')}
                                    activeOpacity={0.7}
                                >
                                    <View className={`w-6 h-6 rounded-md border mr-3 items-center justify-center ${indicators.recognize ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                                        {indicators.recognize && <Ionicons name="checkmark" size={16} color="white" />}
                                    </View>
                                    <Text className="flex-1 text-textDark leading-6">Has developed strategies for mananging triggers</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-start"
                                    onPress={() => toggleIndicator('acknowledge')}
                                    activeOpacity={0.7}
                                >
                                    <View className={`w-6 h-6 rounded-md border mr-3 items-center justify-center ${indicators.acknowledge ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                                        {indicators.acknowledge && <Ionicons name="checkmark" size={16} color="white" />}
                                    </View>
                                    <Text className="flex-1 text-textDark leading-6">Can acknowledge both progress and continuing challenges</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-start"
                                    onPress={() => toggleIndicator('path')}
                                    activeOpacity={0.7}
                                >
                                    <View className={`w-6 h-6 rounded-md border mr-3 items-center justify-center ${indicators.path ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                                        {indicators.path && <Ionicons name="checkmark" size={16} color="white" />}
                                    </View>
                                    <Text className="flex-1 text-textDark leading-6">Has found ways to incorporate reminders into daily life</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                className="bg-primary py-4 rounded-xl items-center shadow-lg shadow-teal-200"
                                onPress={handleSave}
                                activeOpacity={0.8}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">Save Progress</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </ScreenContainer >
    );
}
