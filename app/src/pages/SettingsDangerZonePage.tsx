import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "../providers/ThemeProvider";
import { useAuth } from "../providers/AuthProvider";
import { Section, SettingsScreen } from "../components/SettingsScreen";
import { deleteAccount } from "../lib/api";

export const SettingsDangerZonePage = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const { colors } = useTheme();
  const { session, logout } = useAuth();
  const accessToken = session?.tokens.accessToken;
  const userLabel = session?.user?.email ?? session?.user?.name ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const ready = password.length >= 6 && confirm === "DELETE";

  const submit = () => {
    if (!accessToken) return;
    Alert.alert(
      "Delete account?",
      "This is permanent. Your sales history is preserved for accounting, but your personal data is removed and you'll be signed out.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete forever",
          style: "destructive",
          onPress: async () => {
            setSubmitting(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            try {
              await deleteAccount(accessToken, {
                password,
                confirm: "DELETE",
              });
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              Toast.show({
                type: "success",
                text1: "Account deleted",
                text2: "We're sorry to see you go.",
              });
              await logout();
            } catch (err) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error,
              );
              Toast.show({
                type: "error",
                text1: "Couldn't delete account",
                text2: err instanceof Error ? err.message : "",
              });
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SettingsScreen
      title="Delete account"
      eyebrow="Danger zone"
      subtitle="Permanently remove your access"
      onBack={onBack}
    >
      {/* Warning hero */}
      <Animated.View
        entering={FadeInDown.duration(420).delay(40)}
        style={{
          marginTop: 8,
          borderRadius: 24,
          overflow: "hidden",
          shadowColor: "#7F1D1D",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.18,
          shadowRadius: 24,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={["#7F1D1D", "#991B1B", "#0F172A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 22 }}
        >
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -40,
              right: -30,
              width: 160,
              height: 160,
              borderRadius: 999,
              backgroundColor: "rgba(248,113,113,0.18)",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                height: 44,
                width: 44,
                borderRadius: 14,
                backgroundColor: "rgba(255,255,255,0.12)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="warning" size={22} color="#FCA5A5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#FECACA",
                  letterSpacing: -0.3,
                }}
              >
                This action cannot be undone
              </Text>
              <Text
                style={{
                  marginTop: 3,
                  fontSize: 12,
                  color: "rgba(254,226,226,0.7)",
                  fontWeight: "600",
                }}
              >
                Bizezy will sign you out from all devices.
              </Text>
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <BulletPoint text="Your name, email and phone are anonymized" />
            <BulletPoint text="All your sessions and tokens are revoked" />
            <BulletPoint text="Sales history is preserved for tax & audit reasons" />
            <BulletPoint text="You won't be able to sign back in" />
          </View>
        </LinearGradient>
      </Animated.View>

      <Section
        label="Confirm with password"
        delay={120}
        footnote="Type DELETE in capital letters in the second box to confirm."
      >
        <View style={{ padding: 16, gap: 12 }}>
          <View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                color: colors.textSubtle,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Account password{userLabel ? ` (${userLabel})` : ""}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surfaceMuted,
                borderRadius: 12,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <MaterialIcons name="lock" size={16} color={colors.textSubtle} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Your current password"
                placeholderTextColor={colors.textSubtle}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  color: colors.text,
                  fontSize: 14,
                }}
              />
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                color: colors.textSubtle,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Type DELETE to confirm
            </Text>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="DELETE"
              placeholderTextColor={colors.textSubtle}
              autoCapitalize="characters"
              autoCorrect={false}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderWidth: 1.5,
                borderColor:
                  confirm === "DELETE"
                    ? colors.danger
                    : confirm.length > 0
                      ? colors.danger
                      : colors.border,
                borderRadius: 12,
                backgroundColor:
                  confirm === "DELETE"
                    ? colors.dangerSurface
                    : colors.surfaceMuted,
                color: colors.text,
                fontSize: 16,
                letterSpacing: 4,
                fontWeight: "800",
                textAlign: "center",
              }}
            />
          </View>
          <Pressable
            onPress={submit}
            disabled={!ready || submitting}
            style={{
              marginTop: 4,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 16,
              borderRadius: 14,
              overflow: "hidden",
              backgroundColor:
                !ready || submitting ? colors.surfaceMuted : "#0F172A",
            }}
          >
            {ready && !submitting ? (
              <LinearGradient
                colors={["#DC2626", "#7F1D1D"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              />
            ) : null}
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <MaterialIcons
                name="delete-forever"
                size={18}
                color={!ready ? colors.textSubtle : "#FFFFFF"}
              />
            )}
            <Text
              style={{
                color: !ready || submitting ? colors.textSubtle : "#FFFFFF",
                fontSize: 14,
                fontWeight: "800",
                letterSpacing: 0.3,
              }}
            >
              {submitting ? "Deleting…" : "Delete my account"}
            </Text>
          </Pressable>
        </View>
      </Section>
    </SettingsScreen>
  );
};

const BulletPoint = ({ text }: { text: string }) => (
  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
    <View
      style={{
        marginTop: 7,
        height: 4,
        width: 4,
        borderRadius: 999,
        backgroundColor: "#FCA5A5",
      }}
    />
    <Text
      style={{
        flex: 1,
        fontSize: 12.5,
        color: "rgba(254,226,226,0.85)",
        lineHeight: 18,
        fontWeight: "500",
      }}
    >
      {text}
    </Text>
  </View>
);
