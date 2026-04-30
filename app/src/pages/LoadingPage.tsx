import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, Text, View, Dimensions } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  withSpring,
} from "react-native-reanimated";

import { authAssets } from "../constants/auth";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ── Animated shimmer bar ─────────────────────────────────────────
const ShimmerBar = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      800,
      withRepeat(
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      ),
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 0.5, 1], [40, 120, 40]),
    opacity: interpolate(progress.value, [0, 0.5, 1], [0.3, 0.8, 0.3]),
  }));

  return (
    <View
      style={{
        height: 3,
        width: 160,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.06)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height: 3,
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
};

// ── Floating particle ring ───────────────────────────────────────
const FloatingRing = ({
  size,
  delay,
  duration,
}: {
  size: number;
  delay: number;
  duration: number;
}) => {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.out(Easing.quad) }),
          withTiming(1.3, { duration, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.12, { duration, easing: Easing.out(Easing.quad) }),
          withTiming(0.03, { duration, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
  }, [scale, opacity, delay, duration]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: "#FFFFFF",
        },
        style,
      ]}
    />
  );
};

// ── Pulse dot ────────────────────────────────────────────────────
const PulseDot = ({ delay }: { delay: number }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(0.5, { duration: 500, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(0.2, { duration: 500, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [scale, opacity, delay]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
          marginHorizontal: 4,
        },
        style,
      ]}
    />
  );
};

// ── Main LoadingPage ─────────────────────────────────────────────
export const LoadingPage = () => {
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    });
    logoScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    });

    // Glow pulse
    glowOpacity.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, [logoOpacity, logoScale, glowOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" />

      {/* Background ambient rings */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FloatingRing size={280} delay={0} duration={3000} />
        <FloatingRing size={400} delay={400} duration={3500} />
        <FloatingRing size={520} delay={800} duration={4000} />
      </View>

      {/* Glow effect behind logo */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: "35%",
            alignSelf: "center",
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "#6366F1",
          },
          glowStyle,
        ]}
      />

      {/* Main content */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 40,
        }}
      >
        {/* Logo */}
        <Animated.View style={[{ alignItems: "center" }, logoStyle]}>
          <Image
            source={authAssets.logoImage}
            style={{ width: 180, height: 58 }}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600).easing(Easing.out(Easing.quad))}
          style={{ marginTop: 16, alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: 2,
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            Your business, simplified.
          </Text>
        </Animated.View>

        {/* Shimmer loading bar */}
        <Animated.View
          entering={FadeIn.delay(700).duration(500)}
          style={{ marginTop: 40 }}
        >
          <ShimmerBar />
        </Animated.View>
      </View>

      {/* Bottom section */}
      <Animated.View
        entering={FadeIn.delay(900).duration(600)}
        style={{
          alignItems: "center",
          paddingBottom: 60,
          gap: 16,
        }}
      >
        {/* Pulse dots */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <PulseDot key={i} delay={i * 200} />
          ))}
        </View>

        {/* Brand footer */}
        <Text
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.2)",
            fontWeight: "600",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          BizEzy
        </Text>
      </Animated.View>
    </View>
  );
};
