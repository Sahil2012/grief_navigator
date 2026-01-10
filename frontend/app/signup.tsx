import { Stack } from "expo-router";
import React from "react";
import { Text, View, Platform } from "react-native";
import AlreadyAccountLink from "./components/AlreadyAccountLink";
import Divider from "./components/Divider";
import SignupForm from "./components/SignupForm";
import SocialLogin from "./components/SocialLogin";
import AuthLayout from "./components/auth/AuthLayout";

const SignupScreen: React.FC = () => {
  return (
    <AuthLayout>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Editorial Header */}
      <View className="items-center mb-4 mt-2">
        {/* Small Logo Icon */}
        <View className="w-10 h-10 bg-gray-900 rounded-xl items-center justify-center mb-3 shadow-lg shadow-gray-300">
          <Text className="text-white font-serif font-bold text-xl pt-1">P</Text>
        </View>

        <Text className={`text-3xl text-gray-900 text-center mb-1 ${Platform.OS === 'ios' ? 'font-[Georgia]' : 'font-serif'}`}>
          Join the Journey
        </Text>
        <Text className="text-base text-gray-500 text-center tracking-wide px-8">
          Create an account to track your progress
        </Text>
      </View>

      <SocialLogin label="Sign up with Google" />
      <Divider />

      <SignupForm />

      <View className="mt-4 pb-4">
        <AlreadyAccountLink />
      </View>
    </AuthLayout>
  );
};

export default SignupScreen;
