import { Switch, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useNotificationPrefs } from "../hooks/useNotificationPrefs";
import { useTheme } from "../providers/ThemeProvider";
import { Divider, Row, Section, SettingsScreen } from "../components/SettingsScreen";

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

  return (
    <SettingsScreen
      title="Notifications"
      subtitle="Choose what Bizezy alerts you about"
      onBack={onBack}
    >
      <Section
        label="Alerts"
        footnote="Push notifications require an additional setup step in your device. We'll guide you through it once it's available."
      >
        <Row
          icon="warning"
          iconBg="#FEF3C7"
          iconColor="#B45309"
          label="Low-stock alerts"
          description="Notify when inventory falls below threshold"
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
          description="Remind me about pending dues on the chosen date"
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
          description="A morning brief of yesterday's sales"
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

      <Section label="Channels">
        <Row
          icon="mail"
          iconBg="#F1F5F9"
          iconColor="#0F172A"
          label="Email"
          description="Off — coming soon"
          disabled
        />
        <Divider />
        <Row
          icon="phone-android"
          iconBg="#F1F5F9"
          iconColor="#0F172A"
          label="Push notifications"
          description="Off — coming soon"
          disabled
        />
      </Section>

      <View style={{ height: 24 }} />
    </SettingsScreen>
  );
};
