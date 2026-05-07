import { useQueryClient } from "@tanstack/react-query";
import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,

} from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppLayout } from "../components/AppLayout";
import { SkeletonProductRow } from "../components/Skeleton";
import { useProductsData } from "../hooks/useProductsData";
import { useDebounce } from "../hooks/useDebounce";
import { deleteProduct, fetchProducts } from "../lib/api";
import { queryKeys } from "../lib/query";
import { useAuth } from "../providers/AuthProvider";
import type { Product } from "../types/product";
import type { AppRoute } from "../types/navigation";

type InventoryPageProps = {
  onBack: () => void;
  onAddInventory: () => void;
  onOpenProduct: (productId: string) => void;
  onNavigate: (route: AppRoute) => void;
};

type IconName = ComponentProps<typeof MaterialIcons>["name"];

const fmt = (v: number) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const STOCK = {
  out: { label: "Out",     badge: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     qty: "text-red-600" },
  low: { label: "Low",     badge: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   qty: "text-amber-600" },
  ok:  { label: "In Stock", badge: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", qty: "text-emerald-700" },
} as const;

const stockOf = (q: number, min: number) => q === 0 ? STOCK.out : q <= min ? STOCK.low : STOCK.ok;

const initials = (n: string) => n.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");

export const InventoryPage = ({ onNavigate, onOpenProduct }: InventoryPageProps) => {
  const { session } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const debouncedSearch = useDebounce(search);
  const { error, isLoading, isRefreshing, pagination, products, refetch, summary } =
    useProductsData({ page, limit: 10, category, search: debouncedSearch, lowStockOnly });

  const handleDelete = (product: Product, close: () => void) => {
    Alert.alert("Delete Product", `Delete ${product.name}? This cannot be undone.`, [
      { text: "Cancel", style: "cancel", onPress: close },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const token = session?.tokens.accessToken;
          if (!token) { close(); return; }
          close();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          try {
            await deleteProduct(token, product.id);
            await Promise.all([
              qc.invalidateQueries({ queryKey: queryKeys.products.all }),
              qc.invalidateQueries({ queryKey: queryKeys.products.detail(product.id) }),
              qc.invalidateQueries({ queryKey: queryKeys.products.movements(product.id) }),
              qc.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
            ]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Toast.show({ type: "success", text1: "Deleted", text2: `${product.name} removed.` });
          } catch (err) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Toast.show({ type: "error", text1: "Delete Failed", text2: err instanceof Error ? err.message : "" });
          }
        },
      },
    ]);
  };


  // Stock health percentage
  const healthPct = summary.totalProducts > 0
    ? Math.round(((summary.totalProducts - summary.lowStockCount - summary.outOfStockCount) / summary.totalProducts) * 100)
    : 100;

  const ListHeader = () => (
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
                  <MaterialIcons name="inventory-2" size={16} color="#818CF8" />
                </View>
                <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Inventory Value
                </Text>
              </View>
              {summary.lowStockCount > 0 && (
                <View className="flex-row items-center gap-1 bg-red-500/15 rounded-full px-2.5 py-1">
                  <MaterialIcons name="warning" size={11} color="#F87171" />
                  <Text className="text-[10px] font-bold text-red-400">
                    {summary.lowStockCount} low
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-[34px] font-bold text-white tracking-tight">{fmt(summary.totalValue)}</Text>
            <Text className="text-[13px] text-slate-500 mt-1">
              {summary.totalProducts} products · {summary.categories.length} categories
            </Text>
          </View>

          {/* Bottom metrics */}
          <View className="flex-row border-t border-white/5">
            <View className="flex-1 py-3.5 px-3 items-center border-r border-white/5">
              <MaterialIcons name="payments" size={14} color="#F59E0B" style={{ marginBottom: 4 }} />
              <Text className="text-[14px] font-bold text-white" numberOfLines={1}>{fmt(summary.totalCostValue)}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Cost</Text>
            </View>
            <View className="flex-1 py-3.5 px-3 items-center border-r border-white/5">
              <MaterialIcons name="trending-up" size={14} color={summary.projectedProfit >= 0 ? "#34D399" : "#F87171"} style={{ marginBottom: 4 }} />
              <Text className="text-[14px] font-bold text-white" numberOfLines={1}>{fmt(summary.projectedProfit)}</Text>
              <Text className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Profit</Text>
            </View>
            <View className="flex-1 py-3.5 px-3 items-center">
              <MaterialIcons name="favorite" size={14} color="#60A5FA" style={{ marginBottom: 4 }} />
              <Text className="text-[14px] font-bold text-white">{healthPct}%</Text>
              <Text className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Health</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* ─── Stock Health Bar ─── */}
      {summary.totalProducts > 0 && (
        <Animated.View entering={FadeInDown.duration(400).delay(80)}>
          <View className="flex-row gap-3 mb-4">
            <HealthPill icon="check-circle" label="In Stock" count={summary.totalProducts - summary.lowStockCount - summary.outOfStockCount} color="#10B981" bg="#ECFDF5" />
            <HealthPill icon="warning" label="Low" count={summary.lowStockCount} color="#F59E0B" bg="#FEF3C7" />
            <HealthPill icon="cancel" label="Out" count={summary.outOfStockCount} color="#EF4444" bg="#FEE2E2" />
          </View>
        </Animated.View>
      )}


      {/* ─── Search & Filters ─── */}
      <Animated.View entering={FadeInDown.duration(400).delay(160)}>
        <View className="bg-white rounded-2xl border border-zinc-100 p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 gap-2 mb-3">
            <MaterialIcons name="search" size={17} color="#94A3B8" />
            <TextInput
              value={search}
              onChangeText={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search products…"
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
            <Chip active={category === "" && !lowStockOnly} label="All" onPress={() => { setCategory(""); setLowStockOnly(false); setPage(1); }} />
            {summary.categories.slice(0, 4).map((c) => (
              <Chip key={c.category} active={category === c.category} label={c.category} onPress={() => { setCategory(c.category); setPage(1); }} />
            ))}
            <Chip active={lowStockOnly} label="⚠ Low Stock" onPress={() => { setLowStockOnly((c) => !c); setPage(1); }} />
          </View>
        </View>
      </Animated.View>

      {/* ─── Product List Header ─── */}
      <View className="flex-row justify-between items-center mb-2 px-1">
        <Text className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Products</Text>
        <Text className="text-[11px] text-slate-400">{pagination.total ?? products.length} items</Text>
      </View>
    </>
  );

  const ListEmpty = () => {
    if (isLoading) return (
      <View className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonProductRow key={i} />)}
      </View>
    );
    if (error) return (
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
    );
    return (
      <View className="bg-white rounded-2xl border border-zinc-100 items-center px-5 py-14">
        <View className="h-14 w-14 rounded-2xl bg-slate-50 items-center justify-center mb-3">
          <MaterialIcons name="inventory-2" size={24} color="#94A3B8" />
        </View>
        <Text className="text-slate-700 font-semibold text-[14px]">No products found</Text>
        <Text className="text-slate-400 text-[12px] mt-1">Adjust your search or filters</Text>
      </View>
    );
  };

  const ListFooter = () => (
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

  const renderItem = ({ item: product, index }: { item: Product; index: number }) => {
    const stock = stockOf(product.quantity, product.minimumQuantity);
    const isFirst = index === 0;
    const isLast = index === products.length - 1;

    return (
      <Swipeable
        overshootRight={false}
        friction={2}
        rightThreshold={36}
        renderRightActions={(_, __, swipeable) => (
          <View className={`overflow-hidden bg-red-500 ${isLast ? "rounded-br-2xl" : ""}`}>
            <Pressable
              onPress={() => handleDelete(product, () => swipeable.close())}
              android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: false }}
              className="h-full w-[80px] items-center justify-center gap-1"
            >
              <MaterialIcons name="delete-outline" size={18} color="#fff" />
              <Text className="text-[10px] font-semibold text-white">Delete</Text>
            </Pressable>
          </View>
        )}
      >
        <Pressable
          onPress={() => onOpenProduct(product.id)}
          android_ripple={{ color: "rgba(0,0,0,0.04)", borderless: false }}
          className={`bg-white active:bg-slate-50 px-4 ${isFirst ? "rounded-t-2xl border-t" : ""} ${isLast ? "rounded-b-2xl border-b" : ""} border-l border-r border-zinc-100`}
        >
          <View className="flex-row items-center gap-3 py-3.5">
            {/* Avatar */}
            <View className="h-11 w-11 rounded-xl bg-slate-900 items-center justify-center flex-shrink-0">
              <Text className="text-[11px] font-bold text-white">{initials(product.name)}</Text>
            </View>

            {/* Info */}
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-0.5">
                <Text className="text-[14px] font-semibold text-slate-900 flex-shrink" numberOfLines={1}>
                  {product.name}
                </Text>
                <View className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${stock.badge}`}>
                  <View className={`w-1.5 h-1.5 rounded-full ${stock.dot}`} />
                  <Text className={`text-[9px] font-bold ${stock.text}`}>{stock.label}</Text>
                </View>
              </View>
              <Text className="text-[11px] text-slate-400">{product.category}</Text>
            </View>

            {/* Price + qty */}
            <View className="items-end">
              <Text className="text-[14px] font-bold text-slate-900">{fmt(product.price)}</Text>
              <Text className={`text-[11px] font-semibold mt-0.5 ${stock.qty}`}>
                {product.quantity} pcs
              </Text>
            </View>

            <MaterialIcons name="chevron-right" size={18} color="#d4d4d8" style={{ marginLeft: 2 }} />
          </View>
          {!isLast && <View className="h-px bg-slate-50" />}
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <AppLayout currentRoute="inventory" eyebrow="Stock" title="Inventory Atlas" subtitle="Monitor stock health, value and product flow." onNavigate={onNavigate}>
      <FlatList
        data={isLoading ? [] : products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        ListFooterComponent={<ListFooter />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
        contentContainerClassName="px-4 pb-32 pt-2"
        showsVerticalScrollIndicator={false}
      />
    </AppLayout>
  );
};

// ── Health Pill ──────────────────────────────────────────────────
const HealthPill = ({ icon, label, count, color, bg }: { icon: IconName; label: string; count: number; color: string; bg: string }) => (
  <View className="flex-1 bg-white rounded-2xl border border-slate-100 py-3 px-3 items-center" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 }}>
    <View className="h-8 w-8 rounded-lg items-center justify-center mb-1.5" style={{ backgroundColor: bg }}>
      <MaterialIcons name={icon} size={15} color={color} />
    </View>
    <Text className="text-[16px] font-bold text-slate-900">{count}</Text>
    <Text className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{label}</Text>
  </View>
);

// ── Filter Chip ─────────────────────────────────────────────────
const Chip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: true }}
    className={`rounded-full px-3.5 py-1.5 border ${active ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"}`}
  >
    <Text className={`text-[12px] font-semibold ${active ? "text-white" : "text-slate-500"}`}>{label}</Text>
  </Pressable>
);