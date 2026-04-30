import { MaterialIcons } from "@expo/vector-icons";
import { useState, type ComponentProps, type ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAuth } from "../providers/AuthProvider";
import type { RootStackParamList } from "../types/navigation";

const formatMemberSince = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const AVATAR_COLORS = [
  "#6366F1",
  "#0EA5E9",
  "#F59E0B",
  "#10B981",
  "#EC4899",
  "#8B5CF6",
];

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const ProfileMenu = () => {
  const { logout, refreshUser, session } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = session?.user;
  const business = user?.business;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2)
    : "U";
  const avatarBg = getAvatarColor(user?.name ?? "U");

  // Profile completeness
  const completionFields = [
    !!user?.name,
    !!user?.email,
    !!user?.mobile,
    !!business?.name,
    !!business?.gstNumber,
    !!business?.address,
  ];
  const completedCount = completionFields.filter(Boolean).length;
  const completionPct = Math.round((completedCount / completionFields.length) * 100);

  const openMenu = async () => {
    setIsOpen(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!session) return;

    setIsRefreshing(true);
    try {
      await refreshUser();
    } catch {
      // Keep showing the last known session data if refresh fails.
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of BizEzy?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          try {
            await logout();
            setIsOpen(false);
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const navigateTo = (screen: keyof RootStackParamList) => {
    setIsOpen(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => navigation.navigate(screen as any), 150);
  };

  return (
    <>
      {/* Trigger button */}
      <Pressable
        onPress={openMenu}
        android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: false }}
        style={{
          height: 48,
          width: 48,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1.5,
          borderColor: "rgba(255,255,255,0.12)",
          backgroundColor: avatarBg + "22",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: "#FFFFFF",
          }}
        >
          {initials}
        </Text>
      </Pressable>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          onPress={() => setIsOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(2, 6, 23, 0.55)",
            paddingTop: insets.top + 12,
            paddingHorizontal: 14,
            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
        >
          <Pressable
            onPress={() => undefined}
            style={{
              width: "100%",
              maxWidth: 380,
              borderRadius: 28,
              backgroundColor: "#FFFFFF",
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.2,
              shadowRadius: 32,
              elevation: 16,
            }}
          >
            {/* ─── Header Card ─── */}
            <View
              style={{
                backgroundColor: "#0F172A",
                padding: 20,
                paddingBottom: 24,
              }}
            >
              {/* Top bar */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "700", color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase" }}>
                  Account
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  {isRefreshing && (
                    <ActivityIndicator size="small" color="rgba(255,255,255,0.5)" />
                  )}
                  <Pressable
                    onPress={() => setIsOpen(false)}
                    style={{
                      height: 28,
                      width: 28,
                      borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons name="close" size={16} color="rgba(255,255,255,0.6)" />
                  </Pressable>
                </View>
              </View>

              {/* User info */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    height: 56,
                    width: 56,
                    borderRadius: 20,
                    backgroundColor: avatarBg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "800", color: "#FFFFFF" }}>
                    {initials}
                  </Text>
                </View>

                <View style={{ marginLeft: 14, flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text
                      style={{ fontSize: 18, fontWeight: "800", color: "#FFFFFF" }}
                      numberOfLines={1}
                    >
                      {user?.name || "User"}
                    </Text>
                    {user?.verified && (
                      <MaterialIcons name="verified" size={16} color="#34D399" />
                    )}
                  </View>
                  <Text
                    style={{ marginTop: 2, fontSize: 13, color: "rgba(255,255,255,0.55)" }}
                    numberOfLines={1}
                  >
                    {business?.name || "Business not set"}
                  </Text>
                </View>
              </View>

              {/* Quick stats */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 18,
                  gap: 8,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <MaterialIcons name="mail" size={14} color="#94A3B8" />
                  <Text
                    style={{ fontSize: 12, fontWeight: "600", color: "#E2E8F0" }}
                    numberOfLines={1}
                  >
                    {user?.email || "Not set"}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <MaterialIcons name="phone" size={14} color="#94A3B8" />
                  <Text
                    style={{ fontSize: 12, fontWeight: "600", color: "#E2E8F0" }}
                    numberOfLines={1}
                  >
                    {user?.mobile || "Not set"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ─── Profile Completeness ─── */}
            {completionPct < 100 && (
              <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#64748B" }}>
                    Profile Completion
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "800",
                      color:
                        completionPct >= 80
                          ? "#10B981"
                          : completionPct >= 50
                          ? "#F59E0B"
                          : "#EF4444",
                    }}
                  >
                    {completionPct}%
                  </Text>
                </View>
                <View
                  style={{
                    height: 6,
                    backgroundColor: "#F1F5F9",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      borderRadius: 999,
                      width: `${completionPct}%`,
                      backgroundColor:
                        completionPct >= 80
                          ? "#10B981"
                          : completionPct >= 50
                          ? "#F59E0B"
                          : "#EF4444",
                    }}
                  />
                </View>
              </View>
            )}

            {/* ─── Actions ─── */}
            <View style={{ padding: 16, gap: 6 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: "#94A3B8",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 4,
                  marginLeft: 4,
                }}
              >
                Quick Actions
              </Text>

              <ActionRow
                icon="manage-accounts"
                label="My Profile"
                description="Edit personal & business details"
                iconBg="#EEF2FF"
                iconColor="#6366F1"
                onPress={() => navigateTo("UserDetail")}
              />
              <ActionRow
                icon="notifications-active"
                label="Reminders"
                description="View payment reminders"
                iconBg="#FEF3C7"
                iconColor="#F59E0B"
                onPress={() => navigateTo("Reminders")}
              />

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F1F5F9",
                  marginVertical: 6,
                  marginHorizontal: 4,
                }}
              />

              {/* Member since */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 4,
                  paddingVertical: 4,
                }}
              >
                <MaterialIcons name="schedule" size={14} color="#CBD5E1" />
                <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: "500" }}>
                  Member since {user?.createdAt ? formatMemberSince(user.createdAt) : "-"}
                </Text>
              </View>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F1F5F9",
                  marginVertical: 4,
                  marginHorizontal: 4,
                }}
              />

              {/* Sign out */}
              <Pressable
                onPress={handleLogout}
                disabled={isLoggingOut}
                android_ripple={{ color: "rgba(239,68,68,0.08)", borderless: false }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#FEE2E2",
                  backgroundColor: "#FEF2F2",
                  paddingVertical: 13,
                }}
              >
                {isLoggingOut ? (
                  <ActivityIndicator size={14} color="#EF4444" />
                ) : (
                  <MaterialIcons name="logout" size={16} color="#EF4444" />
                )}
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#EF4444" }}>
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

// ── Action Row ───────────────────────────────────────────────────

const ActionRow = ({
  icon,
  label,
  description,
  iconBg,
  iconColor,
  onPress,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  description: string;
  iconBg: string;
  iconColor: string;
  onPress?: () => void;
}) => (
  <Pressable
    onPress={onPress}
    android_ripple={{ color: "rgba(0,0,0,0.04)", borderless: false }}
    style={{
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      backgroundColor: "#FAFAFA",
      borderWidth: 1,
      borderColor: "#F1F5F9",
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 12,
    }}
  >
    <View
      style={{
        height: 36,
        width: 36,
        borderRadius: 12,
        backgroundColor: iconBg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialIcons name={icon} size={17} color={iconColor} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 14, fontWeight: "700", color: "#1E293B" }}>
        {label}
      </Text>
      <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
        {description}
      </Text>
    </View>
    <MaterialIcons name="chevron-right" size={18} color="#CBD5E1" />
  </Pressable>
);
