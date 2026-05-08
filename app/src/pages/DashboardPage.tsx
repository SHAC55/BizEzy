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
          <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "600", letterSpacing: 1.2, textTransform: "uppercase" }}>
                {greeting}
              </Text>
              <Text style={{ fontSize: 28, fontWeight: "800", color: "#0F172A", letterSpacing: -0.8, marginTop: 2 }}>
                {firstName} 👋
              </Text>
            </View>
            {/* Live badge */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F0FDF4", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: "#BBF7D0" }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#22C55E" }} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#15803D" }}>Live</Text>
            </View>
          </View>
        </Animated.View>

        {/* ─── Hero Revenue Card ─── */}
        <Animated.View entering={FadeInDown.duration(500).delay(80)}>
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 20,
              borderRadius: 28,
              overflow: "hidden",
              backgroundColor: "#0F172A",
              shadowColor: "#6366F1",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.25,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            {/* Indigo accent bar */}
            <View style={{ height: 3, backgroundColor: "#6366F1", width: "38%", borderBottomRightRadius: 3 }} />

            {/* Main content */}
            <View style={{ paddingHorizontal: 22, paddingTop: 20, paddingBottom: 18 }}>
              {/* Label row */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "rgba(99,102,241,0.15)", alignItems: "center", justifyContent: "center" }}>
                    <MaterialIcons name="account-balance-wallet" size={15} color="#818CF8" />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: "#475569", letterSpacing: 1.4, textTransform: "uppercase" }}>
                    Total Revenue
                  </Text>
                </View>
                <View style={{ backgroundColor: "rgba(34,197,94,0.12)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MaterialIcons name="arrow-upward" size={10} color="#34D399" />
                  <Text style={{ fontSize: 10, fontWeight: "800", color: "#34D399" }}>
                    {salesSummary.todaySalesCount} today
                  </Text>
                </View>
              </View>

              {/* Revenue amount */}
              <Text style={{ fontSize: 40, fontWeight: "900", color: "#FFFFFF", letterSpacing: -1.5, lineHeight: 46 }}>
                {fmt(salesSummary.totalRevenue)}
              </Text>
              <Text style={{ fontSize: 12, color: "#475569", marginTop: 5, fontWeight: "500" }}>
                across {salesSummary.totalSales} transactions
              </Text>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.04)" }} />

            {/* Bottom metric strip */}
            <View style={{ flexDirection: "row" }}>
              {[
                { icon: "today" as IconName,          label: "Today",       value: fmt(salesSummary.todaySalesAmount),  color: "#60A5FA" },
                { icon: "calendar-month" as IconName, label: "Month",       value: fmt(salesSummary.monthlyRevenue),    color: "#A78BFA" },
                { icon: "warning" as IconName,        label: "Outstanding", value: fmt(salesSummary.totalOutstanding),  color: "#FB923C" },
              ].map((m, i, arr) => (
                <View
                  key={m.label}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    paddingHorizontal: 10,
                    alignItems: "center",
                    borderRightWidth: i < arr.length - 1 ? 1 : 0,
                    borderRightColor: "rgba(255,255,255,0.05)",
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.3 }} numberOfLines={1}>
                    {m.value}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 }}>
                    <MaterialIcons name={m.icon} size={9} color={m.color} />
                    <Text style={{ fontSize: 9, fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: 0.8 }}>
                      {m.label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* ─── Stat Cards Row ─── */}
        <Animated.View entering={FadeInDown.duration(500).delay(160)}>
          <View style={{ flexDirection: "row", paddingHorizontal: 16, gap: 12, marginBottom: 20 }}>

            {/* Customers card — light */}
            <View
              style={{
                flex: 1,
                borderRadius: 20,
                backgroundColor: "#FFFFFF",
                padding: 16,
                borderWidth: 1,
                borderColor: "#F1F5F9",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" }}>
                  <MaterialIcons name="groups" size={15} color="#6366F1" />
                </View>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#94A3B8", letterSpacing: 0.6, textTransform: "uppercase" }}>
                  Customers
                </Text>
              </View>
              <Text style={{ fontSize: 32, fontWeight: "900", color: "#0F172A", letterSpacing: -1 }}>
                {customerSummary.totalCustomers || 0}
              </Text>
              <View style={{ marginTop: 8, alignSelf: "flex-start", backgroundColor: "#FEF3C7", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#B45309" }}>
                  {customerSummary.pendingCustomers} with dues
                </Text>
              </View>
            </View>

            {/* Total Sales card — dark */}
            <View
              style={{
                flex: 1,
                borderRadius: 20,
                backgroundColor: "#0F172A",
                padding: 16,
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: "rgba(245,158,11,0.15)", alignItems: "center", justifyContent: "center" }}>
                  <MaterialIcons name="receipt-long" size={15} color="#FBBF24" />
                </View>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#475569", letterSpacing: 0.6, textTransform: "uppercase" }}>
                  Sales
                </Text>
              </View>
              <Text style={{ fontSize: 32, fontWeight: "900", color: "#FFFFFF", letterSpacing: -1 }}>
                {salesSummary.totalSales || 0}
              </Text>
              <View style={{ marginTop: 8, alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#64748B" }}>
                  {salesSummary.uniqueCustomers} customers
                </Text>
              </View>
            </View>

          </View>
        </Animated.View>

        {/* ─── Quick Actions ─── */}
        <Animated.View entering={FadeInDown.duration(500).delay(240)}>
          <View className="px-4 mb-5">
            <Text className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-3 ml-1">
              Quick Actions
            </Text>
            <View className="flex-row gap-3">
              <ActionCard icon="add-shopping-cart" label="New Sale"  color="#059669" bg="#ECFDF5" onPress={onOpenSales} />
              <ActionCard icon="inventory-2"        label="Add Stock" color="#6366F1" bg="#EEF2FF" onPress={onOpenAddInventory} />
              <ActionCard icon="person-add"         label="Customer" color="#F59E0B" bg="#FEF3C7" onPress={onOpenCustomers} />
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
              <PulseCard icon="payments" label="Collected" value={fmt(salesSummary.totalRevenue)} color="#10B981" bg="#ECFDF5" />
              <PulseCard icon="schedule" label="Pending"   value={fmt(customerSummary.totalDue)}  color="#EF4444" bg="#FEF2F2" />
            </View>
          </View>
        </Animated.View>

      </ScrollView>
    </AppLayout>
  );
};

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