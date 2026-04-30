import { MaterialIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppLayout } from "../components/AppLayout";
import { FormBottomSheet } from "../components/FormBottomSheet";
import { SubmitOverlay } from "../components/SubmitOverlay";
import { fetchProduct, updateProduct } from "../lib/api";
import { queryKeys } from "../lib/query";
import { useAuth } from "../providers/AuthProvider";
import { useCreateProduct } from "../hooks/useProductsData";
import type { AppRoute } from "../types/navigation";

type AddInventoryPageProps = {
  productId?: string;
  onBackToInventory: () => void;
  onCreated: (productId?: string) => void;
  onNavigate: (route: AppRoute) => void;
  onRequestClose?: () => void;
  presentation?: "screen" | "sheet";
};

type FormState = {
  name: string;
  category: string;
  sku: string;
  costPrice: string;
  price: string;
  quantity: string;
  minimumQuantity: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;
type FormTouched = Partial<Record<keyof FormState, boolean>>;

const initialForm: FormState = { name: "", category: "", sku: "", costPrice: "", price: "", quantity: "", minimumQuantity: "" };

const generateSku = (name: string) => {
  if (!name.trim()) return "";
  const prefix = name.trim().split(/\s+/).map((p) => p[0]).join("").toUpperCase().slice(0, 3);
  return `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
};

const validateField = (name: keyof FormState, value: string): string | undefined => {
  switch (name) {
    case "name": return value.trim() ? undefined : "Product name is required";
    case "category": return value.trim() ? undefined : "Category is required";
    case "costPrice": {
      if (!value.trim()) return "Cost price is required";
      const n = Number(value);
      return Number.isNaN(n) || n < 0 ? "Enter a valid positive number" : undefined;
    }
    case "price": {
      if (!value.trim()) return "Selling price is required";
      const n = Number(value);
      return Number.isNaN(n) || n < 0 ? "Enter a valid positive number" : undefined;
    }
    case "quantity": {
      if (!value.trim()) return "Stock quantity is required";
      const n = Number(value);
      return Number.isNaN(n) || !Number.isInteger(n) || n < 0 ? "Enter a valid non-negative integer" : undefined;
    }
    case "minimumQuantity": {
      if (!value.trim()) return "Low alert quantity is required";
      const n = Number(value);
      return Number.isNaN(n) || !Number.isInteger(n) || n < 0 ? "Enter a valid non-negative integer" : undefined;
    }
    default: return undefined;
  }
};

export const AddInventoryPage = ({
  productId,
  onBackToInventory,
  onCreated,
  onNavigate,
  onRequestClose,
  presentation = "screen",
}: AddInventoryPageProps) => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { createProduct, error: createError, isLoading } = useCreateProduct();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(productId));

  useEffect(() => {
    const token = session?.tokens.accessToken;
    if (!productId || !token) { setIsBootstrapping(false); return; }
    fetchProduct(token, productId)
      .then((product) => {
        setForm({
          name: product.name, category: product.category, sku: product.sku ?? "",
          costPrice: String(product.costPrice), price: String(product.price),
          quantity: String(product.quantity), minimumQuantity: String(product.minimumQuantity),
        });
      })
      .catch((err) => setErrors({ name: err instanceof Error ? err.message : "Failed to load" }))
      .finally(() => setIsBootstrapping(false));
  }, [productId, session?.tokens.accessToken]);

  const handleChange = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  useEffect(() => {
    if (!isLoading) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [isLoading]);

  const handleBlur = (name: keyof FormState, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async () => {
    const required: (keyof FormState)[] = ["name", "category", "costPrice", "price", "quantity", "minimumQuantity"];
    const newErrors: FormErrors = {};
    const newTouched: FormTouched = {};
    for (const field of required) {
      newTouched[field] = true;
      const err = validateField(field, form[field]);
      if (err) newErrors[field] = err;
    }
    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    if (Object.keys(newErrors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const name = form.name.trim();
    const payload = {
      name,
      category: form.category.trim(),
      sku: form.sku.trim() || generateSku(name),
      costPrice: Number(form.costPrice),
      price: Number(form.price),
      quantity: Number(form.quantity),
      minimumQuantity: Number(form.minimumQuantity),
    };

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (productId) {
        const token = session?.tokens.accessToken;
        if (!token) { setErrors({ name: "Session expired" }); return; }
        await updateProduct(token, productId, payload);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
          queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) }),
          queryClient.invalidateQueries({ queryKey: queryKeys.products.movements(productId) }),
          queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
        ]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({ type: "success", text1: "Product Updated", text2: `${name} has been saved.` });
        onCreated(productId);
        return;
      }
      const product = await createProduct(payload);
      setForm(initialForm);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: "success", text1: "Product Added! 🎉", text2: `${name} is now in your inventory.` });
      onCreated(product.id);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: "error", text1: "Save Failed", text2: "Could not save. Try again." });
    }
  };

  const closeHandler = onRequestClose ?? onBackToInventory;
  const isEdit = Boolean(productId);

  // Profit preview
  const costVal = Number(form.costPrice) || 0;
  const priceVal = Number(form.price) || 0;
  const qtyVal = Number(form.quantity) || 0;
  const margin = priceVal > 0 ? Math.round(((priceVal - costVal) / priceVal) * 100) : 0;

  const content = (
    <>
      {/* ─── Header ─── */}
      <Animated.View entering={FadeInDown.duration(400).delay(0)}>
        <View className="mb-5 flex-row items-center gap-4">
          {presentation === "screen" && (
            <Pressable
              onPress={onBackToInventory}
              android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: false }}
              className="h-10 w-10 rounded-xl bg-slate-100 items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={20} color="#334155" />
            </Pressable>
          )}
          <View className="flex-1">
            <Text className="text-[22px] font-bold text-slate-900 tracking-tight">
              {isEdit ? "Edit Product" : "New Product"}
            </Text>
            <Text className="text-[13px] text-slate-400 mt-0.5">
              {isEdit ? "Update product details" : "Add a new item to inventory"}
            </Text>
          </View>
          <View
            className="h-12 w-12 rounded-2xl items-center justify-center"
            style={{ backgroundColor: isEdit ? "#FEF3C7" : "#EEF2FF" }}
          >
            <MaterialIcons name={isEdit ? "edit" : "inventory-2"} size={22} color={isEdit ? "#F59E0B" : "#6366F1"} />
          </View>
        </View>
      </Animated.View>

      {createError && (
        <View className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 flex-row items-center gap-2">
          <MaterialIcons name="error" size={16} color="#EF4444" />
          <Text className="text-[13px] text-red-600 flex-1">{createError}</Text>
        </View>
      )}

      {isBootstrapping ? (
        <View className="items-center py-20">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-slate-400 text-[13px] mt-3">Loading product...</Text>
        </View>
      ) : (
        <>
          {/* ─── Product Details Section ─── */}
          <Animated.View entering={FadeInDown.duration(400).delay(80)}>
            <SectionLabel icon="info" color="#6366F1" bg="#EEF2FF" label="Product Details" />
            <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
              <Field label="Product Name" icon="inventory-2" placeholder="e.g. Wireless Mouse" value={form.name} error={errors.name}
                onChangeText={(v) => handleChange("name", v)} onBlur={() => handleBlur("name", form.name)} />
              <Field label="Category" icon="category" placeholder="e.g. Electronics" value={form.category} error={errors.category}
                onChangeText={(v) => handleChange("category", v)} onBlur={() => handleBlur("category", form.category)} />
              <View className="flex-row items-end gap-3">
                <View className="flex-1">
                  <Field label="SKU" icon="qr-code" placeholder="Auto-generated" value={form.sku}
                    onChangeText={(v) => handleChange("sku", v)} onBlur={() => handleBlur("sku", form.sku)} />
                </View>
                <Pressable
                  onPress={() => setForm((c) => ({ ...c, sku: generateSku(c.name) }))}
                  android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
                  className="h-[52px] px-4 rounded-xl bg-slate-900 items-center justify-center flex-row gap-2 mb-4"
                >
                  <MaterialIcons name="auto-fix-high" size={16} color="#fff" />
                  <Text className="text-white text-[12px] font-bold">Generate</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* ─── Pricing Section ─── */}
          <Animated.View entering={FadeInDown.duration(400).delay(160)}>
            <SectionLabel icon="payments" color="#F59E0B" bg="#FEF3C7" label="Pricing" />
            <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Field label="Cost Price" icon="currency-rupee" keyboardType="decimal-pad" placeholder="0" value={form.costPrice} error={errors.costPrice}
                    onChangeText={(v) => handleChange("costPrice", v)} onBlur={() => handleBlur("costPrice", form.costPrice)} />
                </View>
                <View className="flex-1">
                  <Field label="Selling Price" icon="sell" keyboardType="decimal-pad" placeholder="0" value={form.price} error={errors.price}
                    onChangeText={(v) => handleChange("price", v)} onBlur={() => handleBlur("price", form.price)} />
                </View>
              </View>
              {/* Margin indicator */}
              {priceVal > 0 && (
                <View className={`flex-row items-center gap-2 px-3 py-2.5 rounded-xl ${margin >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                  <MaterialIcons name={margin >= 0 ? "trending-up" : "trending-down"} size={16} color={margin >= 0 ? "#10B981" : "#EF4444"} />
                  <Text className={`text-[12px] font-bold ${margin >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                    {margin}% margin · ₹{(priceVal - costVal).toFixed(0)} profit/unit
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* ─── Stock Section ─── */}
          <Animated.View entering={FadeInDown.duration(400).delay(240)}>
            <SectionLabel icon="inventory" color="#10B981" bg="#ECFDF5" label="Stock Levels" />
            <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Field label="Current Stock" icon="inventory" keyboardType="number-pad" placeholder="0" value={form.quantity} error={errors.quantity}
                    onChangeText={(v) => handleChange("quantity", v)} onBlur={() => handleBlur("quantity", form.quantity)} />
                </View>
                <View className="flex-1">
                  <Field label="Low Alert At" icon="warning" keyboardType="number-pad" placeholder="0" value={form.minimumQuantity} error={errors.minimumQuantity}
                    onChangeText={(v) => handleChange("minimumQuantity", v)} onBlur={() => handleBlur("minimumQuantity", form.minimumQuantity)} />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ─── Live Preview ─── */}
          <Animated.View entering={FadeInDown.duration(400).delay(320)}>
            <View
              className="rounded-2xl overflow-hidden mb-5"
              style={{ backgroundColor: "#0F172A", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 }}
            >
              <View className="px-5 pt-5 pb-4">
                <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-[3px] mb-3">Live Preview</Text>
                <Text className="text-[22px] font-bold text-white tracking-tight" numberOfLines={1}>
                  {form.name || "Product Name"}
                </Text>
                <Text className="text-[13px] text-slate-400 mt-1">{form.category || "Category"}</Text>
              </View>
              <View className="flex-row border-t border-white/5">
                <PreviewPill label="Price" value={`₹${form.price || "0"}`} />
                <PreviewPill label="Stock" value={`${form.quantity || "0"} pcs`} />
                <PreviewPill label="Margin" value={`${margin}%`} />
              </View>
            </View>
          </Animated.View>

          {/* ─── Submit Button ─── */}
          <Animated.View entering={FadeInDown.duration(400).delay(400)}>
            <Pressable
              onPress={handleSubmit}
              disabled={isLoading}
              android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: false }}
              className={`flex-row items-center justify-center gap-2.5 rounded-2xl py-4.5 ${isLoading ? "bg-slate-300" : "bg-slate-900"}`}
              style={{ paddingVertical: 18, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 }}
            >
              {isLoading ? (
                <ActivityIndicator size={18} color="#fff" />
              ) : (
                <MaterialIcons name={isEdit ? "save" : "add-circle"} size={20} color="#fff" />
              )}
              <Text className="text-[16px] font-bold text-white">
                {isLoading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
              </Text>
            </Pressable>
          </Animated.View>
        </>
      )}
    </>
  );

  const formBody = presentation === "sheet" ? (
    <View className="px-5 pb-16 pt-2">{content}</View>
  ) : (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pt-3 pb-36"
      >
        {content}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  if (presentation === "sheet") {
    return (
      <FormBottomSheet
        title={isEdit ? "Edit Inventory" : "Add Inventory"}
        subtitle="Update stock data without leaving the current screen."
        onClose={closeHandler}
      >
        <SubmitOverlay visible={isLoading} message={isEdit ? "Updating..." : "Adding product..."} />
        {formBody}
      </FormBottomSheet>
    );
  }

  return (
    <AppLayout currentRoute="addInventory" onNavigate={onNavigate} title={isEdit ? "Edit Inventory" : "Add Inventory"} subtitle="Manage products professionally." eyebrow={isEdit ? "Edit" : "Create"}>
      <SubmitOverlay visible={isLoading} message={isEdit ? "Updating..." : "Adding product..."} />
      {formBody}
    </AppLayout>
  );
};

// ── Section Label ────────────────────────────────────────────────
const SectionLabel = ({ icon, color, bg, label }: { icon: ComponentProps<typeof MaterialIcons>["name"]; color: string; bg: string; label: string }) => (
  <View className="flex-row items-center gap-2 mb-3 ml-1">
    <View className="h-6 w-6 rounded-md items-center justify-center" style={{ backgroundColor: bg }}>
      <MaterialIcons name={icon} size={13} color={color} />
    </View>
    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</Text>
  </View>
);

// ── Field ────────────────────────────────────────────────────────
const Field = ({
  label, icon, keyboardType = "default", placeholder, value, error, onChangeText, onBlur,
}: {
  label: string;
  icon: ComponentProps<typeof MaterialIcons>["name"];
  keyboardType?: "default" | "decimal-pad" | "number-pad";
  placeholder: string;
  value: string;
  error?: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
}) => (
  <View className="mb-4">
    <Text className="mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">{label}</Text>
    <View className={`h-[52px] flex-row items-center rounded-xl border px-3.5 ${error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50"}`}>
      <MaterialIcons name={icon} size={17} color={error ? "#EF4444" : "#94A3B8"} />
      <TextInput
        className="flex-1 pl-2.5 text-[15px] text-slate-900"
        placeholder={placeholder}
        placeholderTextColor="#CBD5E1"
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
      />
    </View>
    {error && (
      <View className="flex-row items-center gap-1 mt-1 ml-1">
        <MaterialIcons name="error" size={11} color="#EF4444" />
        <Text className="text-red-500 text-[10px] font-medium">{error}</Text>
      </View>
    )}
  </View>
);

// ── Preview Pill ─────────────────────────────────────────────────
const PreviewPill = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-1 py-3 px-3 items-center border-r border-white/5">
    <Text className="text-[13px] font-bold text-white" numberOfLines={1}>{value}</Text>
    <Text className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider mt-1">{label}</Text>
  </View>
);
