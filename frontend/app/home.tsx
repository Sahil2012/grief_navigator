import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { THEME } from "./constants/theme";
import { useRouter } from "expo-router";

import { DashboardHeader } from "./components/ui/DashboardHeader";
import { Skeleton } from "./components/ui/Skeleton";

import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { CompletionStatus, cygeService } from "./services/api/cygeService";
import { dailyCheckinService } from "./services/api/dailyCheckinService";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [readiness, setReadiness] = useState<CompletionStatus | null>(null);
  const [checkInCompleted, setCheckInCompleted] = useState(false);

  const isCheckInLocked = readiness === CompletionStatus.LOSS_PENDING;

  // Helper for Australian Date (same as DailyCheckInScreen)
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

  const [isLoading, setIsLoading] = useState(true);

  // ... (keep getAusDateISO helper)

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const today = getAusDateISO();
          const [readinessStatus, dailyStatus] = await Promise.all([
            cygeService.getReadiness(),
            dailyCheckinService.getDailyCheckinStatus(today)
          ]);
          setReadiness(readinessStatus);
          setCheckInCompleted(dailyStatus);
        } catch (error) {
          console.error("Failed to load home data", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const handleContinueAssessment = () => {
    if (!readiness) return;

    switch (readiness) {
      case CompletionStatus.LOSS_PENDING:
        router.push("/losssummary");
        break;
      case CompletionStatus.DIFFICULTY_PENDING:
        router.push("/difficulttimesscreen");
        break;
      case CompletionStatus.BELIEF_PENDING:
        router.push("/beliefsscreen");
        break;
      case CompletionStatus.AVOIDANCE_PENDING:
        router.push("/griefavoidancescreen");
        break;
      case CompletionStatus.FAMILY_CONFLICT_PENDING:
        // TODO: Implement Family Conflict Screen
        router.push("/coming-soon");
        break;
      default:
        break;
    }
  };


  return (
    <View className="flex-1 bg-[#F9FAFB]">
      {/* Header - Fixed at top */}
      <DashboardHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1">
        <View className="px-5 mt-6">



          {/* Welcome Section (Only show if completed or let it stay below?) 
              User said "mandatory thing to get started". implying they might be blocked. 
              But showing it at the top pushes everything down, effectively prioritizing it. 
              I will keep the rest of the UI visible but pushed down, so it doesn't look broken.
          */}

          {/* Welcome Section */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-textDark mb-1">Welcome Back!</Text>
            <Text className="text-textSecondary text-base">Let's make today meaningful</Text>
          </View>

          {isLoading ? (
            <View>
              {/* Action Required Skeleton */}
              <Skeleton width="100%" height={120} borderRadius={24} style={{ marginBottom: 24 }} />

              {/* Quote Card Skeleton */}
              <Skeleton width="100%" height={100} borderRadius={24} style={{ marginBottom: 20 }} />
            </View>
          ) : (
            <>
              {/* Mandatory Assessment Action */}
              {readiness && readiness !== CompletionStatus.COMPLETED && (
                <View className="bg-orange-50 rounded-3xl p-5 mb-6 border border-orange-100 shadow-sm">
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                      <Ionicons name="alert-circle" size={24} color="#F97316" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-bold text-lg">Action Required</Text>
                      <Text className="text-gray-600 text-xs">Complete your profile to unlock full features.</Text>
                    </View>
                  </View>
                  <Text className="text-gray-700 text-sm leading-5 mb-4">
                    Based on your progress, we need a few more details to personalize your healing journey.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/assessmentchecklist', params: { initialStatus: readiness } })}
                    className="bg-[#F97316] py-3 rounded-xl items-center shadow-sm active:opacity-90"
                  >
                    <Text className="text-white font-bold text-sm">Resume Assessment</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Quote Card */}
              <View className="bg-white rounded-3xl p-5 shadow-sm mb-5 border border-white">
                <View className="bg-blue-50 w-10 h-10 rounded-xl items-center justify-center mb-4">
                  <FontAwesome6 name="quote-left" size={16} color={THEME.COLORS.primary} />
                </View>
                <Text className="text-textDark font-medium text-lg leading-7 mb-2">
                  "The mind is everything. What you think you become."
                </Text>
                <Text className="text-textSecondary text-sm font-medium">- Buddha</Text>
              </View>
            </>
          )}


          {/* Daily Check-in Status Card */}
          <TouchableOpacity
            onPress={() => {
              if (isCheckInLocked) {
                alert("Please complete your Loss Profile assessment first.");
                return;
              }
              router.push('/dailycheckin' as any);
            }}
            activeOpacity={isCheckInLocked ? 1 : 0.7}
            className={`rounded-3xl p-4 flex-row items-center justify-between shadow-sm mb-8 border ${isCheckInLocked
              ? 'bg-gray-50 border-gray-100'
              : checkInCompleted
                ? 'bg-white border-white'
                : 'bg-blue-50 border-blue-100'
              }`}
          >
            <View className="flex-row items-center flex-1">
              <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isCheckInLocked
                ? 'bg-gray-100'
                : checkInCompleted
                  ? 'bg-green-50'
                  : 'bg-white'
                }`}>
                <Ionicons
                  name={isCheckInLocked ? "lock-closed" : (checkInCompleted ? "checkmark" : "calendar-outline")}
                  size={20}
                  color={isCheckInLocked ? "#9CA3AF" : (checkInCompleted ? THEME.COLORS.greenSoft : THEME.COLORS.blueSoft)}
                />
              </View>
              <View>
                <Text className={`font-bold text-base ${isCheckInLocked ? 'text-gray-400' : 'text-textDark'}`}>
                  Daily Check-in
                </Text>
                <Text className={`text-xs ${isCheckInLocked ? 'text-gray-400' : 'text-textSecondary'}`}>
                  {isCheckInLocked
                    ? 'Complete profile to unlock'
                    : checkInCompleted
                      ? 'Completed today'
                      : 'Tap to reflect'}
                </Text>
              </View>
            </View>

            {!isCheckInLocked && (
              <View className={`px-3 py-1.5 rounded-full ${checkInCompleted ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                <Text className={`text-xs font-bold ${checkInCompleted ? 'text-green-700' : 'text-blue-700'
                  }`}>
                  {checkInCompleted ? 'Done' : 'Start'}
                </Text>
              </View>
            )}

            {isCheckInLocked && (
              <View className="px-3 py-1.5 rounded-full bg-gray-100">
                <Text className="text-gray-400 text-xs font-bold">Locked</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Quick Actions */}
          <Text className="text-lg font-bold text-textDark mb-4">Quick Actions</Text>
          <View className="flex-row justify-between mb-8">
            {/* Action 1 */}
            <TouchableOpacity
              onPress={() => {
                if (isCheckInLocked) {
                  alert("Please complete your Loss Profile assessment first.");
                  return;
                }
                router.push('/dailycheckin' as any);
              }}
              activeOpacity={isCheckInLocked ? 1 : 0.7}
              className={`rounded-2xl p-4 w-[31%] items-center shadow-sm border h-28 justify-center ${isCheckInLocked ? 'bg-gray-50 border-gray-100' : 'bg-white border-white'
                }`}
            >
              <View className={`w-10 h-10 rounded-xl items-center justify-center mb-2 ${isCheckInLocked ? 'bg-gray-100' : 'bg-blue-50'
                }`}>
                <Ionicons
                  name={isCheckInLocked ? "lock-closed" : "calendar-outline"}
                  size={20}
                  color={isCheckInLocked ? "#9CA3AF" : THEME.COLORS.blueSoft}
                />
              </View>
              <Text className={`font-bold text-xs text-center ${isCheckInLocked ? 'text-gray-400' : 'text-textDark'
                }`}>Daily{"\n"}Check-in</Text>
            </TouchableOpacity>

            {/* Action 2 */}
            <TouchableOpacity
              onPress={() => router.push('/diary')}
              className="bg-white rounded-2xl p-4 w-[31%] items-center shadow-sm border border-white h-28 justify-center"
            >
              <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center mb-2">
                <Ionicons name="book-outline" size={20} color={THEME.COLORS.purpleSoft} />
              </View>
              <Text className="text-textDark font-bold text-xs text-center">Write{"\n"}Journal</Text>
            </TouchableOpacity>

            {/* Action 3 */}
            <TouchableOpacity
              onPress={() => router.push('/activities')}
              className="bg-white rounded-2xl p-4 w-[31%] items-center shadow-sm border border-white h-28 justify-center"
            >
              <View className="w-10 h-10 bg-orange-50 rounded-xl items-center justify-center mb-2">
                <Ionicons name="play" size={20} color="#F97316" />
              </View>
              <Text className="text-textDark font-bold text-xs text-center">Start{"\n"}Activity</Text>
            </TouchableOpacity>
          </View>

          {/* Today's Focus */}
          <View className="bg-white rounded-3xl p-5 shadow-sm mb-8 border border-white">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-cyan-50 rounded-full items-center justify-center mr-3">
                <Ionicons name="scan-outline" size={18} color={THEME.COLORS.primary} />
              </View>
              <Text className="text-textDark font-bold text-lg">Today's Focus</Text>
            </View>

            <Text className="text-textSecondary text-sm leading-5 mb-4">
              Practice mindfulness by taking three deep breaths before each meal. Notice the sensations, thoughts, and feelings.
            </Text>

            <View className="flex-row items-center">
              <View className="flex-1 h-2 bg-gray-100 rounded-full mr-3 overflow-hidden">
                <View className="h-full w-1/3 bg-cyan-500 rounded-full" />
              </View>
              <Text className="text-textSecondary text-xs font-semibold">1/3 completed</Text>
            </View>
          </View>

          {/* Suggested For You */}
          <Text className="text-lg font-bold text-textDark mb-4">Suggested for You</Text>
          <View className="bg-white rounded-3xl p-5 shadow-sm border border-white flex-row mb-6">
            <View className="w-20 h-20 bg-[#0EA5E9] rounded-2xl items-center justify-center mr-4 shadow-sm">
              <Text className="text-white font-bold text-sm">5 min</Text>
            </View>
            <View className="flex-1 justify-between py-1">
              <View>
                <Text className="text-textDark font-bold text-base mb-1">Breathing Exercise</Text>
                <Text className="text-textSecondary text-xs leading-4" numberOfLines={2}>
                  A guided breathing session to help reduce stress.
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/coming-soon')} className="bg-[#1E293B] self-start px-5 py-2 rounded-lg mt-2">
                <Text className="text-white text-xs font-bold">Start Now</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
