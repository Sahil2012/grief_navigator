import React from "react";
import { Text, View } from "react-native";

const Divider = () => (
  <View className="flex-row items-center mb-6">
    <View className="flex-1 h-px bg-gray-200" />
    <Text className="mx-2 text-[13px] uppercase text-textSecondary">or</Text>
    <View className="flex-1 h-px bg-gray-200" />
  </View>
);

export default Divider;
