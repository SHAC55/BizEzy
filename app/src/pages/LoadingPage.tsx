import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { authAssets } from "../constants/auth";

export const LoadingPage = () => {
  const rotation = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.85);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Continuous rotation for the spinner ring
    rotation.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );

    // Logo entrance
    logoOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
    logoScale.value = withSpring(1, { damping: 14, stiffness: 110 });

    // Soft glow pulse behind logo
    glowOpacity.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(0.45, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, [rotation, logoOpacity, logoScale, glowOpacity]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar style="light" />

      {/* Soft purple glow behind logo */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: 130,
            backgroundColor: "#6366F1",
          },
          glowStyle,
        ]}
      />

      {/* Logo */}
      <Animated.View style={[{ alignItems: "center" }, logoStyle]}>
        <Image
          source={authAssets.logoImage}
          style={{ width: 160, height: 52 }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Rotating spinner ring */}
      <View
        style={{
          marginTop: 40,
          width: 44,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={[
            {
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 3,
              borderColor: "rgba(255,255,255,0.08)",
              borderTopColor: "#FFFFFF",
              borderRightColor: "rgba(255,255,255,0.4)",
            },
            ringStyle,
          ]}
        />
      </View>

      {/* Tagline */}
      <Animated.View
        entering={FadeIn.delay(300).duration(500)}
        style={{ marginTop: 24 }}
      >
        <Text
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: 2,
            fontWeight: "600",
            textTransform: "uppercase",
          }}
        >
          Your business, simplified
        </Text>
      </Animated.View>

      {/* Brand footer */}
      <Animated.View
        entering={FadeIn.delay(600).duration(500)}
        style={{
          position: "absolute",
          bottom: 60,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.22)",
            fontWeight: "700",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Bizezy
        </Text>
      </Animated.View>
    </View>
  );
};
