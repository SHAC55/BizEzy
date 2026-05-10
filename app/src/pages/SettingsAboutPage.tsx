import { Linking, Text, View } from "react-native";
import * as Application from "expo-application";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  Divider,
  Row,
  Section,
  SettingsScreen,
} from "../components/SettingsScreen";
import { useTheme } from "../providers/ThemeProvider";

const TERMS_URL = "https://www.bizezy.in/terms";
const PRIVACY_URL = "https://www.bizezy.in/privacy";
const SUPPORT_EMAIL = "support@bizezy.in";

const open = (url: string) => Linking.openURL(url).catch(() => undefined);

export const SettingsAboutPage = ({ onBack }: { onBack: () => void }) => {
  const { colors } = useTheme();
  const version = Application.nativeApplicationVersion ?? "1.0.0";
  const build = Application.nativeBuildVersion ?? "—";
  const bundleId = Application.applicationId ?? "—";

  return (
    <SettingsScreen
      title="About"
      eyebrow="Bizezy"
      subtitle="App information and policies"
      onBack={onBack}
    >
      {/* Brand hero */}
      <Animated.View
        entering={FadeInDown.duration(420).delay(40)}
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
          style={{ paddingVertical: 32, alignItems: "center" }}
        >
          {/* Decorative accent */}
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
              width: 140,
              height: 140,
              borderRadius: 999,
              backgroundColor: "rgba(14,165,233,0.18)",
            }}
          />

          {/* App mark */}
          <View
            style={{
              height: 76,
              width: 76,
              borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.16)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.02)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: "absolute", inset: 0 }}
            />
            <Text
              style={{
                fontSize: 30,
                fontWeight: "900",
                color: "#FFFFFF",
                letterSpacing: -1,
              }}
            >
              B
            </Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: "#FFFFFF",
              letterSpacing: -0.6,
            }}
          >
            Bizezy
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              fontWeight: "600",
              letterSpacing: 0.4,
            }}
          >
            Your business, simplified
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginTop: 16,
              alignItems: "center",
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "800",
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: 1.2,
                }}
              >
                v{version}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "800",
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: 1.2,
                }}
              >
                BUILD {build}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <Section label="Build info" delay={100}>
        <Row label="Version" value={version} />
        <Divider />
        <Row label="Build" value={build} />
        <Divider />
        <Row label="Bundle" value={bundleId} />
      </Section>

      <Section label="Legal" delay={160}>
        <Row
          icon="description"
          iconBg="#F5F3FF"
          iconColor="#6D28D9"
          label="Terms of Service"
          showChevron
          onPress={() => open(TERMS_URL)}
        />
        <Divider />
        <Row
          icon="shield"
          iconBg="#ECFDF5"
          iconColor="#10B981"
          label="Privacy Policy"
          showChevron
          onPress={() => open(PRIVACY_URL)}
        />
      </Section>

      <Section label="Help & support" delay={220}>
        <Row
          icon="support-agent"
          iconBg="#EEF2FF"
          iconColor="#6366F1"
          label="Contact support"
          description={SUPPORT_EMAIL}
          showChevron
          onPress={() =>
            open(
              `mailto:${SUPPORT_EMAIL}?subject=Bizezy%20support%20-%20v${encodeURIComponent(version)}`,
            )
          }
        />
      </Section>

      {/* Crafted-by sign-off */}
      <Animated.View
        entering={FadeInDown.duration(380).delay(280)}
        style={{ alignItems: "center", marginTop: 28 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <MaterialIcons
            name="favorite"
            size={11}
            color={colors.danger}
          />
          <Text
            style={{
              fontSize: 11,
              color: colors.textSubtle,
              fontWeight: "600",
            }}
          >
            Crafted in India for small businesses
          </Text>
        </View>
        <Text
          style={{
            marginTop: 10,
            fontSize: 10,
            color: colors.textSubtle,
            letterSpacing: 2,
            fontWeight: "700",
          }}
        >
          © {new Date().getFullYear()} BIZEZY
        </Text>
      </Animated.View>
    </SettingsScreen>
  );
};
