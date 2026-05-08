import { type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "../providers/ThemeProvider";

type SettingsScreenProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export const SettingsScreen = ({
  title,
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
            paddingTop: 4,
            paddingBottom: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              style={{
                height: 38,
                width: 38,
                borderRadius: 12,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="arrow-back" size={18} color={colors.text} />
            </Pressable>
          ) : null}
          <Animated.View entering={FadeIn.duration(160)} style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: colors.text,
                letterSpacing: -0.4,
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                  color: colors.textMuted,
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {footer}
    </View>
  );
};

export const Section = ({
  label,
  children,
  footnote,
}: {
  label?: string;
  children: ReactNode;
  footnote?: string;
}) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: 20 }}>
      {label ? (
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 1.2,
            color: colors.textSubtle,
            textTransform: "uppercase",
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
      {footnote ? (
        <Text
          style={{
            marginTop: 8,
            marginLeft: 4,
            fontSize: 12,
            color: colors.textSubtle,
          }}
        >
          {footnote}
        </Text>
      ) : null}
    </View>
  );
};

type RowProps = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconBg?: string;
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
  const isLink = Boolean(onPress);
  const labelColor = destructive ? colors.danger : colors.text;

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon ? (
        <View
          style={{
            height: 34,
            width: 34,
            borderRadius: 10,
            backgroundColor: iconBg ?? colors.surfaceMuted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons
            name={icon}
            size={18}
            color={iconColor ?? labelColor}
          />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 14, fontWeight: "600", color: labelColor }}
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
        <MaterialIcons name="chevron-right" size={20} color={colors.textSubtle} />
      ) : null}
    </View>
  );

  if (!isLink) {
    return content;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: "rgba(0,0,0,0.04)", borderless: false }}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.surfaceMuted : "transparent",
      })}
    >
      {content}
    </Pressable>
  );
};

export const Divider = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{ height: 1, backgroundColor: colors.divider, marginLeft: 64 }}
    />
  );
};
