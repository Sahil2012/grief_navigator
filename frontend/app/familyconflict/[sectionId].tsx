import React, { useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFamilyConflictStore } from '../store/familyConflictStore';
import { FAMILY_CONFLICT_SECTIONS } from '../constants/familyConflictData';
import { familyConflictService } from '../services/api/familyConflictService';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { AppHeader } from '../components/ui/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '../components/ui/Skeleton';
import Animated, { FadeIn } from 'react-native-reanimated';


export default function FamilyConflictSectionScreen() {
    const { sectionId } = useLocalSearchParams<{ sectionId: string }>();
    const router = useRouter();

    const {
        assessmentId,
        submitSectionAnswers,
        loading: storeLoading,
        setAnswer,
        answers: storeAnswers
    } = useFamilyConflictStore();

    const [questions, setQuestions] = React.useState<any[]>([]);
    const [fetching, setFetching] = React.useState(true);

    const sectionIndex = FAMILY_CONFLICT_SECTIONS.findIndex(s => s.id === sectionId);
    const sectionData = FAMILY_CONFLICT_SECTIONS[sectionIndex];
    const isLastSection = sectionIndex === FAMILY_CONFLICT_SECTIONS.length - 1;

    // Local answers state for this section to drive inputs
    // We bind inputs to this, but commit to store on change or submit?
    // Using store directly might be laggy for text inputs, usually local state + onBlur or debounc is better.
    // But for simplicity, I'll update store directly or use a local map.
    // Let's use local map for text inputs to avoid re-rendering entire store on every keypress if store is large.
    const [localAnswers, setLocalAnswers] = React.useState<Record<string, string>>({});

    // Refs for scrolling to card on focus
    const scrollViewRef = React.useRef<KeyboardAwareScrollView>(null);
    const cardCoords = React.useRef<Record<number, number>>({});

    useEffect(() => {
        if (!assessmentId) {
            Alert.alert("Error", "No active assessment. Returning to start.", [
                { text: "OK", onPress: () => router.replace("/familyconflictscreen") }
            ]);
            return;
        }

        const fetchQs = async () => {
            setFetching(true);
            try {
                // sectionId must be defined here
                if (sectionId) {
                    const qs = await familyConflictService.getQuestions(sectionId);
                    setQuestions(qs);

                    // Pre-fetch next section to avoid loading delay on transition
                    const currentIdx = FAMILY_CONFLICT_SECTIONS.findIndex(s => s.id === sectionId);
                    if (currentIdx !== -1 && currentIdx < FAMILY_CONFLICT_SECTIONS.length - 1) {
                        const nextId = FAMILY_CONFLICT_SECTIONS[currentIdx + 1].id;
                        // Fire and forget
                        familyConflictService.getQuestions(nextId).catch(err => console.log('Prefetch failed', err));
                    }
                }
            } catch (error) {
                console.error("Failed to load questions", error);
                Alert.alert("Error", "Could not load questions for this section");
            } finally {
                setFetching(false);
            }
        };

        fetchQs();
    }, [sectionId, assessmentId]);

    const handleNext = async () => {
        // Validate
        // For now, allow skipping? Or assume some required?
        // User spec didn't strictly say required, but usually assessment questions are.
        // Let's check completion.
        /*
        const allAnswered = questions.every(q => {
             // Check if localAnswers has value. 
             // Note: questions DTO has 'fieldId', answer needs 'questionId' (which is numeric ID).
             // We need to ensure we have the ID.
             return !!localAnswers[q.fieldId]; 
        });
        */

        // Map local answers to DTO
        // We need to ensure question objects have ID. 
        // If not, we can't submit properly per strict DTO.
        // I will assume q.id exists.

        try {
            // Need to update store/localAnswers into format for submitSectionAnswers
            // submitSectionAnswers expects QuestionDTO[] to map.

            // First, sync local answers to store or just pass them?
            // The store method `submitSectionAnswers` reads from `store.answers`.
            // So we must update store first.

            Object.entries(localAnswers).forEach(([key, val]) => {
                // key is fieldId or ID? 
                // Wait, text input onChange uses fieldId usually.
                // But store expects `questionId` (number).
                // I need to find the question object by fieldId to get its numeric ID.
                const q = questions.find(q => q.fieldId === key);
                if (q && q.id) {
                    setAnswer(q.id, val);
                }
            });

            await submitSectionAnswers(questions);

            if (isLastSection) {
                router.push("/familyconflict/completed");
            } else {
                const nextSection = FAMILY_CONFLICT_SECTIONS[sectionIndex + 1];
                router.push(`/familyconflict/${nextSection.id}`);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save answers.");
        }
    };

    const handleTextChange = (fieldId: string, text: string) => {
        setLocalAnswers(prev => ({ ...prev, [fieldId]: text }));
    };

    if (fetching || !sectionData) {
        return (
            <ScreenContainer header={<AppHeader title="Loading..." />}>
                <View className="px-1 pt-4">
                    <View className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <Skeleton width="60%" height={24} borderRadius={4} style={{ marginBottom: 12 }} />
                        <Skeleton width="100%" height={48} borderRadius={8} style={{ marginBottom: 8 }} />
                        <Skeleton width="100%" height={48} borderRadius={8} />
                    </View>
                    <View className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <Skeleton width="80%" height={24} borderRadius={4} style={{ marginBottom: 12 }} />
                        <Skeleton width="100%" height={100} borderRadius={8} />
                    </View>
                </View>
            </ScreenContainer>
        );
    }


    return (
        <ScreenContainer
            header={
                <AppHeader
                    title={sectionData.title}
                    subtitle={`Part ${sectionIndex + 1} of ${FAMILY_CONFLICT_SECTIONS.length}`}
                />
            }
        >


            <Animated.View className="flex-1" entering={FadeIn}>
                <KeyboardAwareScrollView
                    ref={scrollViewRef}
                    enableOnAndroid={true}
                    extraScrollHeight={120}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    className="px-1"
                >
                    <Text className="text-textSecondary text-base mb-6 leading-6">
                        {sectionData.description}
                    </Text>

                    {questions.map((q, index) => (
                        <View
                            key={q.fieldId || index}
                            className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                            onLayout={(event) => {
                                const layout = event.nativeEvent.layout;
                                cardCoords.current[index] = layout.y;
                            }}
                        >
                            <Text className="text-lg font-semibold text-gray-800 mb-3">{q.question}</Text>

                            {(q.type === 'RADIO' || q.type === 'MCQ') && q.options && (
                                <View>
                                    {q.options.map((opt: string) => {
                                        const isSelected = localAnswers[q.fieldId] === opt;
                                        return (
                                            <TouchableOpacity
                                                key={opt}
                                                onPress={() => handleTextChange(q.fieldId, opt)}
                                                className={`flex-row items-center p-3 mb-2 rounded-lg border ${isSelected ? 'bg-primary/5 border-primary' : 'bg-gray-50 border-gray-200'}`}
                                            >
                                                <View className={`w-5 h-5 rounded-full border mr-3 items-center justify-center ${isSelected ? 'border-primary' : 'border-gray-400'}`}>
                                                    {isSelected && <View className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                                </View>
                                                <Text className={`text-base ${isSelected ? 'text-primary font-medium' : 'text-gray-700'}`}>{opt}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            {q.type === 'MCQ_MULTI' && q.options && (
                                <View>
                                    {q.options.map((opt: string) => {
                                        const currentVal = localAnswers[q.fieldId] || '';
                                        const selectedOptions = currentVal ? currentVal.split(',') : [];
                                        const isSelected = selectedOptions.includes(opt);

                                        const toggleOption = () => {
                                            let newOptions;
                                            if (isSelected) {
                                                newOptions = selectedOptions.filter(o => o !== opt);
                                            } else {
                                                newOptions = [...selectedOptions, opt];
                                            }
                                            handleTextChange(q.fieldId, newOptions.join(','));
                                        };

                                        return (
                                            <TouchableOpacity
                                                key={opt}
                                                onPress={toggleOption}
                                                className={`flex-row items-center p-3 mb-2 rounded-lg border ${isSelected ? 'bg-primary/5 border-primary' : 'bg-gray-50 border-gray-200'}`}
                                            >
                                                <View className={`w-5 h-5 rounded border mr-3 items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-gray-400 bg-white'}`}>
                                                    {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                                                </View>
                                                <Text className={`text-base ${isSelected ? 'text-primary font-medium' : 'text-gray-700'}`}>{opt}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            {q.type === 'DESCRIPTIVE' && (
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-base min-h-[120px]"
                                    multiline
                                    textAlignVertical="top"
                                    placeholder="Write here..."
                                    value={localAnswers[q.fieldId] || ''}
                                    onChangeText={(text) => handleTextChange(q.fieldId, text)}
                                    onFocus={() => {
                                        const y = cardCoords.current[index];
                                        if (y !== undefined) {
                                            // Scroll to just above the card for some breathing room
                                            setTimeout(() => {
                                                scrollViewRef.current?.scrollToPosition(0, Math.max(0, y - 10), true);
                                            }, 100);
                                        }
                                    }}
                                />
                            )}
                        </View>
                    ))}


                </KeyboardAwareScrollView>
                <View className="mb-5 mt-4 px-2">
                    <TouchableOpacity
                        className={`bg-primary py-4 rounded-xl shadow-md active:bg-primary/90 flex-row justify-center items-center ${storeLoading ? 'opacity-70' : ''}`}
                        onPress={handleNext}
                        disabled={storeLoading}
                    >
                        {storeLoading ? (
                            <View className="flex-row items-center">
                                <ActivityIndicator size="small" color="white" />
                                <Text className="text-white font-bold text-lg ml-2">Saving...</Text>
                            </View>
                        ) : (
                            <Text className="text-white text-center font-bold text-lg">
                                {isLastSection ? "Submit Assessment" : "Next Section"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </ScreenContainer>
    );
}
