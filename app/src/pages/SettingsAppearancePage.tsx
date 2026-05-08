import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Section, SettingsScreen } from "../components/SettingsScreen";
import { useTheme } from "../providers/ThemeProvider";
import type { ThemeMode } from "../lib/preferences";

type Option = {
  mode: ThemeMode;
  label: string;
  description: string;
  preview: PreviewKind;
};

type PreviewKind = "light" | "dark" | "system";

const OPTIONS: Option[] = [
  {
    mode: "light",
    label: "Light",
    description: "Bright, high-contrast surfaces",
    preview: "light",
  },
  {
    mode: "dark",
    label: "Dark",
    description: "Easier on the eyes after hours",
    preview: "dark",
  },
  {
    mode: "system",
    label: "Match device",
    description: "Follows your phone's appearance",
    preview: "system",
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
      eyebrow="Preferences"
      subtitle="Choose how Settings should look"
      onBack={onBack}
    >
      {/* Visual preview row */}
      <Animated.View
        entering={FadeInDown.duration(380).delay(40)}
        style={{
          marginTop: 8,
          flexDirection: "row",
          gap: 12,
        }}
      >
        {OPTIONS.map((opt) => {
          const isActive = opt.mode === mode;
          return (
            <Pressable
              key={opt.mode}
              onPress={() => handleSelect(opt.mode)}
              style={{ flex: 1 }}
            >
              <ThemePreview kind={opt.preview} />
              <View
                style={{
                  marginTop: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <View
                  style={{
                    height: 14,
                    width: 14,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    borderColor: isActive ? colors.accent : colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isActive ? (
                    <View
                      style={{
                        height: 6,
                        width: 6,
                        borderRadius: 999,
                        backgroundColor: colors.accent,
                      }}
                    />
                  ) : null}
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: isActive ? colors.text : colors.textMuted,
                  }}
                >
                  {opt.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </Animated.View>

      <Section
        label="Choose theme"
        footnote="Currently only the Settings screens follow this preference. Full app theming is coming soon."
        delay={100}
      >
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
                    borderRadius: 11,
                    backgroundColor: colors.surfaceMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name={
                      opt.preview === "light"
                        ? "light-mode"
                        : opt.preview === "dark"
                          ? "dark-mode"
                          : "phone-iphone"
                    }
                    size={18}
                    color={colors.text}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14.5,
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

// ── Tiny mock-screen preview tile ───────────────────────────────────
const ThemePreview = ({ kind }: { kind: PreviewKind }) => {
  if (kind === "system") {
    return (
      <View
        style={{
          aspectRatio: 0.62,
          borderRadius: 16,
          overflow: "hidden",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1, overflow: "hidden" }}>
          <PreviewCanvas variant="light" half />
        </View>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <PreviewCanvas variant="dark" half />
        </View>
      </View>
    );
  }
  return (
    <View style={{ aspectRatio: 0.62, borderRadius: 16, overflow: "hidden" }}>
      <PreviewCanvas variant={kind} />
    </View>
  );
};

const PreviewCanvas = ({
  variant,
  half,
}: {
  variant: "light" | "dark";
  half?: boolean;
}) => {
  const isDark = variant === "dark";
  const bg = isDark ? "#0F172A" : "#FFFFFF";
  const cardBg = isDark ? "#111827" : "#F8FAFC";
  const stroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const muted = isDark ? "rgba(255,255,255,0.16)" : "rgba(15,23,42,0.12)";
  const accent = isDark ? "#818CF8" : "#6366F1";
  const text = isDark ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.9)";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bg,
        padding: 8,
        borderWidth: half ? 0 : 1,
        borderColor: stroke,
        borderRadius: half ? 0 : 16,
      }}
    >
      {/* Top gradient accent */}
      <LinearGradient
        colors={
          isDark ? ["#312E81", "#0F172A"] : ["#EEF2FF", "#FFFFFF"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: "32%",
          borderRadius: 8,
          marginBottom: 6,
          padding: 6,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            height: 5,
            width: "55%",
            borderRadius: 999,
            backgroundColor: text,
            opacity: 0.85,
          }}
        />
        <View
          style={{
            height: 4,
            width: "35%",
            borderRadius: 999,
            backgroundColor: text,
            opacity: 0.4,
          }}
        />
      </LinearGradient>

      {/* Card 1 */}
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 8,
          padding: 6,
          marginBottom: 5,
          borderWidth: 1,
          borderColor: stroke,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 4,
              backgroundColor: accent,
            }}
          />
          <View
            style={{
              flex: 1,
              gap: 3,
            }}
          >
            <View
              style={{
                height: 4,
                width: "70%",
                borderRadius: 999,
                backgroundColor: muted,
              }}
            />
            <View
              style={{
                height: 3,
                width: "40%",
                borderRadius: 999,
                backgroundColor: muted,
                opacity: 0.6,
              }}
            />
          </View>
        </View>
      </View>

      {/* Card 2 */}
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 8,
          padding: 6,
          flex: 1,
          borderWidth: 1,
          borderColor: stroke,
          gap: 4,
        }}
      >
        <View
          style={{
            height: 4,
            width: "55%",
            borderRadius: 999,
            backgroundColor: muted,
          }}
        />
        <View
          style={{
            height: 3,
            width: "85%",
            borderRadius: 999,
            backgroundColor: muted,
            opacity: 0.55,
          }}
        />
        <View
          style={{
            height: 3,
            width: "70%",
            borderRadius: 999,
            backgroundColor: muted,
            opacity: 0.55,
          }}
        />
        <View style={{ flex: 1 }} />
        <View
          style={{
            height: 6,
            width: "30%",
            borderRadius: 999,
            backgroundColor: accent,
            opacity: 0.85,
          }}
        />
      </View>
    </View>
  );
};
