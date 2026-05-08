import { MaterialIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppLayout } from "../components/AppLayout";
import { fetchService, updateService } from "../lib/api";
import { queryKeys } from "../lib/query";
import { useAuth } from "../providers/AuthProvider";
import { useCreateService } from "../hooks/useServicesData";
import type { AppRoute } from "../types/navigation";
import type { CreateServicePayload } from "../types/service";

type IconName = ComponentProps<typeof MaterialIcons>["name"];

type AddServicePageProps = {
  serviceId?: string;
  onBack: () => void;
  onCreated: (serviceId?: string) => void;
  onNavigate: (route: AppRoute) => void;
};

type FormState = {
  name: string;
  category: string;
  code: string;
  description: string;
  costPrice: string;
  price: string;
  durationMinutes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  category: "",
  code: "",
  description: "",
  costPrice: "",
  price: "",
  durationMinutes: "",
};

const generateCode = (name: string) => {
  if (!name.trim()) return "";
  const prefix = name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 6);
  return `SVC-${prefix || "SVC"}-${Math.floor(100 + Math.random() * 900)}`;
};

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Service name is required";

  if (!form.price.trim()) errors.price = "Selling price is required";
  else if (Number.isNaN(Number(form.price)) || Number(form.price) < 0)
    errors.price = "Enter a valid positive number";

  if (form.costPrice.trim()) {
    const n = Number(form.costPrice);
    if (Number.isNaN(n) || n < 0)
      errors.costPrice = "Enter a valid non-negative number";
  }

  if (form.durationMinutes.trim()) {
    const n = Number(form.durationMinutes);
    if (Number.isNaN(n) || !Number.isInteger(n) || n < 0 || n > 1440)
      errors.durationMinutes = "Enter minutes between 0 and 1440";
  }

  return errors;
};

