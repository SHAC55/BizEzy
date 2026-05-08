import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
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
      subtitle="Permanently remove your access"
      onBack={onBack}
    >
      <View
        style={{
          marginTop: 12,
          padding: 18,
          borderRadius: 18,
          backgroundColor: colors.dangerSurface,
          borderWidth: 1,
          borderColor: colors.danger + "33",
          flexDirection: "row",
          gap: 14,
        }}
      >
        <View
          style={{
            height: 38,
            width: 38,
            borderRadius: 12,
            backgroundColor: colors.danger,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name="warning" size={20} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: 14, fontWeight: "700", color: colors.danger }}
          >
            This cannot be undone
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontSize: 12,
              color: colors.textMuted,
              lineHeight: 18,
            }}
          >
            Your account {userLabel ? `(${userLabel})` : ""} will be removed.
            Sales history is preserved for tax/audit reasons but your name,
            email, and phone are anonymized. You won't be able to sign back in.
          </Text>
        </View>
      </View>

      <Section
        label="Confirm with password"
        footnote="Type DELETE in capital letters in the second box to confirm."
      >
        <View style={{ padding: 16, gap: 12 }}>
          <View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: colors.textSubtle,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Account password
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
                fontWeight: "700",
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
                borderWidth: 1,
                borderColor:
                  confirm.length > 0 && confirm !== "DELETE"
                    ? colors.danger
                    : colors.border,
                borderRadius: 12,
                backgroundColor: colors.surfaceMuted,
                color: colors.text,
                fontSize: 14,
                letterSpacing: 2,
                fontWeight: "700",
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
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor:
                !ready || submitting ? colors.surfaceMuted : colors.danger,
            }}
          >
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
                fontWeight: "700",
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
