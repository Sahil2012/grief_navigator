import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ScreenContainer } from '../ui/ScreenContainer';
import { AppHeader } from '../ui/AppHeader';

interface StatementReviewLayoutProps {
    title: string;
    subtitle: string;
    message: string;
    quote?: {
        text: string;
        author: string;
    };
    onSave: () => Promise<void>;
}

export const StatementReviewLayout: React.FC<StatementReviewLayoutProps> = ({
    title,
    subtitle,
    message,
    quote,
    onSave
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        setIsLoading(true);
        try {
            await onSave();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save progress. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <ScreenContainer header={<AppHeader title={title} subtitle={subtitle} />}>


            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                <View className="mb-8">
                    <Text className="text-2xl font-bold text-textDark mb-4 leading-8">
                        {message}
                    </Text>
                </View>

                {quote && (
                    <View className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
                        <Text className="text-base text-textSecondary leading- relaxed italic mb-3">
                            "{quote.text}"
                        </Text>
                        <Text className="text-sm font-bold text-textDark">
                            — {quote.author}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    className={`bg-primary py-4 rounded-xl ${isLoading ? 'opacity-80' : ''}`}
                    onPress={handleContinue}
                    disabled={isLoading}
                    activeOpacity={0.9}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg text-center">Continue</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </ScreenContainer>
    );
};
