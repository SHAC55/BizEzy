import { Alert, Text, View } from "react-native";
import * as Application from "expo-application";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";
import {
  Divider,
  Row,
  Section,
  SettingsScreen,
} from "../components/SettingsScreen";

type SettingsPageProps = {
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenAppearance: () => void;
  onOpenNotifications: () => void;
  onOpenSecurity: () => void;
  onOpenAbout: () => void;
  onOpenDangerZone: () => void;
};

const themeLabel = (mode: "light" | "dark" | "system") =>
  mode === "system" ? "System" : mode === "dark" ? "Dark" : "Light";

export const SettingsPage = ({
  onBack,
  onOpenProfile,
  onOpenAppearance,
  onOpenNotifications,
  onOpenSecurity,
  onOpenAbout,
  onOpenDangerZone,
}: SettingsPageProps) => {
  const { session, logout } = useAuth();
  const { colors, mode } = useTheme();

  const user = session?.user;
  const business = user?.business;
  const initial =
    (user?.name ?? user?.email ?? "U").trim().charAt(0).toUpperCase() || "U";
  const version = Application.nativeApplicationVersion ?? "1.0.0";
  const build = Application.nativeBuildVersion ?? "";

  const confirmSignOut = () =>
    Alert.alert("Sign out?", "You'll need to sign in again to use Bizezy.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => logout() },
    ]);

  return (
    <SettingsScreen title="Settings" onBack={onBack}>
      {/* Identity card */}
      <View
        style={{
          marginTop: 12,
          padding: 18,
          borderRadius: 22,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <View
          style={{
            height: 54,
            width: 54,
            borderRadius: 18,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.primaryText,
              fontSize: 22,
              fontWeight: "800",
            }}
          >
            {initial}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "800",
              color: colors.text,
              letterSpacing: -0.3,
            }}
            numberOfLines={1}
          >
            {user?.name ?? "Your account"}
          </Text>
          {user?.email ? (
            <Text
              style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}
              numberOfLines={1}
            >
              {user.email}
            </Text>
          ) : null}
          {business?.name ? (
            <Text
              style={{
                fontSize: 11,
                color: colors.textSubtle,
                marginTop: 4,
                fontWeight: "600",
              }}
              numberOfLines={1}
            >
              {business.name}
            </Text>
          ) : null}
        </View>
      </View>

      <Section label="Account">
        <Row
          icon="manage-accounts"
          iconBg="#EEF2FF"
          iconColor="#6366F1"
          label="Profile"
          description="Personal & business details"
          showChevron
          onPress={onOpenProfile}
        />
      </Section>

      <Section label="Preferences">
        <Row
          icon="palette"
          iconBg="#FEF3C7"
          iconColor="#B45309"
          label="Appearance"
          description="Theme used in Settings"
          value={themeLabel(mode)}
          showChevron
          onPress={onOpenAppearance}
        />
        <Divider />
        <Row
          icon="notifications"
          iconBg="#ECFDF5"
          iconColor="#10B981"
          label="Notifications"
          description="Low stock, reminders, summaries"
          showChevron
          onPress={onOpenNotifications}
        />
      </Section>

      <Section label="Security">
        <Row
          icon="lock"
          iconBg="#F1F5F9"
          iconColor="#0F172A"
          label="Password & sign-in"
          description="Change password, app lock, devices"
          showChevron
          onPress={onOpenSecurity}
        />
      </Section>

      <Section label="About">
        <Row
          icon="info"
          iconBg="#F5F3FF"
          iconColor="#6D28D9"
          label="About Bizezy"
          description={`Version ${version}${build ? ` (${build})` : ""}`}
          showChevron
          onPress={onOpenAbout}
        />
      </Section>

      <Section label="Account actions" footnote="These actions affect access to your data.">
        <Row
          icon="logout"
          iconBg="#FEE2E2"
          iconColor="#DC2626"
          label="Sign out"
          onPress={confirmSignOut}
        />
        <Divider />
        <Row
          icon="delete-forever"
          iconBg={colors.dangerSurface}
          iconColor={colors.danger}
          label="Delete account"
          description="Permanently remove your account & data"
          destructive
          showChevron
          onPress={onOpenDangerZone}
        />
      </Section>
    </SettingsScreen>
  );
};
