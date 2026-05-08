import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AppState,
  Pressable,
  Text,
  View,
  type AppStateStatus,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import {
  defaultPreferences,
  readPreferences,
  updatePreferences,
} from "../lib/preferences";
import { useTheme } from "./ThemeProvider";

type AppLockContextValue = {
  enabled: boolean;
  hardwareAvailable: boolean;
  enrolled: boolean;
  setEnabled: (next: boolean) => Promise<{ ok: boolean; reason?: string }>;
  promptUnlock: () => Promise<boolean>;
};

const AppLockContext = createContext<AppLockContextValue | null>(null);

const BACKGROUND_THRESHOLD_MS = 30_000; // re-lock after 30s in background

export const AppLockProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabledState] = useState(defaultPreferences.appLockEnabled);
  const [locked, setLocked] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [hardwareAvailable, setHardwareAvailable] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const lastBackgrounded = useRef<number | null>(null);

  // Probe device capabilities once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [hw, en] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      if (!cancelled) {
        setHardwareAvailable(hw);
        setEnrolled(en);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hydrate the stored preference
  useEffect(() => {
    let cancelled = false;
    readPreferences().then((p) => {
      if (cancelled) return;
      setEnabledState(p.appLockEnabled);
      if (p.appLockEnabled) setLocked(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // App state listener: re-lock after long-enough background
  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === "background" || state === "inactive") {
        lastBackgrounded.current = Date.now();
      } else if (state === "active") {
        if (!enabled) return;
        const since = lastBackgrounded.current;
        if (since && Date.now() - since > BACKGROUND_THRESHOLD_MS) {
          setLocked(true);
        }
      }
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [enabled]);

  const promptUnlock = useCallback(async () => {
    if (authenticating) return false;
    setAuthenticating(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Bizezy",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });
      if (result.success) {
        setLocked(false);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setAuthenticating(false);
    }
  }, [authenticating]);

  const setEnabled = useCallback<AppLockContextValue["setEnabled"]>(
    async (next) => {
      if (next) {
        if (!hardwareAvailable) {
          return {
            ok: false,
            reason: "This device doesn't support biometric unlock.",
          };
        }
        if (!enrolled) {
          return {
            ok: false,
            reason: "Enroll a fingerprint or Face ID in your device settings first.",
          };
        }
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Confirm to enable App Lock",
          cancelLabel: "Cancel",
        });
        if (!result.success) {
          return { ok: false, reason: "Authentication cancelled" };
        }
      }

      setEnabledState(next);
      await updatePreferences({ appLockEnabled: next });
      return { ok: true };
    },
    [hardwareAvailable, enrolled],
  );

  // Trigger initial unlock when locked becomes true on a fresh launch
  useEffect(() => {
    if (locked && !authenticating) {
      promptUnlock();
    }
  }, [locked, authenticating, promptUnlock]);

  const value = useMemo<AppLockContextValue>(
    () => ({ enabled, hardwareAvailable, enrolled, setEnabled, promptUnlock }),
    [enabled, hardwareAvailable, enrolled, setEnabled, promptUnlock],
  );

  return (
    <AppLockContext.Provider value={value}>
      {children}
      {locked && (
        <LockOverlay
          authenticating={authenticating}
          onRetry={promptUnlock}
        />
      )}
    </AppLockContext.Provider>
  );
};

const LockOverlay = ({
  authenticating,
  onRetry,
}: {
  authenticating: boolean;
  onRetry: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 1000,
      }}
    >
      <View
        style={{
          height: 96,
          width: 96,
          borderRadius: 32,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <MaterialIcons name="lock" size={42} color={colors.text} />
      </View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "800",
          color: colors.text,
          marginBottom: 8,
        }}
      >
        App Locked
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.textMuted,
          textAlign: "center",
          maxWidth: 280,
          marginBottom: 28,
          lineHeight: 20,
        }}
      >
        Use biometrics or your device passcode to unlock Bizezy.
      </Text>
      <Pressable
        onPress={onRetry}
        disabled={authenticating}
        style={{
          paddingHorizontal: 28,
          paddingVertical: 14,
          borderRadius: 14,
          backgroundColor: colors.primary,
          opacity: authenticating ? 0.6 : 1,
        }}
      >
        <Text
          style={{ color: colors.primaryText, fontSize: 14, fontWeight: "700" }}
        >
          {authenticating ? "Authenticating…" : "Unlock"}
        </Text>
      </Pressable>
    </View>
  );
};

export const useAppLock = () => {
  const ctx = useContext(AppLockContext);
  if (!ctx) throw new Error("useAppLock must be used inside AppLockProvider");
  return ctx;
};
