import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type BottomBarProps = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  colors: { [key: string]: string };
};

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, setActiveTab, colors }) => (
  <View className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-lg px-6 pt-5 pb-5 flex-row items-center justify-around z-10"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.06,
      shadowRadius: 20,
      elevation: 10,
    }}
  >
    {/* Home Tab */}
    <TouchableOpacity className="items-center" onPress={() => setActiveTab("home")}>
      <FontAwesome6
        name="house-chimney"
        size={22}
        color={activeTab === "home" ? colors.primary : "#9CA3AF"}
      />
      <Text
        className={`text-xs ${activeTab === "home" ? "font-bold" : "font-medium"}`}
        style={{ color: activeTab === "home" ? colors.primary : "#9CA3AF" }}
      >
        Home
      </Text>
    </TouchableOpacity>

    {/* Programs Tab */}
    <TouchableOpacity className="items-center" onPress={() => setActiveTab("programs")}>
      <FontAwesome6 name="clone" size={21} color={activeTab === "programs" ? colors.primary : "#9CA3AF"} />
      <Text
        className={`text-xs ${activeTab === "programs" ? "font-bold" : "font-medium"}`}
        style={{ color: activeTab === "programs" ? colors.primary : "#9CA3AF" }}
      >
        Programs
      </Text>
    </TouchableOpacity>

    {/* Center Action (FAB, no active state) */}
    <View className="bg-[#FE9142] rounded-full p-4 border-4 border-white -mt-10 shadow-lg active:scale-95">
      <FontAwesome6 name="wand-magic-sparkles" size={22} color="white" />
    </View>

    {/* Journal Tab (History) */}
    <TouchableOpacity className="items-center" onPress={() => setActiveTab("journal")}>
      <Ionicons
        name={activeTab === "journal" ? "book" : "book-outline"}
        size={23}
        color={activeTab === "journal" ? colors.primary : "#9CA3AF"}
      />
      <Text
        className={`text-xs ${activeTab === "journal" ? "font-bold" : "font-medium"}`}
        style={{ color: activeTab === "journal" ? colors.primary : "#9CA3AF" }}
      >
        Journal
      </Text>
    </TouchableOpacity>

    {/* Account Tab */}
    <TouchableOpacity className="items-center" onPress={() => router.push('/profile')}>
      <FontAwesome6 name="user-circle" size={21} color={activeTab === "account" ? colors.primary : "#9CA3AF"} />
      <Text
        className={`text-xs ${activeTab === "account" ? "font-bold" : "font-medium"}`}
        style={{ color: activeTab === "account" ? colors.primary : "#9CA3AF" }}
      >
        Account
      </Text>
    </TouchableOpacity>
  </View>
);

export default BottomBar;
