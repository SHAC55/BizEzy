import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { AppLayout } from "../components/AppLayout";
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
    .slice(0, 2);

export const UserDetailPage = ({ onBack, onNavigate }: UserDetailPageProps) => {
  const { session, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    gstNumber: "",
    address: "",
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

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

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
    try {
      await updateBusinessDetails(session.tokens.accessToken, {
        gstNumber: businessForm.gstNumber,
        address: businessForm.address,
      });
      await refreshUser();
      setIsEditingBusiness(false);
      Toast.show({ type: "success", text1: "Business Details Updated" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to update business details" });
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
    try {
      await updateUserDetails(session.tokens.accessToken, {
        name: userForm.name,
        email: userForm.email,
        mobile: userForm.mobile,
      });
      await refreshUser();
      setIsEditingUser(false);
      Toast.show({ type: "success", text1: "Personal Information Updated" });
    } catch (err: any) {
      Toast.show({ type: "error", text1: err.message || "Failed to update details" });
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

  return (
    <AppLayout
      currentRoute="dashboard"
      onNavigate={onNavigate}
      title="My Profile"
      subtitle="Account & business details"
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-28 pt-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Back button */}
        <View className="mb-4">
          <Pressable
            onPress={onBack}
            android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: false }}
            className="flex-row items-center gap-2 self-start rounded-2xl border border-black/10 bg-white px-4 py-3"
          >
            <MaterialIcons name="arrow-back" size={18} color="#000" />
            <Text className="font-medium text-black">Back</Text>
          </Pressable>
        </View>

        {isRefreshing && !user ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : user ? (
          <>
            {/* Avatar hero */}
            <View className="rounded-[28px] bg-black px-5 py-6 mb-5">
              <View className="flex-row items-center gap-4">
                <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                  <Text className="text-[22px] font-bold text-white">
                    {initialsFor(user.name ?? "U")}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="text-[22px] font-bold text-white leading-tight">
                    {user.name}
                  </Text>
                  <Text className="mt-1 text-[13px] text-white/55">
                    {business?.name ?? "No business set"}
                  </Text>
                </View>

                {user.verified ? (
                  <View className="rounded-full bg-green-500/20 px-3 py-1.5">
                    <Text className="text-[11px] font-bold text-green-300">
                      Verified
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Personal info */}
            <View className="mb-5 rounded-[28px] border border-black/10 bg-white p-5">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-[16px] font-semibold text-black">Personal Information</Text>
                {!isEditingUser ? (
                  <Pressable
                    onPress={handleEditUser}
                    className="px-3 py-1.5 rounded-full bg-zinc-100 flex-row items-center gap-1.5"
                  >
                    <MaterialIcons name="edit" size={12} color="#000" />
                    <Text className="text-[11px] font-medium text-black uppercase tracking-wider">Edit</Text>
                  </Pressable>
                ) : null}
              </View>

              {isEditingUser ? (
                <View className="gap-3">
                  <View>
                    <Text className="text-[11px] uppercase text-black/40 mb-1 ml-1">Name</Text>
                    <TextInput
                      value={userForm.name}
                      onChangeText={(name) => setUserForm(prev => ({ ...prev, name }))}
                      className="bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-[14px] text-black"
                      placeholder="Your Full Name"
                    />
                  </View>
                  <View>
                    <Text className="text-[11px] uppercase text-black/40 mb-1 ml-1">Email</Text>
                    <TextInput
                      value={userForm.email}
                      onChangeText={(email) => setUserForm(prev => ({ ...prev, email }))}
                      className="bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-[14px] text-black"
                      placeholder="john@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View>
                    <Text className="text-[11px] uppercase text-black/40 mb-1 ml-1">Mobile</Text>
                    <TextInput
                      value={userForm.mobile}
                      onChangeText={(mobile) => setUserForm(prev => ({ ...prev, mobile }))}
                      className="bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-[14px] text-black"
                      placeholder="e.g. 9876543210"
                      keyboardType="phone-pad"
                    />
                  </View>
                  
                  <View className="flex-row items-center gap-3 mt-2">
                    <Pressable
                      onPress={() => setIsEditingUser(false)}
                      disabled={isSavingUser}
                      className="flex-1 py-3 rounded-2xl border border-zinc-200 items-center justify-center"
                    >
                      <Text className="text-zinc-600 font-medium">Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleSaveUser}
                      disabled={isSavingUser}
                      className={`flex-1 py-3 rounded-2xl items-center justify-center ${isSavingUser ? 'bg-zinc-300' : 'bg-black'}`}
                    >
                      {isSavingUser ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text className="text-white font-medium">Save</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View className="gap-3">
                  <InfoRow icon="person" label="Name" value={user.name ?? "-"} />
                  <InfoRow icon="mail" label="Email" value={user.email ?? "-"} />
                  <InfoRow icon="phone" label="Mobile" value={user.mobile ?? "-"} />
                  <InfoRow
                    icon="event"
                    label="Member Since"
                    value={user.createdAt ? formatDate(user.createdAt) : "-"}
                  />
                </View>
              )}
            </View>

            {/* Business info */}
            {business ? (
              <View className="mb-5 rounded-[28px] border border-black/10 bg-white p-5">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-[16px] font-semibold text-black">Business Details</Text>
                  {!isEditingBusiness ? (
                    <Pressable
                      onPress={handleEditBusiness}
                      className="px-3 py-1.5 rounded-full bg-zinc-100 flex-row items-center gap-1.5"
                    >
                      <MaterialIcons name="edit" size={12} color="#000" />
                      <Text className="text-[11px] font-medium text-black uppercase tracking-wider">Edit</Text>
                    </Pressable>
                  ) : null}
                </View>

                {isEditingBusiness ? (
                  <View className="gap-3">
                    <View>
                      <Text className="text-[11px] uppercase text-black/40 mb-1 ml-1">GST Number</Text>
                      <TextInput
                        value={businessForm.gstNumber}
                        onChangeText={(gstNumber) => setBusinessForm(prev => ({ ...prev, gstNumber }))}
                        className="bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-[14px] text-black"
                        placeholder="e.g. 22AAAAA0000A1Z5"
                        autoCapitalize="characters"
                      />
                    </View>
                    <View>
                      <Text className="text-[11px] uppercase text-black/40 mb-1 ml-1">Shop Address</Text>
                      <TextInput
                        value={businessForm.address}
                        onChangeText={(address) => setBusinessForm(prev => ({ ...prev, address }))}
                        className="bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-[14px] text-black h-24"
                        placeholder="Full shop address"
                        multiline
                        textAlignVertical="top"
                      />
                    </View>
                    
                    <View className="flex-row items-center gap-3 mt-2">
                      <Pressable
                        onPress={() => setIsEditingBusiness(false)}
                        disabled={isSaving}
                        className="flex-1 py-3 rounded-2xl border border-zinc-200 items-center justify-center"
                      >
                        <Text className="text-zinc-600 font-medium">Cancel</Text>
                      </Pressable>
                      <Pressable
                        onPress={handleSaveBusiness}
                        disabled={isSaving}
                        className={`flex-1 py-3 rounded-2xl items-center justify-center ${isSaving ? 'bg-zinc-300' : 'bg-black'}`}
                      >
                        {isSaving ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text className="text-white font-medium">Save</Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View className="gap-3">
                    <InfoRow
                      icon="storefront"
                      label="Business Name"
                      value={business.name ?? "-"}
                    />
                    <InfoRow
                      icon="receipt"
                      label="GST Number"
                      value={business.gstNumber ?? "-"}
                    />
                    <InfoRow
                      icon="location-on"
                      label="Address"
                      value={business.address ?? "-"}
                    />
                    {business.type ? (
                      <InfoRow
                        icon="business"
                        label="Business Type"
                        value={business.type}
                      />
                    ) : null}
                  </View>
                )}
              </View>
            ) : null}
          </>
        ) : (
          <Text className="py-20 text-center text-black/40">
            No profile data available
          </Text>
        )}
      </ScrollView>
    </AppLayout>
  );
};

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-5 rounded-[28px] border border-black/10 bg-white p-5">
    <Text className="mb-4 text-[16px] font-semibold text-black">{title}</Text>
    <View className="gap-3">{children}</View>
  </View>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  value: string;
}) => (
  <View className="flex-row items-start gap-3 rounded-2xl bg-zinc-50 px-4 py-4">
    <MaterialIcons name={icon} size={18} color="#555" style={{ marginTop: 1 }} />
    <View className="flex-1">
      <Text className="text-[11px] uppercase text-black/35">{label}</Text>
      <Text className="mt-1 text-[14px] text-black">{value}</Text>
    </View>
  </View>
);