import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
const SignupLink = () => {
  const router = useRouter();
  return (
    <View className="pt-8 items-center flex-row justify-center">
      <Text className="text-base text-textSecondary">
        Don&apos;t have an account?{" "}
      </Text>
      <TouchableOpacity onPress={() => router.replace("/signup")}>
        <Text className="text-primary font-bold">
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default SignupLink;
