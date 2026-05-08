import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export type ForgotPasswordForm = {
  email: string;
};

type ForgotPasswordPageProps = {
  form: ForgotPasswordForm;
  isBusy: boolean;
  onChangeForm: (updater: (current: ForgotPasswordForm) => ForgotPasswordForm) => void;
  onSubmit: () => void;
};

export const ForgotPasswordPage = ({
  form,
  isBusy,
  onChangeForm,
  onSubmit,
}: ForgotPasswordPageProps) => (
  <View>
    <Field
      icon="mail"
      label="Email"
      placeholder="Enter your email"
      keyboardType="email-address"
      value={form.email}
      onChangeText={(value) =>
        onChangeForm((current) => ({ ...current, email: value }))
      }
    />

    <Pressable
      onPress={onSubmit}
      disabled={isBusy}
      className={`items-center justify-center rounded-[16px] bg-black py-4 ${isBusy ? "opacity-50" : ""}`}
      style={
        isBusy
          ? undefined
          : {
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.18,
              shadowRadius: 20,
              elevation: 8,
            }
      }
    >
      <Text className="text-[15px] font-bold text-white">
        {isBusy ? "Sending..." : "Send reset link"}
      </Text>
    </Pressable>
  </View>
);

const Field = ({
  icon,
  keyboardType = "default",
  label,
  onChangeText,
  placeholder,
  value,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  keyboardType?: "default" | "email-address" | "phone-pad";
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
}) => (
  <View className="mb-4">
    <Text className="mb-2 text-[13px] font-medium text-[#374151]">{label}</Text>
    <View className="flex-row items-center gap-3 rounded-[16px] border border-[#d1d5db] bg-white px-4 py-1">
      <MaterialIcons name={icon} size={20} color="#9ca3af" />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        className="flex-1 py-4 text-[15px] text-[#0f172a]"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
      />
    </View>
  </View>
);
