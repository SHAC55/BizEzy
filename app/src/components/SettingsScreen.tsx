import { type ComponentProps, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../providers/ThemeProvider";

type IconName = ComponentProps<typeof MaterialIcons>["name"];

type SettingsScreenProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export const SettingsScreen = ({
  title,
  eyebrow,
  subtitle,
  onBack,
  rightSlot,
  children,
  footer,
}: SettingsScreenProps) => {
  const { colors, scheme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.background }}
      >
        <View
          style={{
            paddingHorizontal: 18,
            paddingTop: 6,
            paddingBottom: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          {onBack ? <BackButton onPress={onBack} /> : null}
          <Animated.View entering={FadeIn.duration(180)} style={{ flex: 1 }}>
            {eyebrow ? (
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "800",
                  color: colors.textSubtle,
                  letterSpacing: 2.4,
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                {eyebrow}
              </Text>
            ) : null}
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: colors.text,
                letterSpacing: -0.6,
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 13,
                  color: colors.textMuted,
                  lineHeight: 18,
                }}
              >
                {subtitle}
              </Text>
            ) : null}
          </Animated.View>
          {rightSlot}
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {footer}
    </View>
  );
};

const BackButton = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 18, stiffness: 360 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 18, stiffness: 320 });
        }}
        hitSlop={12}
        style={{
          height: 38,
          width: 38,
          borderRadius: 13,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 2,
        }}
      >
        <MaterialIcons name="arrow-back-ios-new" size={15} color={colors.text} />
      </Pressable>
    </Animated.View>
  );
};

export const Section = ({
  label,
  children,
  footnote,
  delay = 0,
}: {
  label?: string;
  children: ReactNode;
  footnote?: string;
  delay?: number;
}) => {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.duration(380).delay(delay)}
      style={{ marginTop: 22 }}
    >
      {label ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginBottom: 10,
            marginLeft: 6,
          }}
        >
          <View
            style={{
              height: 4,
              width: 4,
              borderRadius: 999,
              backgroundColor: colors.textSubtle,
              opacity: 0.5,
            }}
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 1.4,
              color: colors.textSubtle,
              textTransform: "uppercase",
            }}
          >
            {label}
          </Text>
        </View>
      ) : null}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        }}
      >
        {children}
      </View>
      {footnote ? (
        <Text
          style={{
            marginTop: 10,
            marginLeft: 6,
            marginRight: 6,
            fontSize: 12,
            color: colors.textSubtle,
            lineHeight: 17,
          }}
        >
          {footnote}
        </Text>
      ) : null}
    </Animated.View>
  );
};

type RowProps = {
  icon?: IconName;
  iconColor?: string;
  iconBg?: string;
  iconGradient?: [string, string];
  label: string;
  description?: string;
  value?: ReactNode;
  rightSlot?: ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

export const Row = ({
  icon,
  iconColor,
  iconBg,
  iconGradient,
  label,
  description,
  value,
  rightSlot,
  showChevron,
  onPress,
  destructive,
  disabled,
}: RowProps) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const isLink = Boolean(onPress);
  const labelColor = destructive ? colors.danger : colors.text;

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    if (!isLink || disabled) return;
    scale.value = withTiming(0.99, { duration: 100 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 320 });
  };

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {icon ? (
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 11,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: iconBg ?? colors.surfaceMuted,
          }}
        >
          {iconGradient ? (
            <LinearGradient
              colors={iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                inset: 0,
              }}
            />
          ) : null}
          <MaterialIcons
            name={icon}
            size={18}
            color={iconColor ?? labelColor}
          />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14.5,
            fontWeight: "600",
            color: labelColor,
            letterSpacing: -0.1,
          }}
        >
          {label}
        </Text>
        {description ? (
          <Text
            style={{
              marginTop: 2,
              fontSize: 12,
              color: colors.textMuted,
              lineHeight: 16,
            }}
          >
            {description}
          </Text>
        ) : null}
      </View>
      {value ? (
        typeof value === "string" ? (
          <Text style={{ fontSize: 13, color: colors.textMuted }}>{value}</Text>
        ) : (
          value
        )
      ) : null}
      {rightSlot}
      {showChevron && isLink ? (
        <MaterialIcons
          name="chevron-right"
          size={20}
          color={colors.textSubtle}
        />
      ) : null}
    </View>
  );

  if (!isLink) {
    return content;
  }

  return (
    <Animated.View style={pressStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        android_ripple={{ color: "rgba(0,0,0,0.05)", borderless: false }}
        style={({ pressed }) => ({
          backgroundColor: pressed ? colors.surfaceMuted : "transparent",
        })}
      >
        {content}
      </Pressable>
    </Animated.View>
  );
};

export const Divider = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{ height: 1, backgroundColor: colors.divider, marginLeft: 66 }}
    />
  );
};
