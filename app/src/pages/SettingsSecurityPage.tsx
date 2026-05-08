import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "../providers/ThemeProvider";
import { useAppLock } from "../providers/AppLockProvider";
import { useAuth } from "../providers/AuthProvider";
import {
  Divider,
  Row,
  Section,
  SettingsScreen,
} from "../components/SettingsScreen";
import {
  changePassword,
  fetchSessions,
  revokeSession,
  type SessionInfo,
} from "../lib/api";

const passwordStrength = (
  password: string,
): { label: string; score: number; color: string } => {
  if (!password) return { label: "Empty", score: 0, color: "#94A3B8" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score >= 5) return { label: "Strong", score: 4, color: "#10B981" };
  if (score >= 3) return { label: "Good", score: 3, color: "#84CC16" };
  if (score >= 2) return { label: "Fair", score: 2, color: "#F59E0B" };
  return { label: "Weak", score: 1, color: "#EF4444" };
};

const formatRelative = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const now = Date.now();
  const diff = Math.max(0, now - d.getTime());
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const deviceLabel = (userAgent: string | null) => {
  if (!userAgent) return "Unknown device";
  if (/iPhone|iPad|iOS/i.test(userAgent)) return "iOS device";
  if (/Android/i.test(userAgent)) return "Android device";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "Mac";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Linux/i.test(userAgent)) return "Linux";
  return userAgent.length > 60 ? `${userAgent.slice(0, 57)}…` : userAgent;
};

