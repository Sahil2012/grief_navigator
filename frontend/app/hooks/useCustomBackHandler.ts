import { useCallback } from "react";
import { BackHandler } from "react-native";
import { Router, useFocusEffect } from "expo-router";

export function useCustomBackHandler(router: Router, targetRoute?: string, enabled: boolean = true) {
    useFocusEffect(
        useCallback(() => {
            if (!enabled) return;

            const onBackPress = () => {
                if (targetRoute) {
                    router.dismissTo(targetRoute as any);
                } else {
                    router.back();
                }
                return true;
            };
            const back = BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => back.remove();
        }, [targetRoute, router, enabled])
    );
}