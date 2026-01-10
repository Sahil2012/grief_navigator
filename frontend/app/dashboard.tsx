import { Stack } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import BottomBar from "./components/BottomBar";
import ComingSoon from "./components/ComingSoon";
import { THEME } from "./constants/theme";
import HomeScreen from "./home";
import JournalHistoryScreen from "./history";

const DashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View className="flex-1" style={{ backgroundColor: THEME.COLORS.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      {activeTab === "home" ? (
        <HomeScreen />
      ) : activeTab === "journal" ? (
        <JournalHistoryScreen />
      ) : (
        <ComingSoon />
      )}
      <BottomBar activeTab={activeTab} setActiveTab={setActiveTab} colors={THEME.COLORS} />
    </View>
  );
};

export default DashboardScreen;
