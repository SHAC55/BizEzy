import { useEffect, useState, type ComponentProps } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppLayout } from "../components/AppLayout";
import { archiveCustomer, fetchCustomer, deleteCustomer } from "../lib/api";
import { queryKeys } from "../lib/query";
import { useAuth } from "../providers/AuthProvider";
import type { CustomerDetail } from "../types/customer";
import type { AppRoute } from "../types/navigation";

type Props = {
  customerId: string;
  onBack: () => void;
  onEdit: () => void;
  onOpenSale: (saleId: string) => void;
  onNavigate: (route: AppRoute) => void;
};

type IconName = ComponentProps<typeof MaterialIcons>["name"];

const fmt = (v: number) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtDate = (v: string) => new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtShort = (v: string) => new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const initials = (n: string) => n.split(" ").map((p) => p[0]?.toUpperCase() || "").join("").slice(0, 2);

const COLORS = [
  { bg: "#6366F1", light: "#EEF2FF" }, { bg: "#0EA5E9", light: "#E0F2FE" },
  { bg: "#F59E0B", light: "#FEF3C7" }, { bg: "#10B981", light: "#ECFDF5" },
  { bg: "#EC4899", light: "#FCE7F3" }, { bg: "#8B5CF6", light: "#F5F3FF" },
];
const avatarColor = (n: string) => COLORS[n.charCodeAt(0) % COLORS.length];

