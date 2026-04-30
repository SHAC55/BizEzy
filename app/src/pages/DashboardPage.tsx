import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppLayout } from "../components/AppLayout";
import { useDashboardData } from "../hooks/useDashboardData";
import type { AuthSession } from "../types/auth";
import type {
  DashboardCustomerSummary,
  DashboardSale,
  DashboardSalesSummary,
} from "../types/dashboard";
import type { AppRoute } from "../types/navigation";

type DashboardPageProps = {
  onOpenAddInventory: () => void;
  onOpenCustomers: () => void;
  onOpenInventory: () => void;
  onOpenSales: () => void;
  onNavigate: (route: AppRoute) => void;
  session: AuthSession;
};

type IconName = ComponentProps<typeof MaterialIcons>["name"];

const fmt = (v: number) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const fmtDate = (v: string) =>
  new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const STATUS = {
  paid:    { label: "Paid",    dot: "#22C55E", bg: "#DCFCE7", text: "#15803D" },
  partial: { label: "Partial", dot: "#F59E0B", bg: "#FEF3C7", text: "#B45309" },
  pending: { label: "Pending", dot: "#EF4444", bg: "#FEE2E2", text: "#DC2626" },
} as const;

const COLORS = [
  { bg: "#EEF2FF", text: "#4338CA" },
  { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#ECFDF5", text: "#065F46" },
  { bg: "#FEE2E2", text: "#DC2626" },
  { bg: "#F5F3FF", text: "#6D28D9" },
  { bg: "#E0F2FE", text: "#0369A1" },
];

const avatarColor = (n: string) => COLORS[n.charCodeAt(0) % COLORS.length];

// ═══════════════════════════════════════════════════════════════════
export const DashboardPage = ({
  onNavigate,
  onOpenAddInventory,
  onOpenCustomers,
  onOpenInventory,
  onOpenSales,
  session,
}: DashboardPageProps) => {
  const { customerSummary, error, isLoading, isRefreshing, refetch, sales, salesSummary } =
    useDashboardData();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  if (isLoading && !sales.length) {
    return (
      <AppLayout currentRoute="dashboard" onNavigate={onNavigate} subtitle="Preparing your workspace." title="Dashboard">
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={{ fontSize: 13, color: "#94A3B8" }}>Loading dashboard…</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout currentRoute="dashboard" onNavigate={onNavigate} subtitle="Here's your business today." title="Dashboard">
      <ScrollView
        style={{ backgroundColor: "#F8FAFC" }}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Greeting Banner ─── */}
        <Animated.View entering={FadeInDown.duration(500).delay(0)}>
          <View className="mx-4 mt-3 mb-5">
            <Text className="text-[14px] text-slate-400 font-medium">{greeting},</Text>
            <Text className="text-[26px] font-bold text-slate-900 tracking-tight -mt-0.5">
              {firstName} 👋
            </Text>
          </View>
        </Animated.View>

        {/* ─── Hero Revenue Card ─── */}
        <Animated.View entering={FadeInDown.duration(500).delay(80)}>
          <View
            className="mx-4 mb-5 rounded-[24px] overflow-hidden"
            style={{
              backgroundColor: "#0F172A",
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Top section */}
            <View className="px-5 pt-5 pb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <View className="h-8 w-8 rounded-lg bg-indigo-500/20 items-center justify-center">
                    <MaterialIcons name="account-balance-wallet" size={16} color="#818CF8" />
                  </View>
                  <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Revenue
                  </Text>
                </View>
                <View className="flex-row items-center gap-1 bg-emerald-500/15 rounded-full px-2.5 py-1">
                  <MaterialIcons name="trending-up" size={12} color="#34D399" />
                  <Text className="text-[10px] font-bold text-emerald-400">
                    {salesSummary.todaySalesCount} today
                  </Text>
                </View>
              </View>

              <Text className="text-[36px] font-bold text-white tracking-tight">
                {fmt(salesSummary.totalRevenue)}
              </Text>
              <Text className="text-[13px] text-slate-500 mt-1">
                from {salesSummary.totalSales} total sales
              </Text>
            </View>

            {/* Bottom metrics strip */}
            <View className="flex-row border-t border-white/5">
              <MetricPill
                icon="today"
                label="Today"
                value={fmt(salesSummary.todaySalesAmount)}
                color="#60A5FA"
                border
              />
              <MetricPill
                icon="calendar-month"
                label="This Month"
                value={fmt(salesSummary.monthlyRevenue)}
                color="#A78BFA"
                border
              />
              <MetricPill
                icon="warning"
                label="Outstanding"
                value={fmt(salesSummary.totalOutstanding)}
                color="#FB923C"
              />
            </View>
          </View>
        </Animated.View>

        {/* ─── Stat Cards Row ─── */}
        <Animated.View entering={FadeInDown.duration(500).delay(160)}>
          <View className="flex-row px-4 gap-3 mb-5">
            <StatCard
              icon="groups"
              label="Customers"
              value={String(customerSummary.totalCustomers || 0)}
              sub={`${customerSummary.pendingCustomers} with dues`}
              iconBg="#EEF2FF"
              iconColor="#6366F1"
              dark
            />
            <StatCard
              icon="receipt-long"
              label="Total Sales"
              value={String(salesSummary.totalSales || 0)}
              sub={`${salesSummary.uniqueCustomers} customers`}
              iconBg="#FEF3C7"
              iconColor="#F59E0B"
            />
          </View>
        </Animated.View>

        {/* ─── Quick Actions ─── */}
        <Animated.View entering={FadeInDown.duration(500).delay(240)}>
          <View className="px-4 mb-5">
            <Text className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3 ml-1">
              Quick Actions
            </Text>
            <View className="flex-row gap-3">
              <ActionCard icon="add-shopping-cart" label="New Sale" color="#059669" bg="#ECFDF5" onPress={onOpenSales} />
              <ActionCard icon="inventory-2" label="Add Stock" color="#6366F1" bg="#EEF2FF" onPress={onOpenAddInventory} />
              <ActionCard icon="person-add" label="Customer" color="#F59E0B" bg="#FEF3C7" onPress={onOpenCustomers} />
            </View>
          </View>
        </Animated.View>

        {/* ─── Activity Feed ─── */}
        <Animated.View entering={FadeInDown.duration(500).delay(320)}>
          <View className="px-4 mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-[11px] font-bold tracking-wider text-slate-400 uppercase ml-1">
                Recent Activity
              </Text>
              <Pressable onPress={onOpenSales} android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: true }}>
                <Text className="text-[11px] font-semibold text-indigo-600">View All →</Text>
              </Pressable>
            </View>

            <View
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
              style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
            >
              {isLoading ? (
                <View className="items-center py-12">
                  <ActivityIndicator size="small" color="#6366F1" />
                  <Text className="text-[12px] text-slate-400 mt-2">Loading…</Text>
                </View>
              ) : error ? (
                <View className="items-center px-5 py-12">
                  <MaterialIcons name="error-outline" size={28} color="#EF4444" />
                  <Text className="text-[12px] text-red-500 mt-2 text-center">{error}</Text>
                </View>
              ) : sales.length === 0 ? (
                <View className="items-center px-5 py-12">
                  <View className="w-14 h-14 rounded-2xl bg-slate-50 items-center justify-center mb-3">
                    <MaterialIcons name="receipt-long" size={24} color="#94A3B8" />
                  </View>
                  <Text className="text-[14px] font-semibold text-slate-700">No sales yet</Text>
                  <Text className="text-[12px] text-slate-400 mt-1">Create your first sale to see activity here</Text>
                </View>
              ) : (
                sales.slice(0, 5).map((sale, i) => (
                  <SaleRow key={sale.id} sale={sale} isLast={i === Math.min(sales.length, 5) - 1} />
                ))
              )}

              {!isLoading && !error && sales.length > 5 && (
                <Pressable
                  onPress={onOpenSales}
                  android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
                  className="py-3 items-center border-t border-slate-50 bg-slate-50/50"
                >
                  <Text className="text-[12px] font-semibold text-indigo-600">
                    See all {sales.length} transactions →
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>

        {/* ─── Business Pulse ─── */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <View className="px-4 mb-4">
            <Text className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3 ml-1">
              Business Pulse
            </Text>
            <View className="flex-row gap-3">
              <PulseCard
                icon="payments"
                label="Collected"
                value={fmt(salesSummary.totalRevenue)}
                color="#10B981"
                bg="#ECFDF5"
              />
              <PulseCard
                icon="schedule"
                label="Pending"
                value={fmt(customerSummary.totalDue)}
                color="#EF4444"
                bg="#FEF2F2"
              />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </AppLayout>
  );
};

// ── Metric Pill (inside hero card) ───────────────────────────────
const MetricPill = ({ icon, label, value, color, border }: {
  icon: IconName; label: string; value: string; color: string; border?: boolean;
}) => (
  <View className={`flex-1 py-3.5 px-3 items-center ${border ? "border-r border-white/5" : ""}`}>
    <MaterialIcons name={icon} size={14} color={color} style={{ marginBottom: 4 }} />
    <Text style={{ fontSize: 14, fontWeight: "800", color: "#FFFFFF" }} numberOfLines={1}>{value}</Text>
    <Text style={{ fontSize: 9, fontWeight: "600", color: "#64748B", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Text>
  </View>
);

// ── Stat Card ────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, iconBg, iconColor, dark }: {
  icon: IconName; label: string; value: string; sub: string;
  iconBg: string; iconColor: string; dark?: boolean;
}) => (
  <View
    className={`flex-1 rounded-2xl p-4 ${dark ? "bg-slate-900" : "bg-white border border-slate-100"}`}
    style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
  >
    <View className="h-9 w-9 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: dark ? "rgba(255,255,255,0.08)" : iconBg }}>
      <MaterialIcons name={icon} size={17} color={dark ? "#FFFFFF" : iconColor} />
    </View>
    <Text className={`text-[24px] font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>{value}</Text>
    <Text className={`text-[11px] font-semibold mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</Text>
    <Text className={`text-[10px] mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{sub}</Text>
  </View>
);

// ── Quick Action Card ────────────────────────────────────────────
const ActionCard = ({ icon, label, color, bg, onPress }: {
  icon: IconName; label: string; color: string; bg: string; onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
    className="flex-1 bg-white rounded-2xl border border-slate-100 py-4 items-center active:bg-slate-50"
    style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 }}
  >
    <View className="h-11 w-11 rounded-xl items-center justify-center mb-2.5" style={{ backgroundColor: bg }}>
      <MaterialIcons name={icon} size={20} color={color} />
    </View>
    <Text className="text-[12px] font-semibold text-slate-700">{label}</Text>
  </Pressable>
);

// ── Sale Row ─────────────────────────────────────────────────────
const SaleRow = ({ sale, isLast }: { sale: DashboardSale; isLast: boolean }) => {
  const s = STATUS[sale.status] ?? STATUS.pending;
  const c = avatarColor(sale.customer.name);
  return (
    <View className={`px-4 py-3.5 ${!isLast ? "border-b border-slate-50" : ""}`}>
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: c.bg }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: c.text }}>
            {sale.customer.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-0.5">
            <Text className="text-[13px] font-semibold text-slate-800" numberOfLines={1}>
              {sale.customer.name}
            </Text>
            <View className="flex-row items-center gap-1 rounded-full px-2 py-0.5" style={{ backgroundColor: s.bg }}>
              <View className="w-1 h-1 rounded-full" style={{ backgroundColor: s.dot }} />
              <Text style={{ fontSize: 8, fontWeight: "700", color: s.text }}>{s.label}</Text>
            </View>
          </View>
          <Text className="text-[10px] text-slate-400" numberOfLines={1}>
            {sale.items?.slice(0, 2).map((i) => `${i.quantity}× ${i.product.name}`).join(" · ")}
            {(sale.items?.length ?? 0) > 2 ? ` +${sale.items.length - 2}` : ""} · {fmtDate(sale.createdAt)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-[13px] font-bold text-slate-800">{fmt(sale.totalAmount)}</Text>
          {sale.dueAmount > 0 ? (
            <Text className="text-[9px] font-semibold text-amber-600 mt-0.5">Due {fmt(sale.dueAmount)}</Text>
          ) : (
            <Text className="text-[9px] font-semibold text-emerald-600 mt-0.5">Cleared</Text>
          )}
        </View>
      </View>
    </View>
  );
};

// ── Pulse Card ───────────────────────────────────────────────────
const PulseCard = ({ icon, label, value, color, bg }: {
  icon: IconName; label: string; value: string; color: string; bg: string;
}) => (
  <View
    className="flex-1 bg-white rounded-2xl border border-slate-100 p-4"
    style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}
  >
    <View className="flex-row items-center gap-2 mb-2">
      <View className="h-8 w-8 rounded-lg items-center justify-center" style={{ backgroundColor: bg }}>
        <MaterialIcons name={icon} size={16} color={color} />
      </View>
      <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</Text>
    </View>
    <Text className="text-[20px] font-bold text-slate-900 tracking-tight">{value}</Text>
  </View>
);
