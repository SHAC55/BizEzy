import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { authAssets } from "../constants/auth";
import { useAuthPageState } from "../hooks/useAuthPageState";
import { SignInPage } from "./SignInPage";
import { SignUpPage } from "./SignUpPage";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
import { ResetPasswordPage } from "./ResetPasswordPage";
import { SafeAreaView } from "react-native-safe-area-context";

export const AuthPage = () => {
  const {
    error,
    forgotPasswordError,
    forgotPasswordForm,
    forgotPasswordSuccess,
    isApiConfigured,
    isBusy,
    isLogin,
    loginForm,
    mode,
    registerForm,
    rememberMe,
    resetPasswordError,
    resetPasswordForm,
    resetPasswordSuccess,
    setForgotPasswordForm,
    setLoginForm,
    setRegisterForm,
    setResetPasswordForm,
    showLoginPassword,
    showRegisterConfirmPassword,
    showRegisterPassword,
    showResetConfirmPassword,
    showResetPassword,
    submitForgotPassword,
    submitGoogle,
    submitLogin,
    submitRegister,
    submitResetPassword,
    switchMode,
    toggleFooterMode,
    toggleRememberMe,
    toggleRegisterTerms,
    toggleShowLoginPassword,
    toggleShowRegisterConfirmPassword,
    toggleShowRegisterPassword,
    toggleShowResetConfirmPassword,
    toggleShowResetPassword,
  } = useAuthPageState();

  const isForgotPassword = mode === "forgotPassword";
  const isResetPassword = mode === "resetPassword";
  const isAuthFlow = isLogin || mode === "register";

  const heroTitle =
    mode === "login" ? "Welcome Back!" :
    mode === "register" ? "Create Account" :
    mode === "forgotPassword" ? "Forgot Password" :
    "Reset Password";

  const heroSubtitle =
    mode === "login" ? "Ready to take control of your business? Sign in to continue." :
    mode === "register" ? "Join us to streamline your business management." :
    mode === "forgotPassword" ? "Enter your email to receive a password reset link." :
    "Choose a new password for your account.";

  const heroImage = mode === "register" ? authAssets.signupImage : authAssets.loginImage;

  return (
    <SafeAreaView className="flex-1 bg-[#e5e7eb]">
      <StatusBar style="dark" />
      <View className="absolute inset-0 bg-[#f3f4f6]" />
      <View className="absolute left-[-60px] top-[-10px] h-[220px] w-[220px] rounded-full bg-[#dbeafe]" />
      <View className="absolute right-[-90px] bottom-[160px] h-[240px] w-[240px] rounded-full bg-[#e5e7eb]" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerClassName="px-4 pb-10 pt-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="overflow-hidden rounded-[28px] bg-white"
            style={{
              shadowColor: "#111827",
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.16,
              shadowRadius: 32,
              elevation: 12,
            }}
          >
            <View className="h-[230px]">
              <ImageBackground
                source={heroImage}
                resizeMode="cover"
                className="flex-1 justify-between"
              >
                <View className="absolute inset-0 bg-black/25" />

                <View className="flex-row items-center justify-between px-5 pt-5">
                  <View className="rounded-[16px] bg-white/95 px-3 py-2">
                    <Image
                      source={authAssets.logoImage}
                      style={{ height: 22, width: 92 }}
                      resizeMode="contain"
                    />
                  </View>

                  <View className="rounded-full bg-white/20 px-3 py-1.5">
                    <Text className="text-[11px] font-semibold uppercase tracking-[1.6px] text-white">
                      Bizezy
                    </Text>
                  </View>
                </View>

                <View className="px-5 pb-5">
                  <Text className="text-[31px] font-extrabold leading-[36px] text-white">
                    {heroTitle}
                  </Text>
                  <Text className="mt-2 text-[14px] leading-[20px] text-white/85">
                    {heroSubtitle}
                  </Text>
                </View>
              </ImageBackground>
            </View>

            <View className="px-5 pb-5 pt-5">
              {isAuthFlow ? (
                <View className="mb-5 flex-row rounded-[18px] bg-[#f3f4f6] p-1.5">
                  <TabButton
                    isActive={isLogin}
                    label="Sign In"
                    onPress={() => switchMode("login")}
                  />
                  <TabButton
                    isActive={!isLogin}
                    label="Create Account"
                    onPress={() => switchMode("register")}
                  />
                </View>
              ) : (
                <Pressable
                  onPress={() => switchMode("login")}
                  className="mb-5 flex-row items-center gap-2"
                >
                  <MaterialIcons name="arrow-back" size={18} color="#2563eb" />
                  <Text className="text-[13px] text-[#2563eb]">Back to sign in</Text>
                </Pressable>
              )}

              {error ? <Banner kind="error" message={error} /> : null}

              {!isApiConfigured && isAuthFlow ? (
                <Banner
                  kind="info"
                  message="Add EXPO_PUBLIC_API_URL in app/.env before testing auth."
                />
              ) : null}

              {isForgotPassword && forgotPasswordError ? (
                <Banner kind="error" message={forgotPasswordError} />
              ) : null}
              {isForgotPassword && forgotPasswordSuccess ? (
                <Banner
                  kind="success"
                  message="Password reset email sent. Check your inbox."
                />
              ) : null}

              {isResetPassword && resetPasswordError ? (
                <Banner kind="error" message={resetPasswordError} />
              ) : null}
              {isResetPassword && resetPasswordSuccess ? (
                <Banner
                  kind="success"
                  message="Password reset successfully. Signing you in..."
                />
              ) : null}

              {isLogin ? (
                <SignInPage
                  form={loginForm}
                  isBusy={isBusy}
                  isDisabled={!isApiConfigured}
                  rememberMe={rememberMe}
                  showPassword={showLoginPassword}
                  onChangeForm={setLoginForm}
                  onForgotPassword={() => switchMode("forgotPassword")}
                  onSubmit={submitLogin}
                  onToggleRememberMe={toggleRememberMe}
                  onTogglePasswordVisibility={toggleShowLoginPassword}
                />
              ) : mode === "register" ? (
                <SignUpPage
                  form={registerForm}
                  isBusy={isBusy}
                  isDisabled={!isApiConfigured}
                  showConfirmPassword={showRegisterConfirmPassword}
                  showPassword={showRegisterPassword}
                  onChangeForm={setRegisterForm}
                  onSubmit={submitRegister}
                  onToggleConfirmPasswordVisibility={
                    toggleShowRegisterConfirmPassword
                  }
                  onTogglePasswordVisibility={toggleShowRegisterPassword}
                  onToggleTerms={toggleRegisterTerms}
                />
              ) : isForgotPassword ? (
                <ForgotPasswordPage
                  form={forgotPasswordForm}
                  isBusy={isBusy}
                  onChangeForm={setForgotPasswordForm}
                  onSubmit={submitForgotPassword}
                />
              ) : (
                <ResetPasswordPage
                  form={resetPasswordForm}
                  isBusy={isBusy}
                  showPassword={showResetPassword}
                  showConfirmPassword={showResetConfirmPassword}
                  onChangeForm={setResetPasswordForm}
                  onSubmit={submitResetPassword}
                  onTogglePasswordVisibility={toggleShowResetPassword}
                  onToggleConfirmPasswordVisibility={toggleShowResetConfirmPassword}
                />
              )}

              {isAuthFlow ? (
                <View className="pt-4">
                  <View className="flex-row items-center gap-3">
                    <View className="h-px flex-1 bg-black/10" />
                    <Text className="text-[11px] font-semibold uppercase tracking-[1.6px] text-black/35">
                      Or continue with
                    </Text>
                    <View className="h-px flex-1 bg-black/10" />
                  </View>

                  <Pressable
                    onPress={submitGoogle}
                    disabled={isBusy || !isApiConfigured}
                    className={`mt-4 flex-row items-center justify-center gap-3 rounded-[16px] border border-[#d1d5db] bg-white py-[15px] ${
                      isBusy || !isApiConfigured ? "opacity-50" : ""
                    }`}
                  >
                    <AntDesign name="google" size={18} color="#4285F4" />
                    <Text className="text-[14px] font-semibold text-[#374151]">
                      {isLogin ? "Sign in with Google" : "Sign up with Google"}
                    </Text>
                  </Pressable>

                  <View className="mt-6 flex-row items-center justify-center gap-1">
                    <Text className="text-[13px] text-[#4b5563]">
                      {isLogin ? "Need an account?" : "Already registered?"}
                    </Text>
                    <Pressable onPress={toggleFooterMode}>
                      <Text className="text-[13px] font-bold text-black">
                        {isLogin ? "Create one" : "Sign in"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Banner = ({
  kind,
  message,
}: {
  kind: "error" | "info" | "success";
  message: string;
}) => (
  <View
    className={`mb-4 flex-row items-start gap-3 rounded-[20px] px-4 py-3 ${
      kind === "error"
        ? "border border-red-200 bg-red-50"
        : kind === "success"
        ? "border border-green-200 bg-green-50"
        : "border border-blue-200 bg-blue-50"
    }`}
  >
    <MaterialIcons
      name={
        kind === "error"
          ? "error-outline"
          : kind === "success"
          ? "check-circle-outline"
          : "info-outline"
      }
      size={18}
      color={
        kind === "error" ? "#dc2626" : kind === "success" ? "#16a34a" : "#2563eb"
      }
    />
    <Text
      className={`flex-1 text-[13px] leading-[18px] ${
        kind === "error"
          ? "text-red-600"
          : kind === "success"
          ? "text-green-700"
          : "text-blue-700"
      }`}
    >
      {message}
    </Text>
  </View>
);

const TabButton = ({
  isActive,
  label,
  onPress,
}: {
  isActive: boolean;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 rounded-[14px] px-3 py-3 ${isActive ? "bg-white" : ""}`}
  >
    <Text
      className={`text-center text-[13px] font-semibold ${
        isActive ? "text-[#111827]" : "text-black/45"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);
