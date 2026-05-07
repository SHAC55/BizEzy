import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

type ResetPasswordPageProps = {
  form: ResetPasswordForm;
  isBusy: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onChangeForm: (updater: (current: ResetPasswordForm) => ResetPasswordForm) => void;
  onSubmit: () => void;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
};

export const ResetPasswordPage = ({
  form,
  isBusy,
  showPassword,
  showConfirmPassword,
  onChangeForm,
  onSubmit,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
}: ResetPasswordPageProps) => (
  <View>
    <Field
      icon="lock"
      label="New Password"
      placeholder="Enter new password"
      secureTextEntry={!showPassword}
      trailing={
        <Pressable onPress={onTogglePasswordVisibility} hitSlop={10}>
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={20}
            color="#9ca3af"
          />
        </Pressable>
      }
      value={form.password}
      onChangeText={(value) =>
        onChangeForm((current) => ({ ...current, password: value }))
      }
    />

    <Field
      icon="lock"
      label="Confirm Password"
      placeholder="Confirm new password"
      secureTextEntry={!showConfirmPassword}
      trailing={
        <Pressable onPress={onToggleConfirmPasswordVisibility} hitSlop={10}>
          <MaterialIcons
            name={showConfirmPassword ? "visibility" : "visibility-off"}
            size={20}
            color="#9ca3af"
          />
        </Pressable>
      }
      value={form.confirmPassword}
      onChangeText={(value) =>
        onChangeForm((current) => ({ ...current, confirmPassword: value }))
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
        {isBusy ? "Resetting..." : "Reset password"}
      </Text>
    </Pressable>
  </View>
);

const Field = ({
  icon,
  label,
  onChangeText,
  placeholder,
  secureTextEntry,
  trailing,
  value,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  trailing?: React.ReactNode;
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
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry}
        value={value}
      />
      {trailing ? trailing : null}
    </View>
  </View>
);
