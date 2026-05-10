import { useEffect, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
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

// Phase copy that quietly tells the user what's happening.
// Total cycle ≈ ~2.4s; if loading completes earlier, we just unmount.
const PHASES = [
  "Restoring your session",
  "Loading your workspace",
  "Just a moment",
];

const SCREEN = Dimensions.get("window");

export const LoadingPage = () => {
  // ── shared animation values ─────────────────────────────────────
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.92);
  const haloPulse = useSharedValue(0);
  const sweep = useSharedValue(0);
  const blobA = useSharedValue(0);
  const blobB = useSharedValue(0);
  const phaseOpacity = useSharedValue(1);

  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    // Brand mark entrance
    logoOpacity.value = withTiming(1, {
      duration: 480,
      easing: Easing.out(Easing.quad),
    });
    logoScale.value = withSpring(1, { damping: 18, stiffness: 120, mass: 0.6 });

    // Slow halo breath
    haloPulse.value = withDelay(
      280,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1700, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );

    // Indeterminate sweep
    sweep.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.cubic) }),
      -1,
      false,
    );

    // Two background blobs drift in opposite directions
    blobA.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    blobB.value = withRepeat(
      withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [logoOpacity, logoScale, haloPulse, sweep, blobA, blobB]);

  // Cycle phase text every ~1.6s with cross-fade
  useEffect(() => {
    const interval = setInterval(() => {
      phaseOpacity.value = withTiming(0, { duration: 220 }, (finished) => {
        "worklet";
        if (finished) {
          phaseOpacity.value = withTiming(1, { duration: 320 });
        }
      });
      setTimeout(() => {
        setPhaseIndex((i) => (i + 1) % PHASES.length);
      }, 220);
    }, 1600);
    return () => clearInterval(interval);
  }, [phaseOpacity]);

  // ── derived styles ───────────────────────────────────────────────
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.22 + haloPulse.value * 0.32,
    transform: [{ scale: 1 + haloPulse.value * 0.08 }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.12 + haloPulse.value * 0.18,
    transform: [{ scale: 1 + haloPulse.value * 0.05 }],
  }));

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          -BAR_INNER_WIDTH + sweep.value * (BAR_WIDTH + BAR_INNER_WIDTH),
      },
    ],
  }));

  const blobAStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -SCREEN.width * 0.3 + blobA.value * SCREEN.width * 0.4 },
      { translateY: -SCREEN.height * 0.15 + blobA.value * 60 },
    ],
  }));

  const blobBStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: SCREEN.width * 0.05 - blobB.value * SCREEN.width * 0.35,
      },
      { translateY: SCREEN.height * 0.2 - blobB.value * 80 },
    ],
  }));

  const phaseStyle = useAnimatedStyle(() => ({
    opacity: phaseOpacity.value,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#050818" }}>
      <StatusBar style="light" />

      {/* Background mesh — two soft drifting color blobs */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: -SCREEN.height * 0.1,
            left: -SCREEN.width * 0.1,
            width: SCREEN.width * 0.95,
            height: SCREEN.width * 0.95,
            borderRadius: SCREEN.width,
            opacity: 0.55,
          },
          blobAStyle,
        ]}
      >
        <LinearGradient
          colors={["#6366F1", "#312E81", "transparent"]}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 0.8, y: 0.8 }}
          style={{ flex: 1, borderRadius: SCREEN.width }}
        />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            bottom: -SCREEN.height * 0.15,
            right: -SCREEN.width * 0.15,
            width: SCREEN.width * 0.95,
            height: SCREEN.width * 0.95,
            borderRadius: SCREEN.width,
            opacity: 0.45,
          },
          blobBStyle,
        ]}
      >
        <LinearGradient
          colors={["#0EA5E9", "#0F172A", "transparent"]}
          start={{ x: 0.3, y: 0.3 }}
          end={{ x: 0.9, y: 0.9 }}
          style={{ flex: 1, borderRadius: SCREEN.width }}
        />
      </Animated.View>

      {/* Subtle dark vignette to keep the brand legible */}
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(5,8,24,0.75)", "rgba(5,8,24,0.0)", "rgba(5,8,24,0.92)"]}
        locations={[0, 0.45, 1]}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Center stage */}
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        {/* Outer glow ring */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
            },
            ringStyle,
          ]}
        />
        {/* Inner halo */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: 999,
              backgroundColor: "rgba(99,102,241,0.55)",
            },
            haloStyle,
          ]}
        />

        {/* Brand card */}
        <Animated.View
          style={[
            {
              height: 96,
              width: 96,
              borderRadius: 28,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.14)",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 24 },
              shadowOpacity: 0.5,
              shadowRadius: 40,
            },
            logoStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.18)",
              "rgba(255,255,255,0.04)",
              "rgba(255,255,255,0.0)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 28,
            }}
          />
          <Image
            source={authAssets.logoImage}
            style={{ width: 56, height: 56, borderRadius: 14 }}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Wordmark */}
        <Animated.View entering={FadeIn.delay(200).duration(420)}>
          <Text
            style={{
              marginTop: 28,
              fontSize: 22,
              fontWeight: "800",
              color: "#FFFFFF",
              letterSpacing: -0.5,
            }}
          >
            Bizezy
          </Text>
        </Animated.View>

        {/* Phase line */}
        <Animated.View
          entering={FadeIn.delay(360).duration(420)}
          style={[{ marginTop: 6, height: 18 }, phaseStyle]}
        >
          <Text
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 0.6,
              fontWeight: "500",
            }}
          >
            {PHASES[phaseIndex]}…
          </Text>
        </Animated.View>

        {/* Indeterminate sweep bar */}
        <Animated.View
          entering={FadeIn.delay(420).duration(420)}
          style={{
            marginTop: 28,
            width: BAR_WIDTH,
            height: 3,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.07)",
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={[
              {
                width: BAR_INNER_WIDTH,
                height: "100%",
                borderRadius: 999,
              },
              sweepStyle,
            ]}
          >
            <LinearGradient
              colors={[
                "rgba(255,255,255,0)",
                "rgba(255,255,255,0.95)",
                "rgba(255,255,255,0)",
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ flex: 1, borderRadius: 999 }}
            />
          </Animated.View>
        </Animated.View>
      </View>

      {/* Foot brand */}
      <Animated.View
        entering={FadeIn.delay(560).duration(500)}
        style={{
          position: "absolute",
          bottom: 36,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              height: 4,
              width: 4,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
          />
          <Text
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.32)",
              fontWeight: "700",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Your business, simplified
          </Text>
          <View
            style={{
              height: 4,
              width: 4,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const BAR_WIDTH = 220;
const BAR_INNER_WIDTH = 80;
