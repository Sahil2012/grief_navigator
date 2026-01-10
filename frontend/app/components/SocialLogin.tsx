import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SocialLoginProps {
  label?: string; // Optional, defaults to "Sign in with Google"
}

const SocialLogin: React.FC<SocialLoginProps> = ({ label = "Sign in with Google" }) => (
  <View className="flex-row space-x-3 mb-6">
    <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 bg-white border border-gray-200 rounded-xl" activeOpacity={0.8}>
      <FontAwesome name="google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
      <Text className="font-semibold text-textDark text-[16px]">
        {label}
      </Text>
    </TouchableOpacity>
  </View>
);

export default SocialLogin;