export const SettingsSecurityPage = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const { colors } = useTheme();
  const { session, logout } = useAuth();
  const accessToken = session?.tokens.accessToken;
  const { enabled: lockEnabled, hardwareAvailable, enrolled, setEnabled } =
    useAppLock();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [reveal, setReveal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [sessions, setSessions] = useState<SessionInfo[] | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const strength = useMemo(() => passwordStrength(next), [next]);

  const loadSessions = async () => {
    if (!accessToken) return;
    setLoadingSessions(true);
    try {
      const data = await fetchSessions(accessToken);
      setSessions(data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Couldn't load sessions",
        text2: err instanceof Error ? err.message : "",
      });
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const submitPasswordChange = async () => {
    if (!accessToken) return;
    if (next.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password too short",
        text2: "Use at least 6 characters.",
      });
      return;
    }
    if (next !== confirm) {
      Toast.show({
        type: "error",
        text1: "Passwords don't match",
      });
      return;
    }
    setSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await changePassword(accessToken, {
        currentPassword: current,
        newPassword: next,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: "success",
        text1: "Password updated",
        text2: "Other devices have been signed out.",
      });
      setCurrent("");
      setNext("");
      setConfirm("");
      // Refresh sessions list since others were revoked server-side
      loadSessions();
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: "error",
        text1: "Couldn't change password",
        text2: err instanceof Error ? err.message : "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAppLock = async (value: boolean) => {
    Haptics.selectionAsync();
    const result = await setEnabled(value);
    if (!result.ok) {
      Toast.show({
        type: "error",
        text1: "App lock unavailable",
        text2: result.reason ?? "Try again from device settings.",
      });
    }
  };

  const handleRevoke = (s: SessionInfo) => {
    if (!accessToken) return;
    Alert.alert(
      "Revoke session?",
      s.isCurrent
        ? "This is the device you're using right now. Revoking will sign you out."
        : `Sign out from ${deviceLabel(s.userAgent)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revoke",
          style: "destructive",
          onPress: async () => {
            setRevokingId(s.id);
            try {
              await revokeSession(accessToken, s.id);
              if (s.isCurrent) {
                logout();
                return;
              }
              Toast.show({ type: "success", text1: "Session revoked" });
              loadSessions();
            } catch (err) {
              Toast.show({
                type: "error",
                text1: "Couldn't revoke",
                text2: err instanceof Error ? err.message : "",
              });
            } finally {
              setRevokingId(null);
            }
          },
        },
      ],
    );
  };

  const passwordValid =
    current.length >= 6 && next.length >= 6 && next === confirm;

  return (
    <SettingsScreen
      title="Security"
      subtitle="Password, app lock and active devices"
      onBack={onBack}
    >
      {/* Change password */}
      <Section
        label="Password"
        footnote="When you change your password, every other device is signed out."
      >
        <View style={{ padding: 16, gap: 12 }}>
          <PasswordField
            label="Current password"
            value={current}
            onChangeText={setCurrent}
            reveal={reveal}
            onToggleReveal={() => setReveal((v) => !v)}
            placeholder="Enter current password"
          />
          <PasswordField
            label="New password"
            value={next}
            onChangeText={setNext}
            reveal={reveal}
            onToggleReveal={() => setReveal((v) => !v)}
            placeholder="At least 6 characters"
          />
          {next.length > 0 && (
            <Animated.View entering={FadeInDown.duration(160)}>
              <View
                style={{
                  height: 4,
                  borderRadius: 999,
                  backgroundColor: colors.surfaceMuted,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${(strength.score / 4) * 100}%`,
                    height: "100%",
                    backgroundColor: strength.color,
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  color: strength.color,
                  fontWeight: "700",
                }}
              >
                {strength.label}
              </Text>
            </Animated.View>
          )}
          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChangeText={setConfirm}
            reveal={reveal}
            onToggleReveal={() => setReveal((v) => !v)}
            placeholder="Re-type new password"
            error={
              confirm.length > 0 && confirm !== next
                ? "Passwords don't match"
                : undefined
            }
          />
          <Pressable
            onPress={submitPasswordChange}
            disabled={!passwordValid || submitting}
            style={{
              marginTop: 4,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor:
                !passwordValid || submitting
                  ? colors.surfaceMuted
                  : colors.primary,
            }}
          >
            {submitting ? (
              <ActivityIndicator color={colors.primaryText} size="small" />
            ) : (
              <MaterialIcons
                name="lock-reset"
                size={18}
                color={
                  !passwordValid ? colors.textSubtle : colors.primaryText
                }
              />
            )}
            <Text
              style={{
                color:
                  !passwordValid || submitting
                    ? colors.textSubtle
                    : colors.primaryText,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              {submitting ? "Updating…" : "Update password"}
            </Text>
          </Pressable>
        </View>
      </Section>

      {/* App lock */}
      <Section
        label="App lock"
        footnote={
          !hardwareAvailable
            ? "This device doesn't have biometric hardware."
            : !enrolled
              ? "Enroll a fingerprint or Face ID in your device settings to use App Lock."
              : "Re-locks 30 seconds after you switch away from Bizezy."
        }
      >
        <Row
          icon="fingerprint"
          iconBg="#F1F5F9"
          iconColor={colors.text}
          label="Require biometrics on launch"
          description={
            hardwareAvailable && enrolled
              ? "Face ID, Touch ID or device passcode"
              : "Not available on this device"
          }
          rightSlot={
            <Switch
              value={lockEnabled}
              onValueChange={handleToggleAppLock}
              disabled={!hardwareAvailable || !enrolled}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFFFFF"
            />
          }
        />
      </Section>

      {/* Sessions */}
      <Section
        label="Active sessions"
        footnote="Devices currently signed in to your account."
      >
        {loadingSessions ? (
          <View style={{ padding: 24, alignItems: "center" }}>
            <ActivityIndicator color={colors.text} />
          </View>
        ) : !sessions || sessions.length === 0 ? (
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              No active sessions.
            </Text>
          </View>
        ) : (
          sessions.map((s, idx) => (
            <View key={s.id}>
              {idx > 0 ? <Divider /> : null}
              <Row
                icon={
                  /iPhone|iPad|iOS/i.test(s.userAgent ?? "")
                    ? "phone-iphone"
                    : /Android/i.test(s.userAgent ?? "")
                      ? "phone-android"
                      : "computer"
                }
                iconBg={s.isCurrent ? "#ECFDF5" : colors.surfaceMuted}
                iconColor={s.isCurrent ? "#10B981" : colors.text}
                label={`${deviceLabel(s.userAgent)}${s.isCurrent ? " · This device" : ""}`}
                description={`Signed in ${formatRelative(s.createdAt)}`}
                rightSlot={
                  revokingId === s.id ? (
                    <ActivityIndicator size="small" color={colors.danger} />
                  ) : (
                    <Pressable
                      onPress={() => handleRevoke(s)}
                      hitSlop={8}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: colors.dangerSurface,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "700",
                          color: colors.danger,
                        }}
                      >
                        Revoke
                      </Text>
                    </Pressable>
                  )
                }
              />
            </View>
          ))
        )}
      </Section>
    </SettingsScreen>
  );
};

const PasswordField = ({
  label,
  value,
  onChangeText,
  reveal,
  onToggleReveal,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  reveal: boolean;
  onToggleReveal: () => void;
  placeholder?: string;
  error?: string;
}) => {
  const { colors } = useTheme();
  return (
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
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surfaceMuted,
          borderRadius: 12,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
        }}
      >
        <MaterialIcons name="lock" size={16} color={colors.textSubtle} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={!reveal}
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
        <Pressable onPress={onToggleReveal} hitSlop={8}>
          <MaterialIcons
            name={reveal ? "visibility-off" : "visibility"}
            size={18}
            color={colors.textSubtle}
          />
        </Pressable>
      </View>
      {error ? (
        <Text
          style={{ marginTop: 4, fontSize: 11, color: colors.danger }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};
