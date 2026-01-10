import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../constants/theme";

interface ComingSoonProps {
    showBackButton?: boolean;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ showBackButton = false }) => {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            <View className="w-full items-center mb-8">
                <Image
                    source={require("../../assets/images/coming_soon.png")}
                    style={{ width: 280, height: 280 }}
                    contentFit="contain"
                    transition={1000}
                />
            </View>

            <Text className="text-3xl font-bold text-center text-textDark mb-3">
                Coming Soon
            </Text>

            <Text className="text-base text-center text-textSecondary mb-8 max-w-[80%] leading-6">
                We're crafting something special here. This feature will be available in the next update.
            </Text>

            {showBackButton && (
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="py-3 px-8 rounded-2xl bg-primary shadow-sm active:opacity-90"
                    style={{ backgroundColor: THEME.COLORS.primary }}
                >
                    <Text className="text-white font-bold text-base">Go Back</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ComingSoon;