export const CustomerDetailPage = ({ customerId, onBack, onEdit, onNavigate, onOpenSale }: Props) => {
  const { session } = useAuth();
  const qc = useQueryClient();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = async (refresh = false) => {
    const token = session?.tokens.accessToken;
    if (!token) { setError("Session expired."); return; }
    refresh ? setIsRefreshing(true) : setIsLoading(true);
    try {
      setError(null);
      setCustomer(await fetchCustomer(token, customerId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { load(); }, [customerId]);

  const handleArchive = () => {
    const isArchived = !!customer?.archivedAt;
    Alert.alert(isArchived ? "Unarchive" : "Archive", isArchived ? "Restore this customer?" : "Archive this customer?", [
      { text: "Cancel", style: "cancel" },
      {
        text: isArchived ? "Unarchive" : "Archive", style: isArchived ? "default" : "destructive",
        onPress: async () => {
          const token = session?.tokens.accessToken;
          if (!token) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setIsArchiving(true);
          try {
            await archiveCustomer(token, customerId);
            await Promise.all([
              qc.invalidateQueries({ queryKey: queryKeys.customers.all }),
              qc.invalidateQueries({ queryKey: queryKeys.customers.detail(customerId) }),
              qc.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
            ]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Toast.show({ type: "success", text1: isArchived ? "Unarchived" : "Archived" });
            load();
          } catch (err) {
            Toast.show({ type: "error", text1: "Failed", text2: err instanceof Error ? err.message : "" });
          } finally { setIsArchiving(false); }
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete Customer", "This cannot be undone. Customers with sales cannot be deleted.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          const token = session?.tokens.accessToken;
          if (!token) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setIsDeleting(true);
          try {
            await deleteCustomer(token, customerId);
            await qc.invalidateQueries({ queryKey: queryKeys.customers.all });
            await qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Toast.show({ type: "success", text1: "Customer Deleted" });
            onBack();
          } catch (err) {
            Toast.show({ type: "error", text1: "Delete Failed", text2: err instanceof Error ? err.message : "" });
          } finally { setIsDeleting(false); }
        },
      },
    ]);
  };

  const c = avatarColor(customer?.name ?? "U");
  const cleared = (customer?.due ?? 0) <= 0;
  const paidPct = customer ? (customer.totalInvoiced > 0 ? Math.round((customer.totalPayment / customer.totalInvoiced) * 100) : 100) : 0;

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => load(true)} />}
      >
        {/* ─── Hero ─── */}
        <View className="bg-slate-900 px-5 pb-10 pt-14">
          <View className="flex-row items-center justify-between mb-8">
            <Pressable onPress={onBack} className="h-10 w-10 rounded-xl bg-white/10 items-center justify-center">
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </Pressable>
            <Text className="text-[17px] font-bold text-white">Customer</Text>
            <Pressable onPress={onEdit} className="h-10 w-10 rounded-xl bg-white/10 items-center justify-center">
              <MaterialIcons name="edit" size={18} color="#fff" />
            </Pressable>
          </View>

          {isLoading ? (
            <View className="items-center py-10">
              <ActivityIndicator size="large" color="#818CF8" />
              <Text className="text-slate-400 text-[13px] mt-3">Loading…</Text>
            </View>
          ) : error || !customer ? (
            <View className="items-center py-10">
              <MaterialIcons name="error-outline" size={32} color="#F87171" />
              <Text className="text-red-400 text-[13px] mt-2">{error || "Not found"}</Text>
            </View>
          ) : (
            <>
              <View className="items-center">
                <View className="h-20 w-20 rounded-2xl items-center justify-center mb-3" style={{ backgroundColor: c.bg }}>
                  <Text className="text-[28px] font-bold text-white">{initials(customer.name)}</Text>
                </View>
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-[22px] font-bold text-white tracking-tight">{customer.name}</Text>
                  {customer.archivedAt && (
                    <View className="bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                      <Text className="text-amber-400 text-[9px] font-bold uppercase">Archived</Text>
                    </View>
                  )}
                </View>
                <Text className="text-[13px] text-slate-400">{customer.mobile}</Text>
                <View className="flex-row items-center gap-2 mt-2">
                  <View className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full ${cleared ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                    <View className={`w-1.5 h-1.5 rounded-full ${cleared ? "bg-emerald-400" : "bg-red-400"}`} />
                    <Text className={`text-[11px] font-bold ${cleared ? "text-emerald-400" : "text-red-400"}`}>
                      {cleared ? "All Cleared" : `${fmt(customer.due)} Due`}
                    </Text>
                  </View>
                  <View className="bg-white/10 rounded-full px-3 py-1.5">
                    <Text className="text-[11px] font-semibold text-slate-400">
                      Since {fmtShort(customer.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {customer && !isLoading && !error && (
          <View className="px-4 -mt-5">
            {/* ─── Financial Summary ─── */}
            <Animated.View entering={FadeInDown.duration(400).delay(0)}>
              <View
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-4"
                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 }}
              >
                <View className="flex-row">
                  <MetricBox icon="payments" label="Revenue" value={fmt(customer.totalPayment)} color="#10B981" bg="#ECFDF5" />
                  <View className="w-px bg-slate-100" />
                  <MetricBox icon="receipt" label="Invoiced" value={fmt(customer.totalInvoiced)} color="#6366F1" bg="#EEF2FF" />
                  <View className="w-px bg-slate-100" />
                  <MetricBox icon="shopping-bag" label="Orders" value={String(customer.orders)} color="#F59E0B" bg="#FEF3C7" />
                </View>

                {/* Payment progress */}
                <View className="px-4 py-3 border-t border-slate-50">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-[11px] font-semibold text-slate-400">Payment Progress</Text>
                    <Text className="text-[11px] font-bold" style={{ color: paidPct >= 80 ? "#10B981" : paidPct >= 50 ? "#F59E0B" : "#EF4444" }}>
                      {paidPct}% collected
                    </Text>
                  </View>
                  <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(paidPct, 100)}%`,
                        backgroundColor: paidPct >= 80 ? "#10B981" : paidPct >= 50 ? "#F59E0B" : "#EF4444",
                      }}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* ─── Contact Info ─── */}
            <Animated.View entering={FadeInDown.duration(400).delay(80)}>
              <SectionLabel icon="info" color="#6366F1" bg="#EEF2FF" label="Contact Info" />
              <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                <View className="flex-row gap-3 mb-3">
                  <View className="flex-1">
                    <InfoCell icon="phone" label="Phone" value={customer.mobile} />
                  </View>
                  <View className="flex-1">
                    <InfoCell icon="mail" label="Email" value={customer.email || "Not provided"} muted={!customer.email} />
                  </View>
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <InfoCell icon="location-on" label="Address" value={customer.address || "Not provided"} muted={!customer.address} />
                  </View>
                  <View className="flex-1">
                    <InfoCell icon="account-balance-wallet" label="Opening Bal." value={fmt(customer.openingBalance)} />
                  </View>
                </View>
                {customer.notes && (
                  <View className="mt-3">
                    <InfoCell icon="description" label="Notes" value={customer.notes} />
                  </View>
                )}
              </View>
            </Animated.View>

            {/* ─── Sales History ─── */}
            <Animated.View entering={FadeInDown.duration(400).delay(160)}>
              <SectionLabel icon="receipt-long" color="#F59E0B" bg="#FEF3C7" label={`Sales History (${customer.sales.length})`} />
              <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
                {customer.sales.length === 0 ? (
                  <View className="items-center py-12">
                    <View className="h-12 w-12 rounded-2xl bg-slate-50 items-center justify-center mb-2">
                      <MaterialIcons name="receipt-long" size={22} color="#94A3B8" />
                    </View>
                    <Text className="text-[13px] font-medium text-slate-400">No sales yet</Text>
                  </View>
                ) : (
                  customer.sales.map((sale, i) => {
                    const saleDue = sale.dueAmount > 0;
                    const isLast = i === customer.sales.length - 1;
                    return (
                      <Pressable
                        key={sale.id}
                        onPress={() => onOpenSale(sale.id)}
                        android_ripple={{ color: "rgba(0,0,0,0.04)", borderless: false }}
                        className={`px-4 py-3.5 active:bg-slate-50 ${!isLast ? "border-b border-slate-50" : ""}`}
                      >
                        <View className="flex-row items-center gap-3">
                          <View className={`h-9 w-9 rounded-xl items-center justify-center ${saleDue ? "bg-red-50" : "bg-emerald-50"}`}>
                            <MaterialIcons name={saleDue ? "schedule" : "check-circle"} size={16} color={saleDue ? "#EF4444" : "#10B981"} />
                          </View>
                          <View className="flex-1">
                            <Text className="text-[13px] font-semibold text-slate-800">
                              #{sale.id.slice(0, 8)}
                            </Text>
                            <Text className="text-[10px] text-slate-400 mt-0.5">{fmtDate(sale.createdAt)}</Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-[14px] font-bold text-slate-900">{fmt(sale.totalAmount)}</Text>
                            {saleDue ? (
                              <Text className="text-[10px] font-semibold text-red-500 mt-0.5">Due {fmt(sale.dueAmount)}</Text>
                            ) : (
                              <Text className="text-[10px] font-semibold text-emerald-600 mt-0.5">Paid</Text>
                            )}
                          </View>
                          <MaterialIcons name="chevron-right" size={16} color="#D4D4D8" />
                        </View>
                      </Pressable>
                    );
                  })
                )}
              </View>
            </Animated.View>

            {/* ─── Actions ─── */}
            <Animated.View entering={FadeInDown.duration(400).delay(240)}>
              <SectionLabel icon="settings" color="#64748B" bg="#F1F5F9" label="Actions" />
              <View className="gap-3 mb-6">
                <Pressable
                  onPress={handleArchive}
                  disabled={isArchiving}
                  android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
                  className="flex-row items-center gap-3 bg-white rounded-2xl border border-slate-100 px-4 py-4"
                  style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 }}
                >
                  <View className="h-10 w-10 rounded-xl bg-amber-50 items-center justify-center">
                    <MaterialIcons name={customer.archivedAt ? "unarchive" : "archive"} size={18} color="#F59E0B" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] font-semibold text-slate-800">
                      {isArchiving ? "Processing..." : customer.archivedAt ? "Unarchive Customer" : "Archive Customer"}
                    </Text>
                    <Text className="text-[11px] text-slate-400 mt-0.5">
                      {customer.archivedAt ? "Restore to active list" : "Hide from active list"}
                    </Text>
                  </View>
                  {isArchiving ? <ActivityIndicator size={16} color="#F59E0B" /> : <MaterialIcons name="chevron-right" size={18} color="#D4D4D8" />}
                </Pressable>

                <Pressable
                  onPress={handleDelete}
                  disabled={isDeleting}
                  android_ripple={{ color: "rgba(239,68,68,0.08)", borderless: false }}
                  className="flex-row items-center gap-3 bg-white rounded-2xl border border-red-100 px-4 py-4"
                >
                  <View className="h-10 w-10 rounded-xl bg-red-50 items-center justify-center">
                    <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] font-semibold text-red-600">
                      {isDeleting ? "Deleting..." : "Delete Customer"}
                    </Text>
                    <Text className="text-[11px] text-slate-400 mt-0.5">Permanently remove this customer</Text>
                  </View>
                  {isDeleting ? <ActivityIndicator size={16} color="#EF4444" /> : <MaterialIcons name="chevron-right" size={18} color="#FECACA" />}
                </Pressable>
              </View>
            </Animated.View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ── Sub-components ───────────────────────────────────────────────

const MetricBox = ({ icon, label, value, color, bg }: { icon: IconName; label: string; value: string; color: string; bg: string }) => (
  <View className="flex-1 py-4 px-3 items-center">
    <View className="h-8 w-8 rounded-lg items-center justify-center mb-2" style={{ backgroundColor: bg }}>
      <MaterialIcons name={icon} size={15} color={color} />
    </View>
    <Text className="text-[15px] font-bold text-slate-900" numberOfLines={1}>{value}</Text>
    <Text className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1">{label}</Text>
  </View>
);

const SectionLabel = ({ icon, color, bg, label }: { icon: IconName; color: string; bg: string; label: string }) => (
  <View className="flex-row items-center gap-2 mb-3 ml-1">
    <View className="h-6 w-6 rounded-md items-center justify-center" style={{ backgroundColor: bg }}>
      <MaterialIcons name={icon} size={13} color={color} />
    </View>
    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</Text>
  </View>
);

const InfoCell = ({ icon, label, value, muted }: { icon: IconName; label: string; value: string; muted?: boolean }) => (
  <View className="bg-slate-50 rounded-xl px-3.5 py-3">
    <View className="flex-row items-center gap-2 mb-1.5">
      <MaterialIcons name={icon} size={14} color={muted ? "#CBD5E1" : "#94A3B8"} />
      <Text className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">{label}</Text>
    </View>
    <Text className={`text-[13px] font-medium ${muted ? "text-slate-300 italic" : "text-slate-800"}`} numberOfLines={2}>{value}</Text>
  </View>
);
