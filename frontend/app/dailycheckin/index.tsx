import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withSpring,
    FadeInDown,
} from 'react-native-reanimated';


import { lossService, LossDTO } from '../services/api/lossService';
import { dailyCheckinService, DailyCheckinDTO } from '../services/api/dailyCheckinService';
import { THEME } from '../constants/theme';
import { AppHeader } from '../components/ui/AppHeader';
import { Skeleton } from '../components/ui/Skeleton';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = SCREEN_WIDTH - 48; // Less padding for wider slider
const KNOB_SIZE = 32;

// --- Premium Components ---

const EmotionChip = ({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        className={`px-4 py-3 rounded-2xl mr-3 mb-3 border flex-row items-center transition-all ${selected
            ? 'bg-primary border-primary'
            : 'bg-white border-gray-100'
            }`}
        style={selected ? { shadowColor: THEME.COLORS.primary, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4, shadowOffset: { width: 0, height: 2 } } : {}}
    >
        <Text className={`font-semibold text-sm ${selected ? 'text-white' : 'text-gray-600'}`}>
            {label}
        </Text>
        {selected && <Ionicons name="checkmark-circle" size={16} color="white" style={{ marginLeft: 6 }} />}
    </TouchableOpacity>
);

// --- Custom Slider with Visual Feedback ---
interface CustomSliderProps {
    value: number;
    onValueChange: (val: number) => void;
}

const CustomSlider = ({ value, onValueChange }: CustomSliderProps) => {
    const translateX = useSharedValue(0);
    const contextX = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        const percentage = value / 10;
        translateX.value = percentage * (SLIDER_WIDTH - KNOB_SIZE);
    }, []);

    const updateValue = (x: number) => {
        'worklet';
        const rawX = Math.min(Math.max(x, 0), SLIDER_WIDTH - KNOB_SIZE);
        translateX.value = rawX;
        const result = Math.round((rawX / (SLIDER_WIDTH - KNOB_SIZE)) * 10);
        runOnJS(onValueChange)(result);
    };

    const gesture = Gesture.Pan()
        .onStart(() => {
            contextX.value = translateX.value;
            scale.value = withSpring(1.2);
        })
        .onUpdate((event) => {
            updateValue(contextX.value + event.translationX);
        })
        .onEnd(() => {
            scale.value = withSpring(1);
        });

    const knobStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { scale: scale.value }],
    }));

    const trackStyle = useAnimatedStyle(() => ({
        width: translateX.value + KNOB_SIZE / 2,
    }));

    // Dynamic color based on intensity
    const getIntensityColor = (val: number) => {
        if (val < 4) return THEME.COLORS.greenSoft;
        if (val < 7) return '#F59E0B'; // Amber
        return '#EF4444'; // Red
    };

    const currentColor = getIntensityColor(value);

    return (
        <View className="h-16 justify-center">
            {/* Run Track */}
            <View className="h-3 bg-gray-100 rounded-full w-full absolute overflow-hidden">
                <Animated.View
                    className="h-full rounded-full"
                    style={[trackStyle, { backgroundColor: currentColor }]}
                />
            </View>

            {/* Ticks */}
            <View className="flex-row justify-between w-full absolute px-1 pointer-events-none opacity-30">
                {[0, 2, 4, 6, 8, 10].map(i => (
                    <View key={i} className="w-[1px] h-2 bg-gray-400" />
                ))}
            </View>

            <GestureDetector gesture={gesture}>
                <Animated.View
                    className="absolute bg-white items-center justify-center border-2"
                    style={[
                        {
                            width: KNOB_SIZE,
                            height: KNOB_SIZE,
                            borderRadius: KNOB_SIZE,
                            borderColor: currentColor,
                            shadowColor: currentColor,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                        },
                        knobStyle,
                    ]}
                >
                    <View className={`w-3 h-3 rounded-full`} style={{ backgroundColor: currentColor }} />
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

// --- Main Screen ---
export default function DailyCheckInScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
    const [losses, setLosses] = useState<LossDTO[]>([]);

    // Form State
    const [selectedLossId, setSelectedLossId] = useState<number | null>(null);
    const [griefIntensity, setGriefIntensity] = useState(5);
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [showLossModal, setShowLossModal] = useState(false);
    const scrollViewRef = React.useRef<KeyboardAwareScrollView>(null);
    const notesY = React.useRef(0);

    // Australian Date
    const getFormattedDate = () => {
        return new Intl.DateTimeFormat('en-AU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        }).format(new Date());
    };

    const getAusDateISO = () => {
        const parts = new Intl.DateTimeFormat('en-AU', {
            timeZone: 'Australia/Sydney',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).formatToParts(new Date());
        const year = parts.find(p => p.type === 'year')?.value;
        const month = parts.find(p => p.type === 'month')?.value;
        const day = parts.find(p => p.type === 'day')?.value;
        return `${year}-${month}-${day}`;
    };

    const EMOTIONS = [
        'Sadness', 'Anger', 'Guilt', 'Relief', 'Anxiety',
        'Loneliness', 'Numbness', 'Confusion', 'Hope',
        'Acceptance', 'Frustration', 'Peace'
    ];

    useEffect(() => {
        checkStatusAndLoadLosses();
    }, []);

    const checkStatusAndLoadLosses = async () => {
        try {
            const todayISO = getAusDateISO();
            const [status, fetchedLosses] = await Promise.all([
                dailyCheckinService.getDailyCheckinStatus(todayISO),
                lossService.getAllLosses()
            ]);

            setAlreadyCheckedIn(status);
            setLosses(fetchedLosses);
            if (fetchedLosses.length > 0 && !selectedLossId) {
                setSelectedLossId(fetchedLosses[0].id);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            Alert.alert('Error', 'Could not load your check-in data.');
        } finally {
            setLoading(false);
        }
    };

    const toggleEmotion = (emotion: string) => {
        if (selectedEmotions.includes(emotion)) {
            setSelectedEmotions(prev => prev.filter(e => e !== emotion));
        } else {
            setSelectedEmotions(prev => [...prev, emotion]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedLossId) {
            Alert.alert('Missing Information', 'Please select which loss you are reflecting on.');
            return;
        }
        if (selectedEmotions.length === 0) {
            Alert.alert('Missing Emotions', 'Please select at least one emotion to continue.');
            return;
        }

        setSubmitting(true);
        try {
            const payload: DailyCheckinDTO = {
                lossId: selectedLossId,
                checkInDate: getAusDateISO(),
                griefIntensity,
                emotionsCsv: selectedEmotions.join(','),
                notes,
            };
            await dailyCheckinService.saveDailyCheckin(payload);
            setAlreadyCheckedIn(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to save check-in. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const getSelectedLossLabel = () => {
        const loss = losses.find(l => l.id === selectedLossId);
        return loss ? `${loss.type} • ${loss.description}` : 'Select a loss...';
    };

    // --- Loading State ---
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="px-6 pb-2">
                    {/* Header Skeleton */}
                    <View className="flex-row items-center justify-between mb-2 mt-4">
                        <View>
                            <Skeleton width={150} height={24} borderRadius={4} style={{ marginBottom: 4 }} />
                            <Skeleton width={100} height={16} borderRadius={4} />
                        </View>
                    </View>
                </View>

                <View className="px-6 pt-6">
                    {/* Loss Selector Skeleton */}
                    <View className="mb-8">
                        <Skeleton width={140} height={20} borderRadius={4} style={{ marginBottom: 12 }} />
                        <Skeleton width="100%" height={80} borderRadius={24} />
                    </View>

                    {/* Slider Skeleton */}
                    <View className="mb-10">
                        <View className="flex-row justify-between items-end mb-4">
                            <Skeleton width={80} height={20} borderRadius={4} />
                            <Skeleton width={60} height={32} borderRadius={8} />
                        </View>
                        <Skeleton width="100%" height={64} borderRadius={32} />
                    </View>

                    {/* Emotions Skeleton */}
                    <View className="mb-8">
                        <Skeleton width={120} height={20} borderRadius={4} style={{ marginBottom: 12 }} />
                        <View className="flex-row flex-wrap">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <Skeleton
                                    key={i}
                                    width={80}
                                    height={40}
                                    borderRadius={16}
                                    style={{ marginRight: 12, marginBottom: 12 }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // --- Success State ---
    if (alreadyCheckedIn) {
        return (
            <View className="flex-1 bg-white items-center justify-center px-6">
                <Stack.Screen options={{ headerShown: false }} />
                <View className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-6" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 }}>
                    <Ionicons name="checkmark" size={48} color={THEME.COLORS.greenSoft} />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">Check-in Complete</Text>
                <Text className="text-gray-500 text-center mb-8 leading-6">
                    You've taken a moment for yourself today. Great job acknowledging your feelings.
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="bg-gray-900 w-full py-4 rounded-2xl items-center active:opacity-90"
                >
                    <Text className="text-white font-bold text-base">Back to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <GestureHandlerRootView className="flex-1 bg-[#FDFDFD]">
            <Stack.Screen options={{
                headerShown: false,
            }} />

            <ScreenContainer
                header={<AppHeader title={getFormattedDate()} subtitle="Daily Reflection" />}
                className="bg-[#FDFDFD]"
            >
                <KeyboardAwareScrollView
                    ref={scrollViewRef}
                    enableOnAndroid={true}
                    extraScrollHeight={120}
                    contentContainerStyle={{ flexGrow: 1, paddingTop: 10, paddingBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    className="px-1"
                >

                    {/* 1. Loss Selector (Custom Card) */}
                    <Animated.View className="mb-8" entering={FadeInDown.delay(100).duration(500).springify()}>
                        <Text className="text-base font-bold text-gray-800 mb-3">Focus of reflection</Text>
                        <TouchableOpacity
                            onPress={() => setShowLossModal(true)}
                            className="bg-white p-5 rounded-3xl border border-gray-100 flex-row items-center justify-between active:bg-gray-50"
                            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 }}
                        >
                            <View className="flex-1 mr-2">
                                {/* Removed redundant "Selected Loss" label */}
                                <Text className="text-gray-900 font-semibold text-lg" numberOfLines={1}>
                                    {getSelectedLossLabel()}
                                </Text>
                            </View>
                            <Ionicons name="chevron-down" size={20} color={THEME.COLORS.primary} />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* 2. Intensity Slider */}
                    <Animated.View className="mb-10" entering={FadeInDown.delay(200).duration(500).springify()}>
                        <View className="flex-row justify-between items-end mb-4">
                            <Text className="text-base font-bold text-gray-800">Intensity</Text>
                            <View className="bg-gray-50 px-3 py-1 rounded-lg">
                                <Text className="text-xl font-bold text-gray-900">{griefIntensity}<Text className="text-sm text-gray-400 font-normal">/10</Text></Text>
                            </View>
                        </View>

                        <CustomSlider value={griefIntensity} onValueChange={setGriefIntensity} />

                        <View className="flex-row justify-between mt-2">
                            <Text className="text-xs text-gray-400 font-medium">Peaceful</Text>
                            <Text className="text-xs text-gray-400 font-medium">Overwhelming</Text>
                        </View>
                    </Animated.View>

                    {/* 3. Emotions */}
                    <Animated.View className="mb-8" entering={FadeInDown.delay(300).duration(500).springify()}>
                        <Text className="text-base font-bold text-gray-800 mb-3">How does it feel?</Text>
                        <View className="flex-row flex-wrap">
                            {EMOTIONS.map(e => (
                                <EmotionChip
                                    key={e}
                                    label={e}
                                    selected={selectedEmotions.includes(e)}
                                    onPress={() => toggleEmotion(e)}
                                />
                            ))}
                        </View>
                    </Animated.View>

                    {/* 4. Notes */}
                    <Animated.View
                        className="mb-8"
                        entering={FadeInDown.delay(400).duration(500).springify()}
                        onLayout={(e) => notesY.current = e.nativeEvent.layout.y}
                    >
                        <Text className="text-base font-bold text-gray-800 mb-3">Journal (Optional)</Text>
                        <TextInput
                            className="bg-white border border-gray-100 rounded-3xl p-5 text-gray-800 text-base min-h-[120px]"
                            multiline
                            placeholder="What's on your mind today?"
                            placeholderTextColor="#9CA3AF"
                            value={notes}
                            onChangeText={setNotes}
                            style={{ lineHeight: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}
                            onFocus={() => {
                                setTimeout(() => {
                                    scrollViewRef.current?.scrollToPosition(0, Math.max(0, notesY.current - 20), true);
                                }, 100);
                            }}
                        />
                    </Animated.View>


                </KeyboardAwareScrollView>




                {/* Submit Button */}
                <Animated.View className="px-4 pt-2" entering={FadeInDown.delay(500).duration(500).springify()}>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={submitting}
                        className={`py-4 rounded-2xl items-center mb-8 ${submitting ? 'opacity-70' : ''}`}
                        style={{ backgroundColor: THEME.COLORS.primary, shadowColor: THEME.COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
                    >
                        {submitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View className="flex-row items-center">
                                <Text className="text-white font-bold text-lg mr-2">Save Check-in</Text>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                </Animated.View>
                {/* Custom Modal for Loss Selection */}
                <Modal
                    visible={showLossModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowLossModal(false)}
                >
                    <View className="flex-1 bg-black/40 justify-end">
                        <Pressable className="flex-1" onPress={() => setShowLossModal(false)} />
                        <View className="bg-white rounded-t-3xl p-6 h-[50%]">
                            <Text className="text-xl font-bold text-gray-900 mb-4 text-center">Select Loss</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {losses.map(loss => (
                                    <TouchableOpacity
                                        key={loss.id}
                                        onPress={() => {
                                            setSelectedLossId(loss.id);
                                            setShowLossModal(false);
                                        }}
                                        className={`p-4 mb-3 rounded-2xl border ${selectedLossId === loss.id
                                            ? 'bg-teal-50 border-teal-200'
                                            : 'bg-white border-gray-100'
                                            }`}
                                    >
                                        <View className="flex-row items-center">
                                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${selectedLossId === loss.id ? 'bg-teal-100' : 'bg-gray-50'
                                                }`}>
                                                <Ionicons
                                                    name={selectedLossId === loss.id ? "radio-button-on" : "radio-button-off"}
                                                    size={20}
                                                    color={selectedLossId === loss.id ? THEME.COLORS.primary : "#9CA3AF"}
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <Text className={`font-bold text-base ${selectedLossId === loss.id ? 'text-teal-900' : 'text-gray-900'}`}>{loss.type}</Text>
                                                <Text className="text-gray-500 text-sm">{loss.description}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

            </ScreenContainer>
        </GestureHandlerRootView>
    );
}
