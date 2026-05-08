import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  BackHandler, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, Text, TextInput, View, ActivityIndicator,
  Animated as RNAnimated, Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import Animated, { FadeInDown, FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";
import { AppLayout } from "../components/AppLayout";
import { FormBottomSheet } from "../components/FormBottomSheet";
import { createCustomer, fetchCustomer, updateCustomer } from "../lib/api";
import { queryKeys } from "../lib/query";
import { useAuth } from "../providers/AuthProvider";
import type { AppRoute } from "../types/navigation";

type IconName = ComponentProps<typeof MaterialIcons>["name"];

type AddCustomerPageProps = {
  customerId?: string;
  onBack: () => void;
  onCreated: (customerId?: string) => void;
  onNavigate: (route: AppRoute) => void;
  onRequestClose?: () => void;
  presentation?: "screen" | "sheet";
};

type FormState = { name: string; mobile: string; address: string };
type FormErrors = Partial<Record<keyof FormState, string>>;
type FormTouched = Partial<Record<keyof FormState, boolean>>;

const initialForm: FormState = { name: "", mobile: "", address: "" };

const validateField = (name: keyof FormState, value: string): string | undefined => {
  switch (name) {
    case "name": return value.trim() ? undefined : "Name is required";
    case "mobile": {
      if (!value.trim()) return "Mobile is required";
      return value.replace(/\D/g, "").length < 10 ? "Enter a valid 10-digit number" : undefined;
    }
    default: return undefined;
  }
};

// ── Save Stage Overlay ───────────────────────────────────────────
type SaveStage = "validating" | "saving" | "syncing" | "done";

const STAGE_CONFIG: Record<SaveStage, { label: string; sub: string; icon: IconName; color: string }> = {
  validating: { label: "Validating",   sub: "Checking your details…",     icon: "fact-check",       color: "#6366F1" },
  saving:     { label: "Saving",       sub: "Writing to your book…",       icon: "save",             color: "#F59E0B" },
  syncing:    { label: "Syncing",      sub: "Refreshing your dashboard…",  icon: "sync",             color: "#10B981" },
  done:       { label: "All done!",    sub: "Customer saved successfully", icon: "check-circle",     color: "#10B981" },
};

const SaveOverlay = ({
  visible,
  stage,
  isEdit,
  customerName,
  initials,
}: {
  visible: boolean;
  stage: SaveStage;
  isEdit: boolean;
  customerName: string;
  initials: string;
}) => {
  const spinAnim = useRef(new RNAnimated.Value(0)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const progressAnim = useRef(new RNAnimated.Value(0)).current;

  const stageOrder: SaveStage[] = ["validating", "saving", "syncing", "done"];
  const stageIndex = stageOrder.indexOf(stage);
  const progress = stageIndex === -1 ? 0 : (stageIndex + 1) / stageOrder.length;

  useEffect(() => {
    if (!visible) return;
    // Spin animation for the icon
    spinAnim.setValue(0);
    const spin = RNAnimated.loop(
      RNAnimated.timing(spinAnim, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })
    );
    spin.start();

    // Pulse on avatar
    const pulse = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 1.08, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1,    duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();

    return () => { spin.stop(); pulse.stop(); };
  }, [visible, stage]);

  useEffect(() => {
    RNAnimated.timing(progressAnim, {
      toValue: progress,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  if (!visible) return null;

  const cfg = STAGE_CONFIG[stage];
  const isDone = stage === "done";
  const spinDeg = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(300)}
      style={{
        position: "absolute", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.88)",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Card */}
      <Animated.View
        entering={ZoomIn.duration(320).springify().damping(14)}
        exiting={ZoomOut.duration(200)}
        style={{
          backgroundColor: "#111111",
          borderRadius: 28,
          padding: 32,
          width: 300,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.07)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 24 },
          shadowOpacity: 0.5,
          shadowRadius: 40,
          elevation: 20,
        }}
      >
        {/* Avatar */}
        <RNAnimated.View
          style={{
            transform: [{ scale: pulseAnim }],
            marginBottom: 20,
          }}
        >
          <View
            style={{
              height: 72, width: 72, borderRadius: 20,
              backgroundColor: isDone ? "#10B981" : "#6366F1",
              alignItems: "center", justifyContent: "center",
              shadowColor: isDone ? "#10B981" : "#6366F1",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.45,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            {customerName.trim() ? (
              <Text style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>{initials}</Text>
            ) : (
              <MaterialIcons name="person" size={32} color="#fff" />
            )}
          </View>

          {/* Spinning ring */}
          {!isDone && (
            <RNAnimated.View
              style={{
                position: "absolute", inset: -6,
                borderRadius: 28,
                borderWidth: 2,
                borderColor: "transparent",
                borderTopColor: cfg.color,
                borderRightColor: `${cfg.color}55`,
                transform: [{ rotate: spinDeg }],
              }}
            />
          )}

          {/* Done checkmark badge */}
          {isDone && (
            <Animated.View
              entering={ZoomIn.duration(300).springify()}
              style={{
                position: "absolute", bottom: -4, right: -4,
                backgroundColor: "#111111",
                borderRadius: 12, padding: 2,
              }}
            >
              <MaterialIcons name="check-circle" size={20} color="#10B981" />
            </Animated.View>
          )}
        </RNAnimated.View>

        {/* Customer name */}
        {customerName.trim() ? (
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff", marginBottom: 2, textAlign: "center" }} numberOfLines={1}>
            {customerName.trim()}
          </Text>
        ) : null}

        {/* Stage label */}
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#fff", marginBottom: 4, textAlign: "center", letterSpacing: -0.4 }}>
          {cfg.label}
        </Text>
        <Text style={{ fontSize: 13, color: "#555", textAlign: "center", marginBottom: 24, lineHeight: 18 }}>
          {cfg.sub}
        </Text>

        {/* Progress bar */}
        <View style={{ width: "100%", height: 4, backgroundColor: "#222", borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
          <RNAnimated.View
            style={{
              height: "100%",
              borderRadius: 4,
              backgroundColor: cfg.color,
              width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
              shadowColor: cfg.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
            }}
          />
        </View>

        {/* Stage dots */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {stageOrder.map((s, i) => {
            const active = i <= stageIndex;
            const current = i === stageIndex;
            return (
              <View
                key={s}
                style={{
                  height: current ? 8 : 6,
                  width: current ? 20 : 6,
                  borderRadius: 4,
                  backgroundColor: active ? cfg.color : "#333",
                  opacity: active ? 1 : 0.5,
                }}
              />
            );
          })}
        </View>

        {/* Step label */}
        <Text style={{ fontSize: 11, color: "#444", marginTop: 12, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" }}>
          Step {Math.min(stageIndex + 1, stageOrder.length)} of {stageOrder.length}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

// ── Main Component ───────────────────────────────────────────────
export const AddCustomerPage = ({
  customerId, onBack, onCreated, onNavigate, onRequestClose, presentation = "screen",
}: AddCustomerPageProps) => {
  const { session } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStage, setSaveStage] = useState<SaveStage>("validating");
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(customerId));
  const isEdit = Boolean(customerId);

  useEffect(() => {
    if (!isLoading) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [isLoading]);

  useEffect(() => {
    const token = session?.tokens.accessToken;
    if (!customerId || !token) { setIsBootstrapping(false); return; }
    fetchCustomer(token, customerId)
      .then((c) => setForm({ name: c.name, mobile: c.mobile, address: c.address ?? "" }))
      .catch(() => setSubmitError("Failed to load customer"))
      .finally(() => setIsBootstrapping(false));
  }, [customerId]);

  const handleChange = (name: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleBlur = (name: keyof FormState, value: string) => {
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleSubmit = async () => {
    const token = session?.tokens.accessToken;
    if (!token) return;
    const required: (keyof FormState)[] = ["name", "mobile"];
    const newErrors: FormErrors = {};
    const newTouched: FormTouched = {};
    for (const f of required) { newTouched[f] = true; const e = validateField(f, form[f]); if (e) newErrors[f] = e; }
    setTouched((p) => ({ ...p, ...newTouched }));
    setErrors((p) => ({ ...p, ...newErrors }));
    if (Object.keys(newErrors).length > 0) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); return; }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const payload = {
      name: form.name.trim(), mobile: form.mobile.trim(),
      address: form.address.trim() || undefined,
    };

    try {
      setIsLoading(true);
      setSaveStage("validating");
      setSubmitError(null);
      await sleep(500); // brief pause on validating so user sees it

      setSaveStage("saving");
      let savedId = customerId;
      if (customerId) {
        await updateCustomer(token, customerId, payload);
      } else {
        const customer = await createCustomer(token, payload);
        savedId = customer.id;
      }

      setSaveStage("syncing");
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.customers.all }),
        customerId && qc.invalidateQueries({ queryKey: queryKeys.customers.detail(customerId) }),
        qc.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
        qc.invalidateQueries({ queryKey: queryKeys.sales.all }),
      ].filter(Boolean));

      await sleep(400);
      setSaveStage("done");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await sleep(900); // let user enjoy the done state

      Toast.show({
        type: "success",
        text1: isEdit ? "Customer Updated ✓" : "Customer Created! 🎉",
        text2: isEdit ? `${payload.name} saved.` : `${payload.name} added to your book.`,
      });
      onCreated(savedId);
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = err?.message || "Failed to save customer";
      setSubmitError(msg);
      Toast.show({ type: "error", text1: "Save Failed", text2: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const closeHandler = onRequestClose ?? onBack;

  const previewInitials = form.name.trim()
    ? form.name.trim().split(" ").map((p) => p[0]?.toUpperCase() || "").join("").slice(0, 2)
    : "?";

  const content = (
    <>
      {/* ─── Header ─── */}
      <Animated.View entering={FadeInDown.duration(400).delay(0)}>
        <View className="mb-5 flex-row items-center gap-4">
          {presentation === "screen" && (
            <Pressable onPress={onBack} className="h-10 w-10 rounded-xl bg-slate-100 items-center justify-center">
              <MaterialIcons name="arrow-back" size={20} color="#334155" />
            </Pressable>
          )}
          <View className="flex-1">
            <Text className="text-[22px] font-bold text-slate-900 tracking-tight">
              {isEdit ? "Edit Customer" : "New Customer"}
            </Text>
            <Text className="text-[13px] text-slate-400 mt-0.5">
              {isEdit ? "Update contact & balance details" : "Add a new customer to your book"}
            </Text>
          </View>
          <View className="h-12 w-12 rounded-2xl items-center justify-center" style={{ backgroundColor: isEdit ? "#FEF3C7" : "#EEF2FF" }}>
            <MaterialIcons name={isEdit ? "edit" : "person-add"} size={22} color={isEdit ? "#F59E0B" : "#6366F1"} />
          </View>
        </View>
      </Animated.View>

      {submitError && (
        <View className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 flex-row items-center gap-2">
          <MaterialIcons name="error" size={16} color="#EF4444" />
          <Text className="text-[13px] text-red-600 flex-1">{submitError}</Text>
        </View>
      )}

      {isBootstrapping ? (
        <View className="items-center py-20">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-slate-400 text-[13px] mt-3">Loading customer...</Text>
        </View>
      ) : (
        <>
          {/* ─── Contact Section ─── */}
          <Animated.View entering={FadeInDown.duration(400).delay(80)}>
            <SectionLabel icon="person" color="#6366F1" bg="#EEF2FF" label="Contact Details" />
            <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
              <Field label="Full Name" icon="person" placeholder="John Doe" value={form.name} error={errors.name}
                onChangeText={(v) => handleChange("name", v)} onBlur={() => handleBlur("name", form.name)} />
              <Field label="Mobile" icon="phone" keyboardType="phone-pad" placeholder="9876543210" value={form.mobile} error={errors.mobile}
                onChangeText={(v) => handleChange("mobile", v)} onBlur={() => handleBlur("mobile", form.mobile)} />
            </View>
          </Animated.View>

          {/* ─── Address Section ─── */}
          <Animated.View entering={FadeInDown.duration(400).delay(160)}>
            <SectionLabel icon="place" color="#F59E0B" bg="#FEF3C7" label="Address" />
            <View className="bg-white rounded-2xl border border-slate-100 p-4 mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 }}>
              <Field label="Address" icon="place" placeholder="Street, City" value={form.address}
                onChangeText={(v) => handleChange("address", v)} onBlur={() => handleBlur("address", form.address)} />
            </View>
          </Animated.View>

          {/* ─── Live Preview ─── */}
          <Animated.View entering={FadeInDown.duration(400).delay(240)}>
            <View
              className="rounded-2xl overflow-hidden mb-5"
              style={{ backgroundColor: "#0F172A", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 }}
            >
              <View className="px-5 py-5 flex-row items-center gap-4">
                <View className="h-14 w-14 rounded-xl items-center justify-center" style={{ backgroundColor: form.name.trim() ? "#6366F1" : "rgba(255,255,255,0.1)" }}>
                  <Text className="text-[18px] font-bold text-white">{previewInitials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[9px] font-bold text-slate-500 uppercase tracking-[3px] mb-1">Preview</Text>
                  <Text className="text-[18px] font-bold text-white tracking-tight" numberOfLines={1}>
                    {form.name.trim() || "Customer Name"}
                  </Text>
                  <Text className="text-[12px] text-slate-400 mt-0.5">{form.mobile || "Mobile number"}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ─── Submit Button ─── */}
          <Animated.View entering={FadeInDown.duration(400).delay(320)}>
            <Pressable
              onPress={handleSubmit}
              disabled={isLoading}
              android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: false }}
              className={`flex-row items-center justify-center gap-2.5 rounded-2xl ${isLoading ? "bg-slate-300" : "bg-slate-900"}`}
              style={{ paddingVertical: 18, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 }}
            >
              <MaterialIcons name={isEdit ? "save" : "person-add"} size={20} color="#fff" />
              <Text className="text-[16px] font-bold text-white">
                {isEdit ? "Update Customer" : "Create Customer"}
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
        automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}
        nestedScrollEnabled keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pt-3 pb-36"
      >
        {content}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  if (presentation === "sheet") {
    return (
      <FormBottomSheet title={isEdit ? "Edit Customer" : "Add Customer"} subtitle="Manage customer details." onClose={closeHandler}>
        <SaveOverlay visible={isLoading} stage={saveStage} isEdit={isEdit} customerName={form.name} initials={previewInitials} />
        {formBody}
      </FormBottomSheet>
    );
  }

  return (
    <AppLayout currentRoute="customers" title={isEdit ? "Edit Customer" : "Add Customer"} subtitle="Manage customer profile" onNavigate={onNavigate}>
      <SaveOverlay visible={isLoading} stage={saveStage} isEdit={isEdit} customerName={form.name} initials={previewInitials} />
      {formBody}
    </AppLayout>
  );
};

// ── Section Label ────────────────────────────────────────────────
const SectionLabel = ({ icon, color, bg, label }: { icon: IconName; color: string; bg: string; label: string }) => (
  <View className="flex-row items-center gap-2 mb-3 ml-1">
    <View className="h-6 w-6 rounded-md items-center justify-center" style={{ backgroundColor: bg }}>
      <MaterialIcons name={icon} size={13} color={color} />
    </View>
    <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</Text>
  </View>
);

// ── Field ────────────────────────────────────────────────────────
const Field = ({
  label, icon, keyboardType = "default", multiline, placeholder, value, error, onChangeText, onBlur,
}: {
  label: string; icon: IconName;
  keyboardType?: "default" | "email-address" | "phone-pad" | "decimal-pad";
  multiline?: boolean; placeholder?: string;
  value: string; error?: string;
  onChangeText: (v: string) => void; onBlur?: () => void;
}) => (
  <View className="mb-4">
    <Text className="mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">{label}</Text>
    <View className={`flex-row items-center rounded-xl border px-3.5 ${multiline ? "items-start" : ""} ${error ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50"}`}>
      <MaterialIcons name={icon} size={17} color={error ? "#EF4444" : "#94A3B8"} style={multiline ? { marginTop: 14 } : undefined} />
      <TextInput
        value={value} onChangeText={onChangeText} onBlur={onBlur}
        keyboardType={keyboardType} multiline={multiline} numberOfLines={multiline ? 3 : 1}
        placeholder={placeholder} placeholderTextColor="#CBD5E1"
        className={`flex-1 pl-2.5 text-[15px] text-slate-900 ${multiline ? "py-3.5 min-h-[80px]" : "py-3.5"}`}
        style={multiline ? { textAlignVertical: "top" } : undefined}
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