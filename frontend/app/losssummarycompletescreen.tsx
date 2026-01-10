import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useLossStore } from './../app/store/lossStore';

export default function LossSummaryCompleteScreen() {
  const router = useRouter();

  const relationshipLosses = useLossStore(state => state.relationshipLosses);
  const thingLosses = useLossStore(state => state.thingLosses);
  const identityLosses = useLossStore(state => state.identityLosses);

  const handleContinue = () => {
    router.push('/difficulttimesscreen');
  };

  const renderPill = (label: string) => (
    <View
      key={label}
      className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mr-2 mb-2"
    >
      <Text
        className="text-xs font-medium text-textDark"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </View>
  );

  const renderSection = (title: string, data: any[]) => {
    if (!data || data.length === 0) return null;

    return (
      <View className="mb-6">
        <View className="flex-row items-center mb-2 justify-center">
          <View className="w-1.5 h-5 rounded-full bg-primary mr-2" />
          <Text className="text-sm font-semibold text-textDark uppercase tracking-wide">
            {title}
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-center">
          {data.map((item, index) =>
            renderPill(
              `${item.title} • ${item.timeAgo}${
                item.difficultyLabel ? ` • ${item.difficultyLabel}` : ''
              }`
            )
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#F4F6FB] px-5 pt-10 pb-6">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-center">
        {/* Top completion area */}
        <View className="items-center mb-6 px-4">
          <View className="w-28 h-28 rounded-full bg-primary/10 items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={72} color="#246BFD" />
          </View>

          <Text className="text-[24px] font-bold text-textDark text-center">
            Section completed
          </Text>
          <Text className="text-base text-textSecondary mt-3 text-center px-4 leading-6">
            Thank you for taking the time to register these losses.
            You have finished this section.
          </Text>
        </View>

        {/* Card with summary */}
        <View
          className="bg-white rounded-2xl px-4 py-5 shadow-md mx-1"
          style={{
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          <Text className="text-sm font-semibold text-textSecondary mb-3 text-center">
            Summary of what you shared
          </Text>

          <ScrollView
            style={{ maxHeight: 280 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 4 }}
          >
            {renderSection('Relationships', relationshipLosses)}
            {renderSection('Things', thingLosses)}
            {renderSection('Identity', identityLosses)}
          </ScrollView>
        </View>
      </View>

      {/* Bottom footer */}
      <View className="mt-5">
        <TouchableOpacity
          className="bg-primary py-3.5 rounded-xl shadow"
          onPress={handleContinue}
          activeOpacity={0.85}
          style={{
            shadowColor: '#246BFD',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <Text className="text-white font-bold text-lg text-center">
            Continue to next section
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
