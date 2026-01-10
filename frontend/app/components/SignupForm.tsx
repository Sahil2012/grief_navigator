import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ModalTerms from "./ModalTerms";
import { useSignup } from "../hooks/useSignup";
import { STRINGS } from "../constants/strings";
import ModernInput from "./auth/ModernInput";

const SignupForm = () => {
  const {
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirm, setShowConfirm,
    acceptTerms, setAcceptTerms,
    showTermsModal, setShowTermsModal,
    loading,
    handleSignup,
  } = useSignup();

  return (
    <View className="mb-2">
      {/* Split First/Last Name */}
      <View className="flex-row gap-3 mb-0">
        <View className="flex-1">
          <ModernInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View className="flex-1">
          <ModernInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>

      <ModernInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        icon={<FontAwesome name="envelope-o" size={16} color="#9CA3AF" />}
      />

      <ModernInput
        placeholder="Create Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        icon={<FontAwesome name="lock" size={18} color="#9CA3AF" />}
        rightIcon={<FontAwesome name={showPassword ? "eye" : "eye-slash"} size={16} color="#9CA3AF" />}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      <ModernInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirm}
        icon={<FontAwesome name="lock" size={18} color="#9CA3AF" />}
        rightIcon={<FontAwesome name={showConfirm ? "eye" : "eye-slash"} size={16} color="#9CA3AF" />}
        onRightIconPress={() => setShowConfirm(!showConfirm)}
      />

      <Text className="text-[10px] text-gray-400 mb-4 ml-1 mt-0">
        {STRINGS.LABELS.MUST_CONTAIN_CHARS}
      </Text>

      {/* Terms Checkbox */}
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => setAcceptTerms((v) => !v)}
        activeOpacity={0.7}
      >
        <View className={`w-4 h-4 border rounded mr-2 items-center justify-center ${acceptTerms ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`}>
          {acceptTerms ? <FontAwesome name="check" size={10} color="#fff" /> : null}
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-500">
            I agree to the
            <Text className="font-semibold text-gray-900" onPress={() => setShowTermsModal(true)}> Terms & Conditions</Text>
            {" "}& Privacy Policy.
          </Text>
        </View>
      </TouchableOpacity>

      <ModalTerms
        visible={showTermsModal}
        onAccept={() => {
          setAcceptTerms(true);
          setShowTermsModal(false);
        }}
        onCancel={() => setShowTermsModal(false)}
      />

      {/* Sign Up Button (Compact) */}
      <TouchableOpacity
        className="w-full bg-gray-900 h-12 rounded-full shadow-md items-center justify-center"
        activeOpacity={0.9}
        disabled={!acceptTerms || loading}
        style={!acceptTerms ? { opacity: 0.5, backgroundColor: '#4B5563' } : undefined}
        onPress={handleSignup}
      >
        <Text className="text-white font-semibold text-base tracking-wide">
          {loading ? STRINGS.LABELS.SIGNING_UP : STRINGS.LABELS.SIGN_UP}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;
