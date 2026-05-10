import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFS_KEY = "bizeazy.prefs.v1";

export type ThemeMode = "light" | "dark" | "system";

export type NotificationPrefs = {
  lowStockAlerts: boolean;
  saleReminders: boolean;
  dailySummary: boolean;
};

export type AppPreferences = {
  theme: ThemeMode;
  appLockEnabled: boolean;
  notifications: NotificationPrefs;
};

export const defaultPreferences: AppPreferences = {
  theme: "system",
  appLockEnabled: false,
  notifications: {
    lowStockAlerts: true,
    saleReminders: true,
    dailySummary: false,
  },
};

const merge = (stored: Partial<AppPreferences> | null): AppPreferences => ({
  ...defaultPreferences,
  ...(stored ?? {}),
  notifications: {
    ...defaultPreferences.notifications,
    ...(stored?.notifications ?? {}),
  },
});

export const readPreferences = async (): Promise<AppPreferences> => {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPreferences;
    return merge(JSON.parse(raw) as Partial<AppPreferences>);
  } catch {
    return defaultPreferences;
  }
};

export const writePreferences = async (prefs: AppPreferences) => {
  try {
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Best effort — losing prefs is non-fatal
  }
};

export type PreferencesPatch = Omit<Partial<AppPreferences>, "notifications"> & {
  notifications?: Partial<NotificationPrefs>;
};

export const updatePreferences = async (
  patch: PreferencesPatch,
): Promise<AppPreferences> => {
  const current = await readPreferences();
  const next: AppPreferences = {
    ...current,
    ...patch,
    notifications: {
      ...current.notifications,
      ...(patch.notifications ?? {}),
    },
  };
  await writePreferences(next);
  return next;
};
