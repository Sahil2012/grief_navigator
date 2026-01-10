// OnboardingScreen.tsx
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Dimensions, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore: SVG module declarations are missing
import Onboard1 from "./../assets/svgs/onboard1.svg";
// @ts-ignore: SVG module declarations are missing
import Onboard2 from "./../assets/svgs/onboard2.svg";
// @ts-ignore: SVG module declarations are missing
import Onboard3 from "./../assets/svgs/onboard3.svg";
import Animated, {
  FadeInDown,
  FadeOutUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  interpolateColor,
  useDerivedValue,
  interpolate,
  useAnimatedProps
} from "react-native-reanimated";
import { Stack, useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

// Define Animated Components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.createAnimatedComponent(View);

const onboardingSlides = [
  {
    image: Onboard1,
    title: "Welcome to Practising Good Grief",
    description:
      "A safe space to navigate your grief journey with helpful tools and a caring community.",
    bgColor: "#FAFAFA" // Cloud White
  },
  {
    image: Onboard2,
    title: "Build Healthy Coping Habits",
    description:
      "Explore daily practices, journaling prompts, and mindfulness exercises to nurture hope.",
    bgColor: "#F0F9FF" // Mist Blue
  },
  {
    image: Onboard3,
    title: "Track Your Progress",
    description:
      "Celebrate your strengths and notice your growth with personal check-ins and milestones.",
    bgColor: "#F0FDF4" // Soft Mint
  }
];

const OnboardingScreen = () => {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  // Animations
  const progress = useSharedValue(0); // 0 to 1
  const bgProgress = useSharedValue(0); // 0, 1, 2

  useEffect(() => {
    // Animate progress based on index (1/3, 2/3, 3/3)
    progress.value = withTiming((index + 1) / onboardingSlides.length, { duration: 600 });
    bgProgress.value = withTiming(index, { duration: 600 });
  }, [index]);

  const handleNext = () => {
    if (index < onboardingSlides.length - 1) {
      setIndex(index + 1);
    } else {
      router.replace("/login");
    }
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  // Dynamic Background Component
  const DynamicBackground = () => {
    const animatedStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        bgProgress.value,
        [0, 1, 2],
        [onboardingSlides[0].bgColor, onboardingSlides[1].bgColor, onboardingSlides[2].bgColor]
      );
      return { backgroundColor };
    });

    return (
      <AnimatedView style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, animatedStyle]} />
    );
  };

  // Circular Progress Button
  const CircularButton = ({ onPress }: { onPress: () => void }) => {
    const size = 80;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const animatedProps = useAnimatedProps(() => {
      const strokeDashoffset = interpolate(
        progress.value,
        [0, 1],
        [circumference, 0] // Start full offset (empty) to 0 offset (full) if reversed?
        // standard svg strokeDashoffset: full circumference = empty. 0 = full.
      );

      // We want to fill IT progressively. 
      // 33% full -> strokeDashoffset = circumference * 0.66
      // We need to invert logic carefully or rely on 'progress' value being correct (0.33, 0.66, 1.0)

      return {
        strokeDashoffset: circumference * (1 - progress.value)
      };
    });

    return (
      <View className="items-center justify-center mt-8">
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="items-center justify-center">
          <View className="relative items-center justify-center">
            {/* SVG Ring container */}
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
              {/* Background Track */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E2E8F0"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Animated Progress Ring */}
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#111827" // Dark elegant stroke
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                animatedProps={animatedProps}
                strokeLinecap="round"
              />
            </Svg>

            {/* Inner Floating Button */}
            <View className="absolute bg-gray-900 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-gray-500/30">
              <Ionicons
                name={index === onboardingSlides.length - 1 ? "checkmark" : "arrow-forward"}
                size={24}
                color="white"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      <DynamicBackground />

      <SafeAreaView className="flex-1 justify-between">

        {/* Top Section with Skip */}
        <View className="flex-row justify-end px-8 pt-4 z-10">
          <TouchableOpacity
            onPress={handleSkip}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            className="opacity-40 active:opacity-100"
          >
            <Text className="text-gray-500 text-sm font-medium tracking-wide">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Visual Content (Image) */}
        <View className="flex-1 items-center justify-center pb-8">
          <Animated.View
            key={`img-${index}`}
            entering={FadeIn.duration(800)}
            exiting={FadeOutUp.duration(400)}
            className="items-center justify-center"
          >
            {React.createElement(onboardingSlides[index].image, { width: width * 0.85, height: width * 0.7 })}
          </Animated.View>
        </View>

        {/* Bottom Content Area */}
        <View className="w-full px-8 pb-16 justify-end items-center">

          <View className="min-h-[140px] items-center mb-4">
            {/* Title: Serif, Center Aligned for Editorial Feel */}
            <Animated.Text
              key={`title-${index}`}
              entering={FadeInDown.delay(100).duration(600)}
              exiting={FadeOutUp.duration(300)}
              className={`text-center text-3xl text-gray-900 leading-tight mb-4 ${Platform.OS === 'ios' ? 'font-[Georgia]' : 'font-serif'}`}
              style={{ letterSpacing: -0.5 }}
            >
              {onboardingSlides[index].title}
            </Animated.Text>

            {/* Description: Clean Sans, Center Aligned */}
            <Animated.Text
              key={`desc-${index}`}
              entering={FadeInDown.delay(200).duration(600)}
              exiting={FadeOutUp.duration(300)}
              className="text-center text-base text-gray-500 leading-7 font-normal px-4"
            >
              {onboardingSlides[index].description}
            </Animated.Text>
          </View>

          {/* The Golden Circle Button */}
          <CircularButton onPress={handleNext} />

        </View>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingScreen;
