import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { deleteSaleReminder } from "../lib/api";
import { queryKeys } from "../lib/query";
import { useAuth } from "../providers/AuthProvider";
import { useSalesData } from "../hooks/useSalesData";
import type { DashboardSale } from "../types/dashboard";

type RemindersPageProps = {
  onBack: () => void;
  onOpenSale: (saleId: string) => void;
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

const getReminderStatus = (reminderDate: string) => {
  const now = new Date();
  const reminder = new Date(reminderDate);
  const diffMs = reminder.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: "Overdue",
      sublabel: `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""} ago`,
      dotColor: "#EF4444",
      badgeBg: "#FEE2E2",
      badgeText: "#DC2626",
      iconBg: "#FEF2F2",
      iconColor: "#EF4444",
    };
  }
  if (diffDays === 0) {
    return {
      label: "Today",
      sublabel: `Due today`,
      dotColor: "#F59E0B",
      badgeBg: "#FEF3C7",
      badgeText: "#B45309",
      iconBg: "#FFFBEB",
      iconColor: "#F59E0B",
    };
  }
  if (diffDays <= 3) {
    return {
      label: "Soon",
      sublabel: `In ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
      dotColor: "#F97316",
      badgeBg: "#FFF7ED",
      badgeText: "#C2410C",
      iconBg: "#FFF7ED",
      iconColor: "#F97316",
    };
  }
  return {
    label: "Upcoming",
    sublabel: `In ${diffDays} days`,
    dotColor: "#3B82F6",
    badgeBg: "#EFF6FF",
    badgeText: "#1D4ED8",
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
  };
};

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  partial: {
    label: "Partial",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
  },
} as const;

export const RemindersPage = ({ onBack, onOpenSale }: RemindersPageProps) => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { sales, pagination, isLoading, isRefreshing, error, refetch, summary } =
    useSalesData({ page: 1, limit: 100, hasReminder: true });

  // Sort reminders: overdue first, then today, then upcoming
  const sortedSales = [...sales].sort((a, b) => {
    if (!a.reminderDate || !b.reminderDate) return 0;
    return new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime();
  });

  const overdueCount = sortedSales.filter(
    (s) => s.reminderDate && new Date(s.reminderDate) < new Date()
  ).length;

  const todayCount = sortedSales.filter((s) => {
    if (!s.reminderDate) return false;
    const d = new Date(s.reminderDate);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const upcomingCount = sortedSales.length - overdueCount - todayCount;

  const totalDueAmount = sortedSales.reduce((sum, s) => sum + (s.dueAmount ?? 0), 0);

  const handleDeleteReminder = async (saleId: string, customerName: string) => {
    const token = session?.tokens.accessToken;
    if (!token) return;

    Alert.alert(
      "Remove Reminder",
      `Remove payment reminder for ${customerName}? This won't affect the sale.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(saleId);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await deleteSaleReminder(token, saleId);
              await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.sales.all }),
                queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
              ]);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Toast.show({
                type: "success",
                text1: "Reminder Removed",
                text2: `Payment reminder for ${customerName} has been cleared.`,
              });
            } catch (err: any) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Toast.show({
                type: "error",
                text1: "Failed",
                text2: err?.message || "Could not delete reminder",
              });
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const ListHeader = () => (
    <>
      {/* Back button & title */}
      <View className="flex-row items-center gap-3 mb-5 mt-1">
        <Pressable
          onPress={onBack}
          android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
          className="h-10 w-10 rounded-xl bg-white border border-zinc-200 items-center justify-center"
        >
          <MaterialIcons name="arrow-back" size={20} color="#18181b" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[22px] font-bold text-zinc-900 tracking-tight">
            Reminders
          </Text>
          <Text className="text-[13px] text-zinc-400 mt-0.5">
            Payment reminders for your bills
          </Text>
        </View>
      </View>

      {/* Stats summary cards */}
      <View className="flex-row gap-3 mb-5">
        {/* Total reminders */}
        <View
          className="flex-1 bg-slate-900 rounded-2xl p-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-2 mb-2">
            <View className="h-8 w-8 rounded-lg bg-white/10 items-center justify-center">
              <MaterialIcons name="notifications-active" size={16} color="#fff" />
            </View>
          </View>
          <Text className="text-[28px] font-bold text-white tracking-tight">
            {sortedSales.length}
          </Text>
          <Text className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Total Reminders
          </Text>
        </View>

        {/* Total due */}
        <View
          className="flex-1 bg-white rounded-2xl p-4 border border-zinc-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center gap-2 mb-2">
            <View className="h-8 w-8 rounded-lg bg-red-50 items-center justify-center">
              <MaterialIcons name="account-balance-wallet" size={16} color="#EF4444" />
            </View>
          </View>
          <Text className="text-[22px] font-bold text-zinc-900 tracking-tight" numberOfLines={1}>
            {formatCurrency(totalDueAmount)}
          </Text>
          <Text className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
            Total Due
          </Text>
        </View>
      </View>

      {/* Status breakdown pills */}
      <View className="flex-row gap-2 mb-5">
        {overdueCount > 0 && (
          <View className="flex-row items-center gap-1.5 bg-red-50 rounded-full px-3 py-1.5 border border-red-100">
            <View className="w-2 h-2 rounded-full bg-red-500" />
            <Text className="text-[11px] font-bold text-red-700">
              {overdueCount} Overdue
            </Text>
          </View>
        )}
        {todayCount > 0 && (
          <View className="flex-row items-center gap-1.5 bg-amber-50 rounded-full px-3 py-1.5 border border-amber-100">
            <View className="w-2 h-2 rounded-full bg-amber-500" />
            <Text className="text-[11px] font-bold text-amber-700">
              {todayCount} Today
            </Text>
          </View>
        )}
        {upcomingCount > 0 && (
          <View className="flex-row items-center gap-1.5 bg-blue-50 rounded-full px-3 py-1.5 border border-blue-100">
            <View className="w-2 h-2 rounded-full bg-blue-500" />
            <Text className="text-[11px] font-bold text-blue-700">
              {upcomingCount} Upcoming
            </Text>
          </View>
        )}
      </View>

      {/* List header */}
      {sortedSales.length > 0 && (
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            All Reminders
          </Text>
          <Text className="text-[11px] text-zinc-400">
            {sortedSales.length} reminder{sortedSales.length !== 1 ? "s" : ""}
          </Text>
        </View>
      )}
    </>
  );

  const ListEmpty = () => {
    if (isLoading) {
      return (
        <View className="bg-white rounded-2xl border border-zinc-100 items-center py-16">
          <ActivityIndicator size="large" color="#18181b" />
          <Text className="text-zinc-400 text-[13px] mt-3">Loading reminders…</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View className="bg-white rounded-2xl border border-zinc-100 items-center px-5 py-14">
          <View className="h-12 w-12 rounded-full bg-red-50 items-center justify-center mb-3">
            <MaterialIcons name="error-outline" size={24} color="#ef4444" />
          </View>
          <Text className="text-zinc-900 font-semibold text-[14px]">Something went wrong</Text>
          <Text className="text-zinc-400 text-[12px] mt-1 text-center">{error}</Text>
          <Pressable
            onPress={refetch}
            android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
            className="mt-4 px-5 py-2.5 bg-zinc-900 rounded-xl"
          >
            <Text className="text-white text-[12px] font-semibold">Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View className="bg-white rounded-2xl border border-zinc-100 items-center px-5 py-16">
        <View className="h-16 w-16 rounded-full bg-emerald-50 items-center justify-center mb-4">
          <MaterialIcons name="notifications-none" size={32} color="#10B981" />
        </View>
        <Text className="text-zinc-900 font-bold text-[16px]">No Reminders</Text>
        <Text className="text-zinc-400 text-[13px] mt-1 text-center leading-5">
          You haven't set any payment reminders yet.{"\n"}
          Add them when creating a sale.
        </Text>
      </View>
    );
  };

  const renderItem = ({ item: sale, index }: { item: DashboardSale; index: number }) => {
    if (!sale.reminderDate) return null;

    const reminderStatus = getReminderStatus(sale.reminderDate);
    const paymentStatus = STATUS_CONFIG[sale.status] ?? STATUS_CONFIG.pending;
    const isDeleting = deletingId === sale.id;
    const isFirst = index === 0;
    const isLast = index === sortedSales.length - 1;

    return (
      <View
        className={`bg-white border-l border-r border-zinc-100 ${
          isFirst ? "rounded-t-2xl border-t" : ""
        } ${isLast ? "rounded-b-2xl border-b" : ""}`}
      >
        <Pressable
          onPress={() => onOpenSale(sale.id)}
          disabled={isDeleting}
          android_ripple={{ color: "rgba(0,0,0,0.04)", borderless: false }}
          className="px-4 py-4 active:bg-zinc-50"
        >
          <View className="flex-row items-start gap-3">
            {/* Reminder icon */}
            <View
              className="h-11 w-11 rounded-xl items-center justify-center mt-0.5"
              style={{ backgroundColor: reminderStatus.iconBg }}
            >
              <MaterialIcons
                name={
                  reminderStatus.label === "Overdue"
                    ? "notification-important"
                    : "notifications-active"
                }
                size={20}
                color={reminderStatus.iconColor}
              />
            </View>

            {/* Content */}
            <View className="flex-1">
              {/* Customer + status row */}
              <View className="flex-row items-center gap-2 mb-1">
                <Text
                  className="text-[14px] font-semibold text-zinc-900 flex-1"
                  numberOfLines={1}
                >
                  {sale.customer.name}
                </Text>
                <View
                  className="flex-row items-center gap-1 rounded-full px-2.5 py-0.5"
                  style={{ backgroundColor: reminderStatus.badgeBg }}
                >
                  <View
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: reminderStatus.dotColor }}
                  />
                  <Text
                    className="text-[10px] font-bold"
                    style={{ color: reminderStatus.badgeText }}
                  >
                    {reminderStatus.label}
                  </Text>
                </View>
              </View>

              {/* Amount + payment status */}
              <View className="flex-row items-center gap-2 mb-1.5">
                <Text className="text-[16px] font-bold text-zinc-900">
                  {formatCurrency(sale.dueAmount ?? 0)}
                </Text>
                <Text className="text-[12px] text-zinc-400">due</Text>
                <View
                  className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${paymentStatus.bg}`}
                >
                  <View className={`w-1 h-1 rounded-full ${paymentStatus.dot}`} />
                  <Text className={`text-[9px] font-bold ${paymentStatus.text}`}>
                    {paymentStatus.label}
                  </Text>
                </View>
              </View>

              {/* Reminder date + items */}
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons name="schedule" size={12} color="#a1a1aa" />
                <Text className="text-[11px] text-zinc-400">
                  {formatDate(sale.reminderDate)} · {formatTime(sale.reminderDate)}
                </Text>
              </View>

              {sale.items.length > 0 && (
                <Text className="text-[11px] text-zinc-400 mt-1" numberOfLines={1}>
                  {sale.items
                    .slice(0, 2)
                    .map((i) => `${i.quantity}× ${i.product?.name ?? i.service?.name ?? "Item"}`)
                    .join(" · ")}
                  {sale.items.length > 2 ? ` +${sale.items.length - 2} more` : ""}
                </Text>
              )}
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row gap-2 mt-3 ml-14">
            <Pressable
              onPress={() => onOpenSale(sale.id)}
              android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
              className="flex-row items-center gap-1.5 bg-zinc-50 rounded-xl px-3.5 py-2 border border-zinc-200"
            >
              <MaterialIcons name="receipt-long" size={14} color="#52525b" />
              <Text className="text-[12px] font-semibold text-zinc-600">View Sale</Text>
            </Pressable>

            <Pressable
              onPress={() => handleDeleteReminder(sale.id, sale.customer.name)}
              disabled={isDeleting}
              android_ripple={{ color: "rgba(239,68,68,0.1)", borderless: false }}
              className={`flex-row items-center gap-1.5 rounded-xl px-3.5 py-2 border ${
                isDeleting
                  ? "bg-zinc-50 border-zinc-200"
                  : "bg-red-50 border-red-100"
              }`}
            >
              {isDeleting ? (
                <ActivityIndicator size={14} color="#EF4444" />
              ) : (
                <MaterialIcons name="notifications-off" size={14} color="#EF4444" />
              )}
              <Text
                className={`text-[12px] font-semibold ${
                  isDeleting ? "text-zinc-400" : "text-red-600"
                }`}
              >
                {isDeleting ? "Removing..." : "Remove"}
              </Text>
            </Pressable>
          </View>
        </Pressable>

        {/* Divider */}
        {!isLast && <View className="h-px bg-zinc-50 mx-4" />}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <FlatList
        data={isLoading ? [] : sortedSales}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        contentContainerClassName="px-4 pb-32 pt-14"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
