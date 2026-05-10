import { useCallback, useEffect, useState } from "react";
import {
  defaultPreferences,
  readPreferences,
  updatePreferences,
  type NotificationPrefs,
} from "../lib/preferences";

export const useNotificationPrefs = () => {
  const [prefs, setPrefs] = useState<NotificationPrefs>(
    defaultPreferences.notifications,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    readPreferences().then((p) => {
      if (cancelled) return;
      setPrefs(p.notifications);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPref = useCallback(
    async <K extends keyof NotificationPrefs>(
      key: K,
      value: NotificationPrefs[K],
    ) => {
      setPrefs((prev) => ({ ...prev, [key]: value }));
      await updatePreferences({ notifications: { [key]: value } });
    },
    [],
  );

  return { prefs, isLoading, setPref };
};
