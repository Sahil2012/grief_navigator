import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useLogin } from "../hooks/useLogin";
import { STRINGS } from "../constants/strings";
import ModernInput from "./auth/ModernInput";

const LoginForm = () => {
  const {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    rememberMe, setRememberMe,
    loading,
    handleLogin,
  } = useLogin();

  return (
    <View className="mb-6">
      <ModernInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        icon={<FontAwesome name="envelope-o" size={18} color="#9CA3AF" />}
      />

      <ModernInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        icon={<FontAwesome name="lock" size={20} color="#9CA3AF" />}
        rightIcon={
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"}
            size={18}
            color="#9CA3AF"
          />
        }
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      {/* Remember & Forgot */}
      <View className="flex-row items-center justify-between mb-8 mt-1">
        <TouchableOpacity
          className="flex-row items-center p-1"
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.7}
        >
          <View
            className={`w-5 h-5 border rounded-md mr-2 items-center justify-center ${rememberMe ? "bg-gray-900 border-gray-900" : "bg-white border-gray-300"
              }`}
          >
            {rememberMe ? <FontAwesome name="check" size={12} color="#fff" /> : null}
          </View>
          <Text className="text-sm text-gray-600 font-medium">Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7}>
          <Text className="text-sm font-semibold text-gray-900">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Dark Pill Button */}
      <TouchableOpacity
        onPress={handleLogin}
        className="w-full bg-gray-900 h-14 rounded-full shadow-lg shadow-gray-400/30 items-center justify-center"
        activeOpacity={0.9}
        disabled={loading}
        style={loading ? { opacity: 0.7 } : undefined}
      >
        <Text className="text-white font-semibold text-lg tracking-wide">
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
