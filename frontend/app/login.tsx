import { Stack } from "expo-router";
import React from "react";
import { Text, View, Platform, Image } from "react-native";
import Divider from "./components/Divider";
import LoginForm from "./components/LoginForm";
import SignupLink from "./components/SignupLink";
import SocialLogin from "./components/SocialLogin";
import AuthLayout from "./components/auth/AuthLayout";

const LoginScreen: React.FC = () => {
  return (
    <AuthLayout>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Editorial Header */}
      <View className="items-center mb-10 mt-4">
        {/* Small Logo Icon */}
        <View className="w-12 h-12 bg-gray-900 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-gray-300">
          <Text className="text-white font-serif font-bold text-2xl pt-1">P</Text>
        </View>

        <Text className={`text-4xl text-gray-900 text-center mb-2 ${Platform.OS === 'ios' ? 'font-[Georgia]' : 'font-serif'}`}>
          Welcome Back
        </Text>
        <Text className="text-base text-gray-500 text-center tracking-wide">
          Sign in to continue your journey
        </Text>
      </View>

      <SocialLogin label="Sign in with Google" />
      <Divider />

      <LoginForm />

      <View className="mt-6">
        <SignupLink />
      </View>
    </AuthLayout>
  );
};

export default LoginScreen;
