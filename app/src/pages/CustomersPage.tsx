import { useQueryClient } from "@tanstack/react-query";
import { Alert, FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppLayout } from "../components/AppLayout";
import { SkeletonCustomerRow } from "../components/Skeleton";
import { archiveCustomer } from "../lib/api";
import { queryKeys } from "../lib/query";
import { useCustomersData } from "../hooks/useCustomersData";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../providers/AuthProvider";
import type { Customer } from "../types/customer";
import type { AppRoute } from "../types/navigation";

type CustomersPageProps = {
  onOpenAddCustomer: () => void;
  onOpenCustomer: (customerId: string) => void;
  onNavigate: (route: AppRoute) => void;
};

const fmt = (v: number) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtDate = (v: string) => new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const initials = (n: string) => n.split(" ").map((p) => p[0]?.toUpperCase() || "").join("").slice(0, 2);

const AVATAR_COLORS = [
  { bg: "#EEF2FF", text: "#4338CA" }, { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#ECFDF5", text: "#065F46" }, { bg: "#FEE2E2", text: "#DC2626" },
  { bg: "#F5F3FF", text: "#6D28D9" }, { bg: "#E0F2FE", text: "#0369A1" },
];
const avatarColor = (n: string) => AVATAR_COLORS[n.charCodeAt(0) % AVATAR_COLORS.length];

const FILTERS = [
  { key: "all", label: "All", icon: "people" },
  { key: "pending", label: "Pending", icon: "schedule" },
  { key: "cleared", label: "Cleared", icon: "check-circle" },
  { key: "high_due", label: "High Due", icon: "warning" },
  { key: "archived", label: "Archived", icon: "archive" },
] as const;

export const CustomersPage = ({ onNavigate, onOpenAddCustomer, onOpenCustomer }: CustomersPageProps) => {
  const { session } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "pending" | "cleared" | "high_due" | "archived">("all");
  const debouncedSearch = useDebounce(search);

  const { customers, summary, pagination, isLoading, isRefreshing, error, refetch } = useCustomersData({
    page, limit: 10, search: debouncedSearch,
    dueStatus: filterMode === "archived" ? "all" : filterMode,
    includeArchived: filterMode === "archived",
  });

  const handleArchive = (customer: Customer, close: () => void) => {
    const isArchived = !!customer.archivedAt;
    Alert.alert(
      isArchived ? "Unarchive Customer" : "Archive Customer",
      isArchived ? `Restore ${customer.name}?` : `Archive ${customer.name}?`,
      [
        { text: "Cancel", style: "cancel", onPress: close },
        {
          text: isArchived ? "Unarchive" : "Archive", style: isArchived ? "default" : "destructive",
          onPress: async () => {
            const token = session?.tokens.accessToken;
            if (!token) { close(); return; }
            close();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            try {
              await archiveCustomer(token, customer.id);
              await Promise.all([
                qc.invalidateQueries({ queryKey: queryKeys.customers.all }),
                qc.invalidateQueries({ queryKey: queryKeys.customers.detail(customer.id) }),
                qc.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
                qc.invalidateQueries({ queryKey: queryKeys.sales.all }),
              ]);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Toast.show({ type: "success", text1: isArchived ? "Unarchived" : "Archived", text2: `${customer.name} ${isArchived ? "restored" : "archived"}.` });
            } catch (err) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Toast.show({ type: "error", text1: "Failed", text2: err instanceof Error ? err.message : "" });
            }
          },
        },
      ],
    );
  };

  const collectionRate = summary.totalRevenue > 0 ? Math.round((summary.totalRevenue / (summary.totalRevenue + summary.totalDue)) * 100) : 100;

  const listHeader = (
    <>
      {/* ─── Hero Card ─── */}
      <Animated.View entering={FadeInDown.duration(400).delay(0)}>
        <View
          className="rounded-[24px] overflow-hidden mb-4 mt-1"
          style={{ backgroundColor: "#0F172A", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 }}
        >
          <View className="px-5 pt-5 pb-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 rounded-lg bg-indigo-500/20 items-center justify-center">
                  <MaterialIcons name="groups" size={16} color="#818CF8" />
                </View>
                <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Customer Book</Text>
              </View>
              <Pressable
                onPress={onOpenAddCustomer}
                android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: false }}
                className="flex-row items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5"
              >
                <MaterialIcons name="person-add" size={14} color="#E2E8F0" />
                <Text className="text-[11px] font-bold text-slate-300">Add New</Text>
              </Pressable>
            </View>

            <Text className="text-[34px] font-bold text-white tracking-tight">
              {summary.totalCustomers}
            </Text>
            <Text className="text-[13px] text-slate-500 mt-1">
              total customers · {collectionRate}% collection rate
            </Text>
          </View>

          <View className="flex-row border-t border-white/5">
            <View className="flex-1 py-3.5 px-3 items-center border-r border-white/5">
              <MaterialIcons name="payments" size={14} color="#34D399" style={{ marginBottom: 4 }} />
              <Text className="text-[14px] font-bold text-white" numberOfLines={1}>{fmt(summary.totalRevenue)}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Collected</Text>
            </View>
            <View className="flex-1 py-3.5 px-3 items-center border-r border-white/5">
              <MaterialIcons name="schedule" size={14} color="#F87171" style={{ marginBottom: 4 }} />
              <Text className="text-[14px] font-bold text-white" numberOfLines={1}>{fmt(summary.totalDue)}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Outstanding</Text>
            </View>
            <View className="flex-1 py-3.5 px-3 items-center">
              <MaterialIcons name="warning" size={14} color="#FBBF24" style={{ marginBottom: 4 }} />
              <Text className="text-[14px] font-bold text-white">{summary.pendingCustomers}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-1">With Dues</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* ─── Status Pills ─── */}
      <Animated.View entering={FadeInDown.duration(400).delay(80)}>
        <View className="flex-row gap-3 mb-4">
          <StatusPill icon="check-circle" label="Cleared" count={summary.clearedCustomers} color="#10B981" bg="#ECFDF5" />
          <StatusPill icon="schedule" label="Pending" count={summary.pendingCustomers} color="#F59E0B" bg="#FEF3C7" />
        </View>
      </Animated.View>

      {/* ─── Search ─── */}
      <Animated.View entering={FadeInDown.duration(400).delay(160)}>
        <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 gap-2 mb-3">
            <MaterialIcons name="search" size={17} color="#94A3B8" />
            <TextInput
              value={search}
              onChangeText={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search by name, mobile, email…"
              placeholderTextColor="#94A3B8"
              className="flex-1 text-[14px] text-slate-900"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <MaterialIcons name="cancel" size={16} color="#94A3B8" />
              </Pressable>
            )}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Pressable
                key={f.key}
                onPress={() => { setFilterMode(f.key); setPage(1); }}
                android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: true }}
                className={`flex-row items-center gap-1.5 rounded-full px-3.5 py-1.5 border ${filterMode === f.key ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"}`}
              >
                <MaterialIcons name={f.icon as any} size={13} color={filterMode === f.key ? "#fff" : "#94A3B8"} />
                <Text className={`text-[11px] font-semibold ${filterMode === f.key ? "text-white" : "text-slate-500"}`}>{f.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* ─── List Header ─── */}
      <View className="flex-row justify-between items-center mb-2 px-1">
        <Text className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          {filterMode === "archived" ? "Archived" : "Customers"}
        </Text>
        <Text className="text-[11px] text-slate-400">{pagination.total ?? customers.length} results</Text>
      </View>
    </>
  );

  const listEmpty = isLoading ? (
    <View className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => <SkeletonCustomerRow key={i} />)}
    </View>
  ) : error ? (
    <View className="bg-white rounded-2xl border border-zinc-100 items-center py-14 px-5">
      <View className="h-12 w-12 rounded-full bg-red-50 items-center justify-center mb-3">
        <MaterialIcons name="error-outline" size={24} color="#ef4444" />
      </View>
      <Text className="text-slate-900 font-semibold text-[14px]">Something went wrong</Text>
      <Text className="text-slate-400 text-[12px] mt-1 text-center">{error}</Text>
      <Pressable onPress={refetch} className="mt-4 px-5 py-2.5 bg-slate-900 rounded-xl">
        <Text className="text-white text-[12px] font-semibold">Try Again</Text>
      </Pressable>
    </View>
  ) : (
    <View className="bg-white rounded-2xl border border-zinc-100 items-center py-14 px-5">
      <View className="h-14 w-14 rounded-2xl bg-slate-50 items-center justify-center mb-3">
        <MaterialIcons name="people-outline" size={24} color="#94A3B8" />
      </View>
      <Text className="text-slate-700 font-semibold text-[14px]">No customers found</Text>
      <Text className="text-slate-400 text-[12px] mt-1">Try adjusting your search or filters</Text>
    </View>
  );

  const listFooter = (
    <View className="mt-1">
      {!isLoading && !error && pagination.totalPages > 1 && (
        <View className="flex-row items-center justify-between py-4">
          <Pressable
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`rounded-xl px-4 py-2.5 flex-row items-center gap-1 ${page === 1 ? "bg-slate-100" : "bg-slate-900"}`}
          >
            <MaterialIcons name="chevron-left" size={16} color={page === 1 ? "#94A3B8" : "#fff"} />
            <Text className={`text-[12px] font-semibold ${page === 1 ? "text-slate-400" : "text-white"}`}>Prev</Text>
          </Pressable>
          <Text className="text-[12px] text-slate-400">{page} / {pagination.totalPages}</Text>
          <Pressable
            onPress={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className={`rounded-xl px-4 py-2.5 flex-row items-center gap-1 ${page === pagination.totalPages ? "bg-slate-100" : "bg-slate-900"}`}
          >
            <Text className={`text-[12px] font-semibold ${page === pagination.totalPages ? "text-slate-400" : "text-white"}`}>Next</Text>
            <MaterialIcons name="chevron-right" size={16} color={page === pagination.totalPages ? "#94A3B8" : "#fff"} />
          </Pressable>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item: customer, index }: { item: Customer; index: number }) => {
    const cleared = customer.due <= 0;
    const isFirst = index === 0;
    const isLast = index === customers.length - 1;
    const c = avatarColor(customer.name);

    return (
      <Swipeable
        overshootRight={false} friction={2} rightThreshold={36}
        renderRightActions={(_, __, swipeable) => (
          <View className={`overflow-hidden ${customer.archivedAt ? "bg-emerald-500" : "bg-amber-400"} ${isLast ? "rounded-br-2xl" : ""}`}>
            <Pressable
              onPress={() => handleArchive(customer, () => swipeable.close())}
              android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: false }}
              className="h-full w-[80px] items-center justify-center gap-1"
            >
              <MaterialIcons name={customer.archivedAt ? "unarchive" : "archive"} size={18} color={customer.archivedAt ? "#fff" : "#18181b"} />
              <Text className={`text-[10px] font-bold ${customer.archivedAt ? "text-white" : "text-zinc-900"}`}>
                {customer.archivedAt ? "Restore" : "Archive"}
              </Text>
            </Pressable>
          </View>
        )}
      >
        <Pressable
          onPress={() => onOpenCustomer(customer.id)}
          android_ripple={{ color: "rgba(0,0,0,0.04)", borderless: false }}
          className={`bg-white active:bg-slate-50 px-4 ${isFirst ? "rounded-t-2xl border-t" : ""} ${isLast ? "rounded-b-2xl border-b" : ""} border-l border-r border-zinc-100`}
        >
          <View className="flex-row items-center gap-3 py-3.5">
            {/* Avatar */}
            <View className="h-11 w-11 rounded-xl items-center justify-center flex-shrink-0" style={{ backgroundColor: c.bg }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: c.text }}>{initials(customer.name)}</Text>
            </View>

            {/* Info */}
            <View className="flex-1 min-w-0">
              <View className="flex-row items-center gap-2 mb-0.5">
                <Text className="text-[14px] font-semibold text-slate-900 flex-shrink" numberOfLines={1}>
                  {customer.name}
                </Text>
                {customer.archivedAt && (
                  <View className="bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200">
                    <Text className="text-amber-700 text-[8px] font-bold uppercase">Archived</Text>
                  </View>
                )}
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="text-[11px] text-slate-400">{customer.mobile}</Text>
                <Text className="text-[10px] text-slate-300">· Since {fmtDate(customer.createdAt)}</Text>
              </View>
            </View>

            {/* Due badge */}
            <View className="items-end">
              <View className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full ${cleared ? "bg-emerald-50" : "bg-red-50"}`}>
                <View className={`w-1.5 h-1.5 rounded-full ${cleared ? "bg-emerald-500" : "bg-red-500"}`} />
                <Text className={`text-[10px] font-bold ${cleared ? "text-emerald-700" : "text-red-700"}`}>
                  {cleared ? "Cleared" : fmt(customer.due)}
                </Text>
              </View>
              {customer.totalPayment > 0 && (
                <Text className="text-[9px] text-slate-400 mt-1">{fmt(customer.totalPayment)} total</Text>
              )}
            </View>

            <MaterialIcons name="chevron-right" size={18} color="#d4d4d8" style={{ marginLeft: 2 }} />
          </View>
          {!isLast && <View className="h-px bg-slate-50" />}
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <AppLayout currentRoute="customers" onNavigate={onNavigate} title="Customer Book" subtitle="Track relationships & payments">
      <FlatList
        data={isLoading ? [] : customers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        contentContainerClassName="px-4 pb-32 pt-2"
        showsVerticalScrollIndicator={false}
      />
    </AppLayout>
  );
};

// ── Status Pill ─────────────────────────────────────────────────
const StatusPill = ({ icon, label, count, color, bg }: {
  icon: any; label: string; count: number; color: string; bg: string;
}) => (
  <View className="flex-1 bg-white rounded-2xl border border-slate-100 py-3 px-3 items-center"
    style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 }}
  >
    <View className="h-8 w-8 rounded-lg items-center justify-center mb-1.5" style={{ backgroundColor: bg }}>
      <MaterialIcons name={icon} size={15} color={color} />
    </View>
    <Text className="text-[16px] font-bold text-slate-900">{count}</Text>
    <Text className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{label}</Text>
  </View>
);