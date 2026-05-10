import { Alert, Text, View } from "react-native";
import * as Application from "expo-application";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
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

  const confirmSignOut = () =>
    Alert.alert("Sign out?", "You'll need to sign in again to use Bizezy.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => logout() },
    ]);

  return (
    <SettingsScreen title="Settings" onBack={onBack}>
      {/* ── Identity hero ─────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(420).delay(40)}>
        <View
          style={{
            marginTop: 8,
            borderRadius: 26,
            overflow: "hidden",
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={["#0F172A", "#1E1B4B", "#312E81"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 22 }}
          >
            {/* Decorative orb */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: -40,
                right: -30,
                width: 180,
                height: 180,
                borderRadius: 999,
                backgroundColor: "rgba(99,102,241,0.32)",
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: -50,
                left: -40,
                width: 160,
                height: 160,
                borderRadius: 999,
                backgroundColor: "rgba(14,165,233,0.18)",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
              }}
            >
              {/* Avatar */}
              <View
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: "rgba(255,255,255,0.18)",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.04)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ position: "absolute", inset: 0 }}
                />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 24,
                    fontWeight: "800",
                    letterSpacing: -0.5,
                  }}
                >
                  {initial}
                </Text>
                {user?.verified ? (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -3,
                      right: -3,
                      backgroundColor: "#0F172A",
                      borderRadius: 999,
                      padding: 1,
                    }}
                  >
                    <MaterialIcons name="verified" size={18} color="#34D399" />
                  </View>
                ) : null}
              </View>

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "800",
                      color: "#FFFFFF",
                      letterSpacing: -0.4,
                    }}
                    numberOfLines={1}
                  >
                    {user?.name ?? "Your account"}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 999,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.12)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "800",
                        color: "rgba(255,255,255,0.85)",
                        letterSpacing: 1.4,
                      }}
                    >
                      OWNER
                    </Text>
                  </View>
                </View>
                {user?.email ? (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                      marginTop: 4,
                    }}
                    numberOfLines={1}
                  >
                    {user.email}
                  </Text>
                ) : null}
                {business?.name ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 6,
                    }}
                  >
                    <MaterialIcons
                      name="storefront"
                      size={12}
                      color="rgba(255,255,255,0.55)"
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.6)",
                        fontWeight: "600",
                      }}
                      numberOfLines={1}
                    >
                      {business.name}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      <Section label="Account" delay={80}>
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

      <Section label="Preferences" delay={140}>
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

      <Section label="Security" delay={200}>
        <Row
          icon="shield"
          iconBg="#F1F5F9"
          iconColor="#0F172A"
          label="Password & sign-in"
          description="Change password, app lock, devices"
          showChevron
          onPress={onOpenSecurity}
        />
      </Section>

      <Section label="About" delay={260}>
        <Row
          icon="info"
          iconBg="#F5F3FF"
          iconColor="#6D28D9"
          label="About Bizezy"
          description={`Version ${version}`}
          showChevron
          onPress={onOpenAbout}
        />
      </Section>

      <Section
        label="Account actions"
        footnote="These actions affect access to your data."
        delay={320}
      >
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
          description="Permanently remove your account"
          destructive
          showChevron
          onPress={onOpenDangerZone}
        />
      </Section>

      {/* Signature footer */}
      <Animated.View
        entering={FadeInDown.duration(380).delay(420)}
        style={{ alignItems: "center", marginTop: 30, marginBottom: 8 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              height: 1,
              width: 32,
              backgroundColor: colors.border,
            }}
          />
          <Text
            style={{
              fontSize: 10,
              fontWeight: "800",
              color: colors.textSubtle,
              letterSpacing: 3.5,
              textTransform: "uppercase",
            }}
          >
            Bizezy
          </Text>
          <View
            style={{
              height: 1,
              width: 32,
              backgroundColor: colors.border,
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 6,
            fontSize: 11,
            color: colors.textSubtle,
          }}
        >
          v{version} · Made with care
        </Text>
      </Animated.View>
    </SettingsScreen>
  );
};
