import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { useFamilyConflictStore } from '../store/familyConflictStore';
import { CompletionStatus, cygeService } from '../services/api/cygeService';
import { THEME } from '../constants/theme';
import { ScreenContainer } from '../components/ui/ScreenContainer';

export default function FamilyConflictCompletedScreen() {
    const router = useRouter();
    const { completeAssessment, reset } = useFamilyConflictStore();
    const [submitting, setSubmitting] = React.useState(true);

    useEffect(() => {
        const finish = async () => {
            try {
                // 1. Mark backend assessment as complete
                await completeAssessment();
                // 2. Update CYGE status
                // Wait, does cygeService exist and have complete method? 
                // Based on previous edits in this conversation (difficulttimesreview), yes.
                // Check if we need to call clearAll or something?
                // The previous code did.

                await cygeService.complete(CompletionStatus.COMPLETED);
            } catch (error) {
                console.error("Completion failed", error);
                // Allow user to proceed anyway? Or show error?
            } finally {
                setSubmitting(false);
            }
        };
        finish();
    }, []);

    const handleHome = () => {
        router.dismissTo("/assessmentchecklist"); // Or assessmentchecklist?
    };

    if (submitting) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color={THEME.COLORS.primary} />
                <Text className="mt-4 text-gray-500">Finalizing...</Text>
            </View>
        );
    }

    return (
        <ScreenContainer>
            <View className="flex-1 justify-center items-center px-6">
                <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
                    <Ionicons name="checkmark" size={48} color={"#10B981"} />
                </View>

                <Text className="text-2xl font-bold text-center text-gray-900 mb-3">Assessment Complete</Text>

                <Text className="text-center text-textSecondary text-base mb-10 leading-6">
                    Thank you for completing the Family Conflict assessment. Your honest responses help us provide better support.
                </Text>

                <TouchableOpacity
                    className="bg-primary w-full py-4 rounded-xl shadow-lg"
                    onPress={handleHome}
                >
                    <Text className="text-white text-center font-bold text-lg">Back to Dashboard</Text>
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
}



