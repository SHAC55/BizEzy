import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppLayout } from "../components/AppLayout";
import { SkeletonSaleRow } from "../components/Skeleton";
import { useSalesData } from "../hooks/useSalesData";
import { useDebounce } from "../hooks/useDebounce";
import type { DashboardSale } from "../types/dashboard";
import type { AppRoute } from "../types/navigation";

type SalesPageProps = {
  onOpenAddSale: () => void;
  onOpenSale: (saleId: string) => void;
  onOpenReminders: () => void;
  onNavigate: (route: AppRoute) => void;
};

const fmt = (v: number) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtDate = (v: string) => new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const STATUS = {
  paid:    { label: "Paid",    bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: "check-circle" as const, iconColor: "#10B981" },
  partial: { label: "Partial", bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   icon: "schedule" as const,     iconColor: "#F59E0B" },
  pending: { label: "Pending", bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500",     icon: "error" as const,        iconColor: "#EF4444" },
} as const;

const COLORS = [
  { bg: "#EEF2FF", text: "#4338CA" }, { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#ECFDF5", text: "#065F46" }, { bg: "#FEE2E2", text: "#DC2626" },
  { bg: "#F5F3FF", text: "#6D28D9" }, { bg: "#E0F2FE", text: "#0369A1" },
];
const avatarColor = (n: string) => COLORS[n.charCodeAt(0) % COLORS.length];

const FILTERS = [
  { key: "all", label: "All", icon: "receipt-long" },
  { key: "paid", label: "Paid", icon: "check-circle" },
  { key: "partial", label: "Partial", icon: "schedule" },
  { key: "pending", label: "Pending", icon: "error" },
] as const;

export const SalesPage = ({ onNavigate, onOpenSale, onOpenAddSale, onOpenReminders }: SalesPageProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "paid" | "partial" | "pending">("all");
  const debouncedSearch = useDebounce(search);

  const { sales, summary, pagination, isLoading, isRefreshing, error, refetch } =
    useSalesData({ page, limit: 10, search: debouncedSearch, status });

  const collectionRate = (summary.totalRevenue + summary.totalOutstanding) > 0
    ? Math.round((summary.totalRevenue / (summary.totalRevenue + summary.totalOutstanding)) * 100) : 100;

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
                <View className="h-8 w-8 rounded-lg bg-emerald-500/20 items-center justify-center">
                  <MaterialIcons name="payments" size={16} color="#34D399" />
                </View>
                <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Sales Revenue</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={onOpenReminders}
                  className="h-8 w-8 rounded-lg bg-white/8 items-center justify-center"
                >
                  <MaterialIcons name="notifications-active" size={15} color="#FBBF24" />
                </Pressable>
                <Pressable
                  onPress={onOpenAddSale}
                  className="flex-row items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5"
                >
                  <MaterialIcons name="add" size={14} color="#E2E8F0" />
                  <Text className="text-[11px] font-bold text-slate-300">New Sale</Text>
                </Pressable>
              </View>
            </View>

            <Text className="text-[34px] font-bold text-white tracking-tight">{fmt(summary.totalRevenue)}</Text>
            <Text className="text-[13px] text-slate-500 mt-1">
              {summary.totalSales} transactions · {collectionRate}% collected
            </Text>
          </View>

          <View className="flex-row border-t border-white/5">
            <View className="flex-1 py-3.5 px-3 items-center border-r border-white/5">
              <MaterialIcons name="today" size={14} color="#60A5FA" style={{ marginBottom: 4 }} />
              <Text className="text-[14px] font-bold text-white" numberOfLines={1}>{fmt(summary.todaySalesAmount)}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Today</Text>
            </View>
            <View className="flex-1 py-3.5 px-3 items-center border-r border-white/5">
              <MaterialIcons name="calendar-month" size={14} color="#A78BFA" style={{ marginBottom: 4 }} />
              <Text className="text-[14px] font-bold text-white" numberOfLines={1}>{fmt(summary.monthlyRevenue)}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-1">This Month</Text>
            </View>
            <View className="flex-1 py-3.5 px-3 items-center">
              <MaterialIcons name="warning" size={14} color="#FB923C" style={{ marginBottom: 4 }} />
              <Text className="text-[14px] font-bold text-white" numberOfLines={1}>{fmt(summary.totalOutstanding)}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Outstanding</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* ─── Search & Filters ─── */}
      <Animated.View entering={FadeInDown.duration(400).delay(80)}>
        <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 gap-2 mb-3">
            <MaterialIcons name="search" size={17} color="#94A3B8" />
            <TextInput
              value={search}
              onChangeText={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search customer or item…"
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
                onPress={() => { setStatus(f.key as any); setPage(1); }}
                android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: true }}
                className={`flex-row items-center gap-1.5 rounded-full px-3.5 py-1.5 border ${status === f.key ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"}`}
              >
                <MaterialIcons name={f.icon as any} size={13} color={status === f.key ? "#fff" : "#94A3B8"} />
                <Text className={`text-[11px] font-semibold ${status === f.key ? "text-white" : "text-slate-500"}`}>{f.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* ─── List Header ─── */}
      <View className="flex-row justify-between items-center mb-2 px-1">
        <Text className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Transactions</Text>
        <Text className="text-[11px] text-slate-400">{pagination.total ?? sales.length} total</Text>
      </View>
    </>
  );

  const listEmpty = isLoading ? (
    <View className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => <SkeletonSaleRow key={i} />)}
    </View>
  ) : error ? (
    <View className="bg-white rounded-2xl border border-zinc-100 items-center px-5 py-14">
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
    <View className="bg-white rounded-2xl border border-zinc-100 items-center px-5 py-14">
      <View className="h-14 w-14 rounded-2xl bg-slate-50 items-center justify-center mb-3">
        <MaterialIcons name="receipt-long" size={24} color="#94A3B8" />
      </View>
      <Text className="text-slate-700 font-semibold text-[14px]">No transactions</Text>
      <Text className="text-slate-400 text-[12px] mt-1">Try adjusting your filters</Text>
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

          <View className="flex-row items-center gap-1.5">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pn: number;
              if (pagination.totalPages <= 5) pn = i + 1;
              else if (page <= 3) pn = i + 1;
              else if (page >= pagination.totalPages - 2) pn = pagination.totalPages - 4 + i;
              else pn = page - 2 + i;
              return (
                <Pressable
                  key={pn}
                  onPress={() => setPage(pn)}
                  className={`w-8 h-8 rounded-xl items-center justify-center ${page === pn ? "bg-slate-900" : "bg-slate-100"}`}
                >
                  <Text className={`text-[12px] font-semibold ${page === pn ? "text-white" : "text-slate-500"}`}>{pn}</Text>
                </Pressable>
              );
            })}
          </View>

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
      {!isLoading && !error && sales.length > 0 && (
        <View className="items-center pb-2">
          <Text className="text-[10px] text-slate-400">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.total ?? sales.length)} of {pagination.total ?? sales.length}
          </Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item: sale, index }: { item: DashboardSale; index: number }) => {
    const s = STATUS[sale.status] ?? STATUS.pending;
    const c = avatarColor(sale.customer.name);
    const isFirst = index === 0;
    const isLast = index === sales.length - 1;

    return (
      <Pressable
        onPress={() => onOpenSale(sale.id)}
        android_ripple={{ color: "rgba(0,0,0,0.04)", borderless: false }}
        className={`bg-white active:bg-slate-50 px-4 ${isFirst ? "rounded-t-2xl border-t" : ""} ${isLast ? "rounded-b-2xl border-b" : ""} border-l border-r border-zinc-100`}
      >
        <View className="flex-row items-center gap-3 py-3.5">
          {/* Avatar */}
          <View className="h-11 w-11 rounded-xl items-center justify-center flex-shrink-0" style={{ backgroundColor: c.bg }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: c.text }}>
              {sale.customer.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* Info */}
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-0.5">
              <Text className="text-[14px] font-semibold text-slate-900 flex-shrink" numberOfLines={1}>
                {sale.customer.name}
              </Text>
              <View className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${s.bg}`}>
                <View className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                <Text className={`text-[9px] font-bold ${s.text}`}>{s.label}</Text>
              </View>
            </View>
            <Text className="text-[10px] text-slate-400" numberOfLines={1}>
              {sale.items?.slice(0, 2).map((i) => `${i.quantity}× ${i.product?.name ?? i.service?.name ?? "Item"}`).join(" · ")}
              {(sale.items?.length ?? 0) > 2 ? ` +${sale.items.length - 2}` : ""} · {fmtDate(sale.createdAt)}
            </Text>
          </View>

          {/* Amount */}
          <View className="items-end">
            <Text className="text-[14px] font-bold text-slate-900">{fmt(sale.totalAmount)}</Text>
            {sale.dueAmount > 0 ? (
              <Text className="text-[9px] font-semibold text-amber-600 mt-0.5">Due {fmt(sale.dueAmount)}</Text>
            ) : (
              <Text className="text-[9px] font-semibold text-emerald-600 mt-0.5">Cleared</Text>
            )}
          </View>

          <MaterialIcons name="chevron-right" size={18} color="#d4d4d8" style={{ marginLeft: 2 }} />
        </View>
        {!isLast && <View className="h-px bg-slate-50" />}
      </Pressable>
    );
  };

  return (
    <AppLayout currentRoute="sales" eyebrow="Finance" title="Sales Dashboard" subtitle="Track collections, dues and transaction flow." onNavigate={onNavigate}>
      <FlatList
        data={isLoading ? [] : sales}
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