import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import OnboardingScreen from "./onboarding";
import { useRouter } from "expo-router";
import { supabase } from "./services/api/supabaseConfig";
import { useAuthStore } from "./store/authStore";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // Restore token and user info to store
          setToken(session.access_token);
          if (session.user) {
            setUser(session.user);
          }

          // Redirect to dashboard
          router.replace("/dashboard");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return <OnboardingScreen />
}
