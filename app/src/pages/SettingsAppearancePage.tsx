import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Section, SettingsScreen } from "../components/SettingsScreen";
import { useTheme } from "../providers/ThemeProvider";
import type { ThemeMode } from "../lib/preferences";

type Option = {
  mode: ThemeMode;
  label: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const OPTIONS: Option[] = [
  {
    mode: "light",
    label: "Light",
    description: "Bright, high-contrast surfaces",
    icon: "light-mode",
  },
  {
    mode: "dark",
    label: "Dark",
    description: "Easier on the eyes after hours",
    icon: "dark-mode",
  },
  {
    mode: "system",
    label: "Match device",
    description: "Follows your phone's appearance",
    icon: "phone-iphone",
  },
];

export const SettingsAppearancePage = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const { mode, setMode, colors } = useTheme();

  const handleSelect = async (next: ThemeMode) => {
    if (next === mode) return;
    Haptics.selectionAsync();
    await setMode(next);
  };

  return (
    <SettingsScreen
      title="Appearance"
      subtitle="Choose how Settings should look"
      onBack={onBack}
    >
      <Section label="Theme" footnote="Currently only the Settings screens follow this preference. Full app theming is coming soon.">
        {OPTIONS.map((opt, idx) => {
          const isActive = opt.mode === mode;
          return (
            <Pressable
              key={opt.mode}
              onPress={() => handleSelect(opt.mode)}
              android_ripple={{
                color: "rgba(0,0,0,0.04)",
                borderless: false,
              }}
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.surfaceMuted : "transparent",
              })}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  gap: 14,
                  borderTopWidth: idx === 0 ? 0 : 1,
                  borderTopColor: colors.divider,
                }}
              >
                <View
                  style={{
                    height: 36,
                    width: 36,
                    borderRadius: 12,
                    backgroundColor: colors.surfaceMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name={opt.icon}
                    size={18}
                    color={colors.text}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: colors.text,
                    }}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      marginTop: 2,
                    }}
                  >
                    {opt.description}
                  </Text>
                </View>
                <View
                  style={{
                    height: 22,
                    width: 22,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: isActive ? colors.accent : colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isActive ? (
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 999,
                        backgroundColor: colors.accent,
                      }}
                    />
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </Section>
    </SettingsScreen>
  );
};
