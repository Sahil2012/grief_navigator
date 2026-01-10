import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
const AlreadyAccountLink = () => {
    const router = useRouter();
    return (
  <View className="pt-8 items-center flex-row justify-center">
    <Text className="text-base text-textSecondary">
      Already have an Account?{' '}
      </Text>
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text className="text-primary font-bold">
          Sign In
        </Text>
      </TouchableOpacity>
  </View>
);
}

export default AlreadyAccountLink;
