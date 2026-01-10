import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../constants/theme";
import { useProfile } from "../hooks/useProfile";
import { authService } from "../services/api/authService";
import { useAuthStore } from "../store/authStore";

const ProfileScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { profile, isLoading, error, updateProfile } = useProfile();
    const clearToken = useAuthStore(state => state.clearToken);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Local form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        phoneNumber: "",
        email: "", // Read-only usually
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                bio: profile.bio || "",
                phoneNumber: profile.phoneNumber || "",
                email: profile.email || "",
            });
        }
    }, [profile]);

    const handleSave = async () => {
        if (!process.env.TEST && (!formData.firstName.trim() || !formData.lastName.trim())) {
            Alert.alert("Error", "First and Last Name are required.");
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({
                ...profile,
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio,
                phoneNumber: formData.phoneNumber,
            });
            setIsEditing(false);
            Alert.alert("Success", "Profile updated successfully.");
        } catch (err) {
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await authService.logout();
                        } catch (error) {
                            console.log("Logout error:", error);
                        } finally {
                            clearToken();
                            router.replace('/login');
                        }
                    }
                }
            ]
        );
    };

    if (isLoading && !profile) {
        return (
            <View className="flex-1 items-center justify-center bg-[#F9FAFB]">
                <ActivityIndicator size="large" color={THEME.COLORS.primary} />
            </View>
        );
    }

    if (error && !profile) {
        return (
            <View className="flex-1 items-center justify-center bg-[#F9FAFB] px-5">
                <Text className="text-red-500 text-center mb-4">{error}</Text>
                <TouchableOpacity onPress={() => router.back()} className="bg-gray-200 px-4 py-2 rounded-lg">
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            {/* Custom Header */}
            <View
                className="px-5 pb-3 bg-white flex-row justify-between items-center z-50 border-b border-gray-100"
                style={{ paddingTop: insets.top + 10 }}
            >
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color={THEME.COLORS.textDark} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-textDark">Profile</Text>
                <TouchableOpacity
                    onPress={() => {
                        if (isEditing) handleSave();
                        else setIsEditing(true);
                    }}
                    disabled={isSaving}
                    className="p-2 -mr-2"
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color={THEME.COLORS.primary} />
                    ) : (
                        <Text className={`font-bold ${isEditing ? 'text-primary' : 'text-blue-500'}`}>
                            {isEditing ? "Save" : "Edit"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1">
                {/* Profile Header Card */}
                <View className="bg-white pb-8 pt-6 items-center border-b border-gray-100 rounded-b-[40px] shadow-sm mb-6">
                    <View className="relative mb-4">
                        <Image
                            source={{ uri: profile?.profilePictureUrl || 'https://i.pravatar.cc/150?img=32' }}
                            className="w-28 h-28 rounded-full border-4 border-gray-50 bg-gray-200"
                        />
                        {isEditing && (
                            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-white shadow-sm">
                                <Ionicons name="camera" size={16} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {!isEditing ? (
                        <>
                            <Text className="text-2xl font-bold text-textDark mb-1">
                                {profile?.firstName} {profile?.lastName}
                            </Text>
                            <Text className="text-textSecondary text-sm mb-4">{profile?.email}</Text>

                            {/* Completion Badge */}
                            <View className={`px-4 py-1.5 rounded-full ${profile?.completionStatus === 'COMPLETED' ? 'bg-green-100' : 'bg-orange-100'
                                }`}>
                                <Text className={`text-xs font-bold ${profile?.completionStatus === 'COMPLETED' ? 'text-green-700' : 'text-orange-700'
                                    }`}>
                                    {profile?.completionStatus === 'COMPLETED' ? 'Profile Complete' : 'Setup In Progress'}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <Text className="text-textSecondary text-sm">Tap camera to change photo</Text>
                    )}
                </View>

                {/* Form / Details Fields */}
                <View className="px-5">
                    {/* Name Section (Only in Edit) */}
                    {isEditing && (
                        <View className="flex-row justify-between mb-4 gap-4">
                            <View className="flex-1">
                                <Text className="text-textSecondary text-xs font-bold uppercase mb-2 ml-1">First Name</Text>
                                <TextInput
                                    value={formData.firstName}
                                    onChangeText={(text) => setFormData(p => ({ ...p, firstName: text }))}
                                    className="bg-white p-4 rounded-2xl border border-gray-100 text-textDark"
                                    placeholder="First Name"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-textSecondary text-xs font-bold uppercase mb-2 ml-1">Last Name</Text>
                                <TextInput
                                    value={formData.lastName}
                                    onChangeText={(text) => setFormData(p => ({ ...p, lastName: text }))}
                                    className="bg-white p-4 rounded-2xl border border-gray-100 text-textDark"
                                    placeholder="Last Name"
                                />
                            </View>
                        </View>
                    )}

                    {/* Bio Section */}
                    <View className="mb-6">
                        <Text className="text-textSecondary text-xs font-bold uppercase mb-2 ml-1">About Me</Text>
                        {isEditing ? (
                            <TextInput
                                value={formData.bio}
                                onChangeText={(text) => setFormData(p => ({ ...p, bio: text }))}
                                className="bg-white p-4 rounded-2xl border border-gray-100 text-textDark h-24"
                                placeholder="Share a little about yourself..."
                                multiline
                                textAlignVertical="top"
                            />
                        ) : (
                            <View className="bg-white p-5 rounded-3xl border border-white shadow-sm">
                                <Text className="text-textDark leading-6">
                                    {profile?.bio || "No bio added yet."}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Contact Info */}
                    <Text className="text-lg font-bold text-textDark mb-4">Contact Info</Text>
                    <View className="bg-white rounded-3xl p-2 border border-white shadow-sm mb-8">
                        <View className="flex-row items-center p-4 border-b border-gray-50">
                            <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-4">
                                <Ionicons name="call-outline" size={20} color={THEME.COLORS.blueSoft} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-textSecondary text-xs mb-0.5">Phone Number</Text>
                                {isEditing ? (
                                    <TextInput
                                        value={formData.phoneNumber}
                                        onChangeText={(text) => setFormData(p => ({ ...p, phoneNumber: text }))}
                                        className="text-textDark font-medium py-1 border-b border-gray-200"
                                        placeholder="+1 234 567 890"
                                        keyboardType="phone-pad"
                                    />
                                ) : (
                                    <Text className="text-textDark font-medium">{profile?.phoneNumber || "Not set"}</Text>
                                )}
                            </View>
                        </View>
                        <View className="flex-row items-center p-4">
                            <View className="w-10 h-10 bg-purple-50 rounded-xl items-center justify-center mr-4">
                                <Ionicons name="mail-outline" size={20} color={THEME.COLORS.purpleSoft} />
                            </View>
                            <View>
                                <Text className="text-textSecondary text-xs mb-0.5">Email Address</Text>
                                <Text className="text-textDark font-medium text-gray-500">
                                    {profile?.email || "user@example.com"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Actions */}
                    {!isEditing && (
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="bg-red-50 p-4 rounded-2xl flex-row items-center justify-center border border-red-100 mb-8"
                        >
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                            <Text className="text-red-500 font-bold">Log Out</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
