import { Linking, Text, View } from "react-native";
import * as Application from "expo-application";
import { Divider, Row, Section, SettingsScreen } from "../components/SettingsScreen";
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
      subtitle="App information and policies"
      onBack={onBack}
    >
      <View
        style={{
          marginTop: 12,
          paddingVertical: 28,
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View
          style={{
            height: 64,
            width: 64,
            borderRadius: 18,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: colors.primaryText,
              fontSize: 26,
              fontWeight: "800",
            }}
          >
            B
          </Text>
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: colors.text,
            letterSpacing: -0.4,
          }}
        >
          Bizezy
        </Text>
        <Text style={{ marginTop: 4, fontSize: 12, color: colors.textMuted }}>
          v{version} · build {build}
        </Text>
      </View>

      <Section label="Build info">
        <Row label="Version" value={version} />
        <Divider />
        <Row label="Build" value={build} />
        <Divider />
        <Row label="Bundle" value={bundleId} />
      </Section>

      <Section label="Legal">
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

      <Section label="Help & support">
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
    </SettingsScreen>
  );
};
