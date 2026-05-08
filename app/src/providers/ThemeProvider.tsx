import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Appearance, type ColorSchemeName } from "react-native";
import {
  defaultPreferences,
  readPreferences,
  updatePreferences,
  type ThemeMode,
} from "../lib/preferences";

export type Theme = {
  mode: ThemeMode;
  scheme: "light" | "dark";
  colors: ThemePalette;
};

export type ThemePalette = {
  background: string;
  surface: string;
  surfaceMuted: string;
  card: string;
  border: string;
  divider: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primaryText: string;
  accent: string;
  danger: string;
  dangerSurface: string;
  success: string;
  warning: string;
  overlay: string;
};

const lightPalette: ThemePalette = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E5E7EB",
  divider: "#F1F5F9",
  text: "#0F172A",
  textMuted: "#475569",
  textSubtle: "#94A3B8",
  primary: "#0F172A",
  primaryText: "#FFFFFF",
  accent: "#6366F1",
  danger: "#EF4444",
  dangerSurface: "#FEF2F2",
  success: "#10B981",
  warning: "#F59E0B",
  overlay: "rgba(15,23,42,0.55)",
};

const darkPalette: ThemePalette = {
  background: "#0B1220",
  surface: "#111827",
  surfaceMuted: "#0F172A",
  card: "#111827",
  border: "#1F2937",
  divider: "#1F2937",
  text: "#F8FAFC",
  textMuted: "#CBD5E1",
  textSubtle: "#64748B",
  primary: "#F8FAFC",
  primaryText: "#0F172A",
  accent: "#818CF8",
  danger: "#F87171",
  dangerSurface: "rgba(248,113,113,0.12)",
  success: "#34D399",
  warning: "#FBBF24",
  overlay: "rgba(0,0,0,0.7)",
};

const resolveScheme = (
  mode: ThemeMode,
  systemScheme: ColorSchemeName,
): "light" | "dark" => {
  if (mode === "system") return systemScheme === "dark" ? "dark" : "light";
  return mode;
};

type ThemeContextValue = Theme & {
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(defaultPreferences.theme);
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    let cancelled = false;
    readPreferences().then((p) => {
      if (!cancelled) setModeState(p.theme);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setSystemScheme(colorScheme),
    );
    return () => sub.remove();
  }, []);

  const setMode = useCallback(async (next: ThemeMode) => {
    setModeState(next);
    await updatePreferences({ theme: next });
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const scheme = resolveScheme(mode, systemScheme);
    return {
      mode,
      scheme,
      colors: scheme === "dark" ? darkPalette : lightPalette,
      setMode,
    };
  }, [mode, systemScheme, setMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
};