export const AddServicePage = ({
  serviceId,
  onBack,
  onCreated,
  onNavigate,
}: AddServicePageProps) => {
  const { session } = useAuth();
  const qc = useQueryClient();
  const isEdit = Boolean(serviceId);

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEdit);

  const { createService } = useCreateService();

  useEffect(() => {
    if (!serviceId) return;
    const token = session?.tokens.accessToken;
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchService(token, serviceId);
        if (cancelled) return;
        setForm({
          name: data.name ?? "",
          category: data.category ?? "",
          code: data.code ?? "",
          description: data.description ?? "",
          costPrice: data.costPrice != null ? String(data.costPrice) : "",
          price: data.price != null ? String(data.price) : "",
          durationMinutes:
            data.durationMinutes != null ? String(data.durationMinutes) : "",
        });
      } finally {
        if (!cancelled) setLoadingExisting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [serviceId, session?.tokens.accessToken]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (!isEdit && key === "name" && !prev.code) {
        next.code = generateCode(value);
      }
      return next;
    });
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const token = session?.tokens.accessToken;
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Session expired",
        text2: "Please sign in again.",
      });
      return;
    }

    const v = validate(form);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    const payload: CreateServicePayload = {
      name: form.name.trim(),
      price: Number(form.price),
      costPrice: form.costPrice.trim() ? Number(form.costPrice) : 0,
    };
    if (form.code.trim()) payload.code = form.code.trim();
    if (form.category.trim()) payload.category = form.category.trim();
    if (form.description.trim())
      payload.description = form.description.trim();
    if (form.durationMinutes.trim())
      payload.durationMinutes = Number(form.durationMinutes);

    setSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (isEdit && serviceId) {
        await updateService(token, serviceId, payload);
        await Promise.all([
          qc.invalidateQueries({ queryKey: queryKeys.services.all }),
          qc.invalidateQueries({
            queryKey: queryKeys.services.detail(serviceId),
          }),
        ]);
        Toast.show({
          type: "success",
          text1: "Service updated",
          text2: payload.name,
        });
        onCreated(serviceId);
      } else {
        const created = await createService(payload);
        Toast.show({
          type: "success",
          text1: "Service added",
          text2: payload.name,
        });
        onCreated(created.id);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: "error",
        text1: isEdit ? "Update failed" : "Create failed",
        text2: err instanceof Error ? err.message : "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      currentRoute="inventory"
      title={isEdit ? "Edit Service" : "New Service"}
      subtitle={
        isEdit ? "Update service details" : "Define a service you offer"
      }
      onNavigate={onNavigate}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-32 pt-3"
        >
          <Animated.View entering={FadeInDown.duration(400)}>
            <View className="mb-5 flex-row items-center gap-4">
              <Pressable
                onPress={onBack}
                className="h-10 w-10 rounded-xl bg-slate-100 items-center justify-center"
              >
                <MaterialIcons name="arrow-back" size={20} color="#334155" />
              </Pressable>
              <View className="flex-1">
                <Text className="text-[22px] font-bold text-slate-900 tracking-tight">
                  {isEdit ? "Edit Service" : "New Service"}
                </Text>
                <Text className="text-[13px] text-slate-400 mt-0.5">
                  {isEdit
                    ? "Update name, pricing or details"
                    : "Pricing, duration and description"}
                </Text>
              </View>
              <View className="h-12 w-12 rounded-2xl bg-indigo-50 items-center justify-center">
                <MaterialIcons name="build" size={22} color="#6366F1" />
              </View>
            </View>
          </Animated.View>

          {loadingExisting ? (
            <View className="items-center py-12">
              <ActivityIndicator size="small" color="#0F172A" />
            </View>
          ) : (
            <Animated.View entering={FadeInDown.duration(400).delay(80)}>
              <Card>
                <Field
                  label="Service name"
                  icon="build"
                  value={form.name}
                  onChangeText={(v) => updateField("name", v)}
                  placeholder="e.g. Haircut, Phone repair"
                  error={errors.name}
                />

                <Field
                  label="Category (optional)"
                  icon="category"
                  value={form.category}
                  onChangeText={(v) => updateField("category", v)}
                  placeholder="e.g. Salon, Repair"
                />

                <View>
                  <Text className="text-[10px] font-semibold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">
                    Service Code
                  </Text>
                  <View className="flex-row gap-2">
                    <View className="flex-1 flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 gap-2">
                      <MaterialIcons name="qr-code" size={15} color="#94A3B8" />
                      <TextInput
                        value={form.code}
                        onChangeText={(v) => updateField("code", v)}
                        placeholder="Auto-generated"
                        placeholderTextColor="#CBD5E1"
                        autoCapitalize="characters"
                        className="flex-1 text-[14px] text-slate-900"
                      />
                    </View>
                    <Pressable
                      onPress={() =>
                        updateField("code", generateCode(form.name))
                      }
                      className="px-3.5 rounded-xl bg-slate-100 items-center justify-center"
                    >
                      <MaterialIcons name="autorenew" size={18} color="#334155" />
                    </Pressable>
                  </View>
                  <Text className="text-[11px] text-slate-400 mt-1.5 ml-1">
                    Unique identifier for this service
                  </Text>
                </View>

                <View>
                  <Text className="text-[10px] font-semibold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">
                    Description (optional)
                  </Text>
                  <View className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3">
                    <TextInput
                      value={form.description}
                      onChangeText={(v) => updateField("description", v)}
                      placeholder="What's included in this service?"
                      placeholderTextColor="#CBD5E1"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      className="text-[14px] text-slate-900 min-h-[60px]"
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Field
                      label="Cost price"
                      icon="attach-money"
                      value={form.costPrice}
                      onChangeText={(v) => updateField("costPrice", v)}
                      placeholder="0"
                      keyboardType="decimal-pad"
                      error={errors.costPrice}
                    />
                  </View>
                  <View className="flex-1">
                    <Field
                      label="Selling price"
                      icon="sell"
                      value={form.price}
                      onChangeText={(v) => updateField("price", v)}
                      placeholder="0"
                      keyboardType="decimal-pad"
                      error={errors.price}
                    />
                  </View>
                </View>

                <Field
                  label="Duration (minutes)"
                  icon="schedule"
                  value={form.durationMinutes}
                  onChangeText={(v) => updateField("durationMinutes", v)}
                  placeholder="e.g. 30"
                  keyboardType="number-pad"
                  error={errors.durationMinutes}
                />
              </Card>

              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: false }}
                className={`mt-5 flex-row items-center justify-center gap-2.5 rounded-2xl ${submitting ? "bg-slate-300" : "bg-slate-900"}`}
                style={{
                  paddingVertical: 18,
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MaterialIcons name="check-circle" size={20} color="#fff" />
                )}
                <Text className="text-[16px] font-bold text-white">
                  {submitting
                    ? "Saving…"
                    : isEdit
                      ? "Update Service"
                      : "Add Service"}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
};

const Card = ({ children }: { children: React.ReactNode }) => (
  <View
    className="bg-white rounded-2xl border border-slate-100 p-4 mb-2"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
      gap: 14,
    }}
  >
    {children}
  </View>
);

const Field = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  error,
}: {
  label: string;
  icon: IconName;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "decimal-pad" | "number-pad";
  error?: string;
}) => (
  <View>
    <Text className="text-[10px] font-semibold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">
      {label}
    </Text>
    <View
      className={`flex-row items-center bg-slate-50 border rounded-xl px-3.5 py-3 gap-2 ${error ? "border-red-300" : "border-slate-200"}`}
    >
      <MaterialIcons name={icon} size={15} color="#94A3B8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#CBD5E1"
        keyboardType={keyboardType ?? "default"}
        className="flex-1 text-[14px] text-slate-900"
      />
    </View>
    {error ? (
      <Text className="text-[11px] text-red-500 mt-1 ml-1">{error}</Text>
    ) : null}
  </View>
);
