import { Switch, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useNotificationPrefs } from "../hooks/useNotificationPrefs";
import { useTheme } from "../providers/ThemeProvider";
import {
  Divider,
  Row,
  Section,
  SettingsScreen,
} from "../components/SettingsScreen";

export const SettingsNotificationsPage = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const { colors } = useTheme();
  const { prefs, isLoading, setPref } = useNotificationPrefs();

  const toggle =
    (key: Parameters<typeof setPref>[0]) =>
    (value: boolean) => {
      Haptics.selectionAsync();
      setPref(key, value);
    };

  const enabledCount = [
    prefs.lowStockAlerts,
    prefs.saleReminders,
    prefs.dailySummary,
  ].filter(Boolean).length;

  return (
    <SettingsScreen
      title="Notifications"
      eyebrow="Preferences"
      subtitle="Choose what Bizezy alerts you about"
      onBack={onBack}
    >
      {/* Hero summary card */}
      <Animated.View
        entering={FadeInDown.duration(380).delay(40)}
        style={{
          marginTop: 8,
          borderRadius: 22,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <LinearGradient
          colors={
            enabledCount > 0
              ? ["#ECFDF5", "#FFFFFF"]
              : [colors.surfaceMuted, colors.surface]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <View
            style={{
              height: 46,
              width: 46,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                enabledCount > 0 ? "#10B981" : colors.surface,
            }}
          >
            <MaterialIcons
              name={enabledCount > 0 ? "notifications-active" : "notifications-off"}
              size={22}
              color={enabledCount > 0 ? "#FFFFFF" : colors.textSubtle}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: colors.text,
                letterSpacing: -0.3,
              }}
            >
              {enabledCount} of 3 alerts active
            </Text>
            <Text
              style={{
                marginTop: 3,
                fontSize: 12,
                color: colors.textMuted,
                lineHeight: 16,
              }}
            >
              {enabledCount > 0
                ? "Bizezy will keep you in the loop on what matters."
                : "Turn on alerts so you don't miss anything important."}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Section
        label="Alerts"
        delay={100}
        footnote="Push delivery requires a one-time permission grant from your device — we'll guide you when it's available."
      >
        <Row
          icon="warning"
          iconBg="#FEF3C7"
          iconColor="#B45309"
          label="Low-stock alerts"
          description="When inventory falls below the threshold"
          rightSlot={
            <Switch
              value={prefs.lowStockAlerts}
              onValueChange={toggle("lowStockAlerts")}
              disabled={isLoading}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <Divider />
        <Row
          icon="event"
          iconBg="#EEF2FF"
          iconColor="#6366F1"
          label="Sale reminders"
          description="Pending dues on the chosen reminder date"
          rightSlot={
            <Switch
              value={prefs.saleReminders}
              onValueChange={toggle("saleReminders")}
              disabled={isLoading}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <Divider />
        <Row
          icon="bar-chart"
          iconBg="#ECFDF5"
          iconColor="#10B981"
          label="Daily summary"
          description="Morning brief of yesterday's sales"
          rightSlot={
            <Switch
              value={prefs.dailySummary}
              onValueChange={toggle("dailySummary")}
              disabled={isLoading}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFFFFF"
            />
          }
        />
      </Section>

      <Section label="Channels" delay={160}>
        <ChannelRow
          icon="phone-android"
          label="Push notifications"
          tag="Coming soon"
        />
        <Divider />
        <ChannelRow icon="mail" label="Email" tag="Coming soon" />
        <Divider />
        <ChannelRow icon="chat" label="WhatsApp" tag="Active" tagTone="success" />
      </Section>

      <View style={{ height: 24 }} />
    </SettingsScreen>
  );
};

const ChannelRow = ({
  icon,
  label,
  tag,
  tagTone,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  tag: string;
  tagTone?: "success" | "muted";
}) => {
  const { colors } = useTheme();
  const success = tagTone === "success";
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
      }}
    >
      <View
        style={{
          height: 36,
          width: 36,
          borderRadius: 11,
          backgroundColor: colors.surfaceMuted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons name={icon} size={18} color={colors.text} />
      </View>
      <Text
        style={{ flex: 1, fontSize: 14.5, fontWeight: "600", color: colors.text }}
      >
        {label}
      </Text>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 3,
          borderRadius: 999,
          backgroundColor: success ? "#ECFDF5" : colors.surfaceMuted,
          borderWidth: 1,
          borderColor: success ? "#A7F3D0" : colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: "800",
            color: success ? "#047857" : colors.textSubtle,
            letterSpacing: 0.6,
          }}
        >
          {tag}
        </Text>
      </View>
    </View>
  );
};
