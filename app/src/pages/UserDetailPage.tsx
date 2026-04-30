import { useState, type ComponentProps } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { updateBusinessDetails, updateUserDetails } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";
import type { AppRoute } from "../types/navigation";

type UserDetailPageProps = {
  onBack: () => void;
  onNavigate: (route: AppRoute) => void;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const initialsFor = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "U";

const AVATAR_COLORS = [
  { gradient: ["#6366F1", "#8B5CF6"] },
  { gradient: ["#0EA5E9", "#06B6D4"] },
  { gradient: ["#F59E0B", "#F97316"] },
  { gradient: ["#10B981", "#059669"] },
  { gradient: ["#EC4899", "#F43F5E"] },
];

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const UserDetailPage = ({ onBack, onNavigate }: UserDetailPageProps) => {
  const { session, refreshUser, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Business editing state
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    gstNumber: "",
    address: "",
  });

  // User editing state
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const user = session?.user;
  const business = user?.business as
    | {
        name?: string;
        gstNumber?: string;
        address?: string;
        type?: string;
      }
    | undefined;

  const avatarColor = getAvatarColor(user?.name ?? "U");

  const handleEditBusiness = () => {
    if (business) {
      setBusinessForm({
        gstNumber: business.gstNumber ?? "",
        address: business.address ?? "",
      });
    }
    setIsEditingBusiness(true);
  };

  const handleSaveBusiness = async () => {
    if (!session?.tokens.accessToken) return;
    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await updateBusinessDetails(session.tokens.accessToken, {
        gstNumber: businessForm.gstNumber,
        address: businessForm.address,
      });
      await refreshUser();
      setIsEditingBusiness(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: "success", text1: "Business Updated", text2: "Your business details have been saved." });
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: "error", text1: "Update Failed", text2: err?.message || "Could not save business details." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditUser = () => {
    if (user) {
      setUserForm({
        name: user.name ?? "",
        email: user.email ?? "",
        mobile: user.mobile ?? "",
      });
    }
    setIsEditingUser(true);
  };

  const handleSaveUser = async () => {
    if (!session?.tokens.accessToken) return;
    setIsSavingUser(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await updateUserDetails(session.tokens.accessToken, {
        name: userForm.name,
        email: userForm.email,
        mobile: userForm.mobile,
      });
      await refreshUser();
      setIsEditingUser(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: "success", text1: "Profile Updated", text2: "Your personal details have been saved." });
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: "error", text1: "Update Failed", text2: err?.message || "Could not save personal details." });
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await logout();
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  // Profile completeness
  const completionFields = [
    { label: "Name", done: !!user?.name },
    { label: "Email", done: !!user?.email },
    { label: "Mobile", done: !!user?.mobile },
    { label: "Business", done: !!business?.name },
    { label: "GST", done: !!business?.gstNumber },
    { label: "Address", done: !!business?.address },
  ];
  const completedCount = completionFields.filter((f) => f.done).length;
  const completionPct = Math.round((completedCount / completionFields.length) * 100);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* ─── Hero Section ─── */}
        <View className="bg-slate-900 px-5 pb-10 pt-14">
          {/* Top bar */}
          <View className="flex-row items-center justify-between mb-8">
            <Pressable
              onPress={onBack}
              android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: false }}
              className="h-10 w-10 rounded-xl bg-white/10 items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </Pressable>
            <Text className="text-[17px] font-bold text-white">My Profile</Text>
            <View className="w-10" />
          </View>

          {/* Avatar + info */}
          <View className="items-center">
            <View
              className="h-24 w-24 rounded-3xl items-center justify-center mb-4"
              style={{ backgroundColor: avatarColor.gradient[0] }}
            >
              <Text className="text-[32px] font-bold text-white">
                {initialsFor(user?.name ?? "U")}
              </Text>
            </View>

            <Text className="text-[24px] font-bold text-white tracking-tight mb-1">
              {user?.name ?? "User"}
            </Text>

            <Text className="text-[14px] text-slate-400 mb-3">
              {business?.name ?? "No business set up"}
            </Text>

            {/* Status badges */}
            <View className="flex-row items-center gap-2">
              {user?.verified && (
                <View className="flex-row items-center gap-1.5 bg-emerald-500/20 rounded-full px-3 py-1.5">
                  <MaterialIcons name="verified" size={14} color="#34D399" />
                  <Text className="text-[11px] font-bold text-emerald-400">Verified</Text>
                </View>
              )}
              <View className="flex-row items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
                <MaterialIcons name="event" size={13} color="#94A3B8" />
                <Text className="text-[11px] font-semibold text-slate-400">
                  Since {user?.createdAt ? formatDate(user.createdAt) : "-"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ─── Profile Completeness ─── */}
        {completionPct < 100 && (
          <View className="mx-4 -mt-5 bg-white rounded-2xl border border-zinc-100 p-4 mb-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 rounded-lg bg-amber-50 items-center justify-center">
                  <MaterialIcons name="trending-up" size={16} color="#F59E0B" />
                </View>
                <Text className="text-[14px] font-bold text-zinc-900">
                  Complete Your Profile
                </Text>
              </View>
              <Text className="text-[13px] font-bold text-amber-600">{completionPct}%</Text>
            </View>

            {/* Progress bar */}
            <View className="h-2 bg-zinc-100 rounded-full overflow-hidden mb-3">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${completionPct}%`,
                  backgroundColor: completionPct >= 80 ? "#10B981" : completionPct >= 50 ? "#F59E0B" : "#EF4444",
                }}
              />
            </View>

            {/* Missing fields */}
            <View className="flex-row flex-wrap gap-1.5">
              {completionFields
                .filter((f) => !f.done)
                .map((f) => (
                  <View key={f.label} className="flex-row items-center gap-1 bg-red-50 rounded-full px-2.5 py-1 border border-red-100">
                    <MaterialIcons name="close" size={10} color="#EF4444" />
                    <Text className="text-[10px] font-semibold text-red-600">
                      {f.label}
                    </Text>
                  </View>
                ))}
              {completionFields
                .filter((f) => f.done)
                .map((f) => (
                  <View key={f.label} className="flex-row items-center gap-1 bg-emerald-50 rounded-full px-2.5 py-1 border border-emerald-100">
                    <MaterialIcons name="check" size={10} color="#10B981" />
                    <Text className="text-[10px] font-semibold text-emerald-600">
                      {f.label}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* ─── Content ─── */}
        <View className={`px-4 ${completionPct >= 100 ? "-mt-5" : "mt-1"}`}>
          {/* Personal Information */}
          <SectionCard
            title="Personal Information"
            icon="person"
            iconBg="#EEF2FF"
            iconColor="#4F46E5"
            isEditing={isEditingUser}
            onEdit={handleEditUser}
          >
            {isEditingUser ? (
              <View className="gap-3">
                <EditField
                  label="Full Name"
                  icon="person"
                  value={userForm.name}
                  placeholder="Your full name"
                  onChangeText={(name) => setUserForm((prev) => ({ ...prev, name }))}
                />
                <EditField
                  label="Email Address"
                  icon="mail"
                  value={userForm.email}
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  onChangeText={(email) => setUserForm((prev) => ({ ...prev, email }))}
                />
                <EditField
                  label="Mobile Number"
                  icon="phone"
                  value={userForm.mobile}
                  placeholder="9876543210"
                  keyboardType="phone-pad"
                  onChangeText={(mobile) => setUserForm((prev) => ({ ...prev, mobile }))}
                />
                <ActionButtons
                  onCancel={() => setIsEditingUser(false)}
                  onSave={handleSaveUser}
                  isSaving={isSavingUser}
                />
              </View>
            ) : (
              <View className="gap-2.5">
                <DisplayRow icon="person" label="Name" value={user?.name ?? "-"} />
                <DisplayRow icon="mail" label="Email" value={user?.email ?? "-"} />
                <DisplayRow icon="phone" label="Mobile" value={user?.mobile ?? "-"} />
                <DisplayRow
                  icon="event"
                  label="Member Since"
                  value={user?.createdAt ? formatDate(user.createdAt) : "-"}
                />
              </View>
            )}
          </SectionCard>

          {/* Business Details */}
          {business && (
            <SectionCard
              title="Business Details"
              icon="storefront"
              iconBg="#ECFDF5"
              iconColor="#059669"
              isEditing={isEditingBusiness}
              onEdit={handleEditBusiness}
            >
              {isEditingBusiness ? (
                <View className="gap-3">
                  <EditField
                    label="GST Number"
                    icon="receipt"
                    value={businessForm.gstNumber}
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    autoCapitalize="characters"
                    onChangeText={(gstNumber) =>
                      setBusinessForm((prev) => ({ ...prev, gstNumber }))
                    }
                  />
                  <EditField
                    label="Shop Address"
                    icon="location-on"
                    value={businessForm.address}
                    placeholder="Full shop address"
                    multiline
                    onChangeText={(address) =>
                      setBusinessForm((prev) => ({ ...prev, address }))
                    }
                  />
                  <ActionButtons
                    onCancel={() => setIsEditingBusiness(false)}
                    onSave={handleSaveBusiness}
                    isSaving={isSaving}
                  />
                </View>
              ) : (
                <View className="gap-2.5">
                  <DisplayRow
                    icon="storefront"
                    label="Business Name"
                    value={business.name ?? "-"}
                  />
                  <DisplayRow
                    icon="receipt"
                    label="GST Number"
                    value={business.gstNumber ?? "-"}
                    highlight={!business.gstNumber}
                  />
                  <DisplayRow
                    icon="location-on"
                    label="Address"
                    value={business.address ?? "-"}
                    highlight={!business.address}
                  />
                  {business.type && (
                    <DisplayRow
                      icon="business"
                      label="Business Type"
                      value={business.type}
                    />
                  )}
                </View>
              )}
            </SectionCard>
          )}

          {/* ─── Quick Actions ─── */}
          <View className="mb-4">
            <Text className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase mb-3 ml-1">
              Quick Actions
            </Text>
            <View className="bg-white rounded-2xl border border-zinc-100 overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 1,
              }}
            >
              <QuickActionRow
                icon="notifications-active"
                label="Reminders"
                description="View payment reminders"
                iconBg="#FEF3C7"
                iconColor="#F59E0B"
                onPress={() => {
                  onNavigate("reminders" as AppRoute);
                  // Use navigation directly if needed
                }}
                showBorder
              />
              <QuickActionRow
                icon="security"
                label="Account Security"
                description="Manage your password"
                iconBg="#EEF2FF"
                iconColor="#6366F1"
                showBorder
              />
              <QuickActionRow
                icon="help-outline"
                label="Help & Support"
                description="Get assistance with your account"
                iconBg="#F0FDF4"
                iconColor="#10B981"
                showBorder
              />
              <QuickActionRow
                icon="info-outline"
                label="About BizEzy"
                description="Version 1.0.0"
                iconBg="#F8FAFC"
                iconColor="#64748B"
              />
            </View>
          </View>

          {/* ─── Sign Out ─── */}
          <Pressable
            onPress={handleLogout}
            disabled={isLoggingOut}
            android_ripple={{ color: "rgba(239,68,68,0.1)", borderless: false }}
            className="flex-row items-center justify-center gap-2 bg-white rounded-2xl border border-red-100 py-4 mb-6"
            style={{
              shadowColor: "#EF4444",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 1,
            }}
          >
            {isLoggingOut ? (
              <ActivityIndicator size={16} color="#EF4444" />
            ) : (
              <MaterialIcons name="logout" size={18} color="#EF4444" />
            )}
            <Text className="text-[14px] font-bold text-red-500">
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

// ── Section Card ─────────────────────────────────────────────────

const SectionCard = ({
  title,
  icon,
  iconBg,
  iconColor,
  isEditing,
  onEdit,
  children,
}: {
  title: string;
  icon: ComponentProps<typeof MaterialIcons>["name"];
  iconBg: string;
  iconColor: string;
  isEditing: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) => (
  <View
    className="bg-white rounded-2xl border border-zinc-100 p-5 mb-4"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
    }}
  >
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-3">
        <View
          className="h-9 w-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <MaterialIcons name={icon} size={18} color={iconColor} />
        </View>
        <Text className="text-[16px] font-bold text-zinc-900">{title}</Text>
      </View>
      {!isEditing && (
        <Pressable
          onPress={onEdit}
          android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
          className="flex-row items-center gap-1.5 bg-zinc-50 rounded-xl px-3 py-2 border border-zinc-200"
        >
          <MaterialIcons name="edit" size={13} color="#52525b" />
          <Text className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
            Edit
          </Text>
        </Pressable>
      )}
    </View>
    {children}
  </View>
);

// ── Display Row ──────────────────────────────────────────────────

const DisplayRow = ({
  icon,
  label,
  value,
  highlight,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <View
    className={`flex-row items-center gap-3 rounded-xl px-4 py-3.5 ${
      highlight ? "bg-amber-50 border border-amber-100" : "bg-zinc-50"
    }`}
  >
    <MaterialIcons
      name={icon}
      size={17}
      color={highlight ? "#F59E0B" : "#94A3B8"}
    />
    <View className="flex-1">
      <Text className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
        {label}
      </Text>
      <Text
        className={`text-[14px] font-medium mt-0.5 ${
          highlight
            ? "text-amber-600 italic"
            : value === "-"
            ? "text-zinc-300"
            : "text-zinc-800"
        }`}
      >
        {highlight ? "Not set — tap Edit to add" : value}
      </Text>
    </View>
    {highlight && (
      <View className="bg-amber-100 rounded-full px-2 py-0.5">
        <Text className="text-[9px] font-bold text-amber-700">MISSING</Text>
      </View>
    )}
  </View>
);

// ── Edit Field ───────────────────────────────────────────────────

const EditField = ({
  label,
  icon,
  value,
  placeholder,
  keyboardType = "default",
  autoCapitalize,
  multiline,
  onChangeText,
}: {
  label: string;
  icon: ComponentProps<typeof MaterialIcons>["name"];
  value: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  onChangeText: (value: string) => void;
}) => (
  <View>
    <Text className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 ml-1">
      {label}
    </Text>
    <View
      className={`flex-row items-center bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 ${
        multiline ? "items-start" : ""
      }`}
    >
      <MaterialIcons
        name={icon}
        size={16}
        color="#94A3B8"
        style={{ marginTop: multiline ? 14 : 0 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#CBD5E1"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        className={`flex-1 text-[14px] text-zinc-800 ml-2.5 ${
          multiline ? "py-3 min-h-[80px]" : "py-3.5"
        }`}
      />
    </View>
  </View>
);

// ── Action Buttons ───────────────────────────────────────────────

const ActionButtons = ({
  onCancel,
  onSave,
  isSaving,
}: {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
}) => (
  <View className="flex-row items-center gap-3 mt-1">
    <Pressable
      onPress={onCancel}
      disabled={isSaving}
      android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
      className="flex-1 py-3.5 rounded-xl border border-zinc-200 items-center justify-center bg-white"
    >
      <Text className="text-[13px] font-semibold text-zinc-600">Cancel</Text>
    </Pressable>
    <Pressable
      onPress={onSave}
      disabled={isSaving}
      android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: false }}
      className={`flex-1 py-3.5 rounded-xl items-center justify-center flex-row gap-2 ${
        isSaving ? "bg-zinc-300" : "bg-slate-900"
      }`}
    >
      {isSaving ? (
        <ActivityIndicator size={14} color="#fff" />
      ) : (
        <MaterialIcons name="check" size={16} color="#fff" />
      )}
      <Text className="text-[13px] font-semibold text-white">
        {isSaving ? "Saving..." : "Save Changes"}
      </Text>
    </Pressable>
  </View>
);

// ── Quick Action Row ─────────────────────────────────────────────

const QuickActionRow = ({
  icon,
  label,
  description,
  iconBg,
  iconColor,
  onPress,
  showBorder,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  description: string;
  iconBg: string;
  iconColor: string;
  onPress?: () => void;
  showBorder?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    android_ripple={{ color: "rgba(0,0,0,0.04)", borderless: false }}
    className={`flex-row items-center gap-3.5 px-4 py-3.5 active:bg-zinc-50 ${
      showBorder ? "border-b border-zinc-50" : ""
    }`}
  >
    <View
      className="h-10 w-10 rounded-xl items-center justify-center"
      style={{ backgroundColor: iconBg }}
    >
      <MaterialIcons name={icon} size={18} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="text-[14px] font-semibold text-zinc-800">{label}</Text>
      <Text className="text-[11px] text-zinc-400 mt-0.5">{description}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={18} color="#D4D4D8" />
  </Pressable>
);