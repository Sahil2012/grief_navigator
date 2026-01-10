import React from "react";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { THEME } from "../constants/theme";

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleRestart = () => {
        // In production, might want deeper reset, but this resets the UI state for now
        // If the error persists, the user might need to restart the app
        // We can try to navigate home using a hook wrapper or just setState
        this.setState({ hasError: false, error: null });
        // Note: class components can't use hooks like useRouter directly inside methods easily without wrapping
        // For simplicity, we just reset the boundary. If it crashes again immediately, it will show again.
    };

    render() {
        if (this.state.hasError) {
            return (
                <View className="flex-1 items-center justify-center bg-white px-6">
                    <View className="w-full items-center mb-8">
                        <Image
                            source={require("../../assets/images/error_state.png")}
                            style={{ width: 260, height: 260 }}
                            contentFit="contain"
                            transition={1000}
                        />
                    </View>

                    <Text className="text-2xl font-bold text-center text-textDark mb-3">
                        Oops! Something went wrong
                    </Text>

                    <Text className="text-base text-center text-textSecondary mb-8 max-w-[80%] leading-6">
                        We encountered an unexpected issue. Please try again.
                    </Text>

                    <TouchableOpacity
                        onPress={this.handleRestart}
                        className="py-3 px-8 rounded-2xl bg-primary shadow-sm active:opacity-90"
                        style={{ backgroundColor: THEME.COLORS.primary }}
                    >
                        <Text className="text-white font-bold text-base">Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
