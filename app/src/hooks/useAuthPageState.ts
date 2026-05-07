import { useEffect, useState } from "react";
import * as ExpoLinking from "expo-linking";
import { useAuth } from "../providers/AuthProvider";
import type { LoginForm } from "../pages/SignInPage";
import type { RegisterForm } from "../pages/SignUpPage";
import type { ForgotPasswordForm } from "../pages/ForgotPasswordPage";
import type { ResetPasswordForm } from "../pages/ResetPasswordPage";
import * as api from "../lib/api";

export type AuthMode = "login" | "register" | "forgotPassword" | "resetPassword";

const initialLoginForm: LoginForm = {
  username: "",
  password: "",
};

const initialRegisterForm: RegisterForm = {
  businessName: "",
  username: "",
  mobileNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

const initialForgotPasswordForm: ForgotPasswordForm = { email: "" };
const initialResetPasswordForm: ResetPasswordForm = { password: "", confirmPassword: "" };

export const useAuthPageState = () => {
  const { isBusy, login, loginWithGoogle, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [forgotPasswordForm, setForgotPasswordForm] = useState(initialForgotPasswordForm);
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState(initialResetPasswordForm);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [isLocalBusy, setIsLocalBusy] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isLogin = mode === "login";
  const isApiConfigured = Boolean(process.env.EXPO_PUBLIC_API_URL?.trim());
  const screenBackground = isLogin ? "#e5e7eb" : "#eef2ff";

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      if (!url || !url.includes("password/reset")) return;
      try {
        const parsed = ExpoLinking.parse(url);
        const code = parsed.queryParams?.code as string | undefined;
        const exp = parsed.queryParams?.exp as string | undefined;
        if (code) {
          const isExpired = exp ? Number(exp) < Date.now() : false;
          setVerificationCode(code);
          setMode(isExpired ? "forgotPassword" : "resetPassword");
          setError(null);
        }
      } catch {
        // ignore
      }
    };

    ExpoLinking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    const subscription = ExpoLinking.addEventListener("url", handleUrl);
    return () => subscription.remove();
  }, []);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
    if (nextMode !== "forgotPassword") {
      setForgotPasswordError(null);
      setForgotPasswordSuccess(false);
      setForgotPasswordForm(initialForgotPasswordForm);
    }
    if (nextMode !== "resetPassword") {
      setResetPasswordError(null);
      setResetPasswordSuccess(false);
      setResetPasswordForm(initialResetPasswordForm);
    }
  };

  const toggleFooterMode = () => {
    switchMode(isLogin ? "register" : "login");
  };

  const submitLogin = async () => {
    if (!loginForm.username.trim() || !loginForm.password) {
      setError("Username and password are required");
      return;
    }

    try {
      setError(null);
      await login({
        username: loginForm.username.trim(),
        password: loginForm.password,
      });
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Login failed",
      );
    }
  };

  const submitRegister = async () => {
    const email = registerForm.email.trim();

    if (
      !registerForm.businessName.trim() ||
      !registerForm.username.trim() ||
      !registerForm.mobileNumber.trim() ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      setError("All required fields must be filled");
      return;
    }

    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!registerForm.acceptedTerms) {
      setError("You must accept the terms to continue");
      return;
    }

    try {
      setError(null);
      await register({
        businessName: registerForm.businessName.trim(),
        username: registerForm.username.trim(),
        phone: registerForm.mobileNumber.trim(),
        email: email || undefined,
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
      });
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : "Registration failed",
      );
    }
  };

  const submitGoogle = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (googleError) {
      setError(
        googleError instanceof Error
          ? googleError.message
          : "Google sign-in failed",
      );
    }
  };

  const submitForgotPassword = async () => {
    const email = forgotPasswordForm.email.trim();
    if (!email) {
      setForgotPasswordError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setForgotPasswordError("Enter a valid email address");
      return;
    }
    try {
      setForgotPasswordError(null);
      setIsLocalBusy(true);
      await api.forgotPassword(email);
      setForgotPasswordSuccess(true);
    } catch (err) {
      setForgotPasswordError(
        err instanceof Error ? err.message : "Failed to send reset email",
      );
    } finally {
      setIsLocalBusy(false);
    }
  };

  const submitResetPassword = async () => {
    if (!resetPasswordForm.password) {
      setResetPasswordError("Password is required");
      return;
    }
    if (resetPasswordForm.password.length < 6) {
      setResetPasswordError("Password must be at least 6 characters");
      return;
    }
    if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
      setResetPasswordError("Passwords do not match");
      return;
    }
    if (!verificationCode) {
      setResetPasswordError("Invalid or expired reset link");
      return;
    }
    try {
      setResetPasswordError(null);
      setIsLocalBusy(true);
      await api.resetPassword({
        password: resetPasswordForm.password,
        verificationCode,
      });
      setResetPasswordSuccess(true);
      setTimeout(() => switchMode("login"), 2000);
    } catch (err) {
      setResetPasswordError(
        err instanceof Error ? err.message : "Failed to reset password",
      );
    } finally {
      setIsLocalBusy(false);
    }
  };

  return {
    error,
    forgotPasswordError,
    forgotPasswordForm,
    forgotPasswordSuccess,
    isApiConfigured,
    isBusy: isBusy || isLocalBusy,
    isLogin,
    loginForm,
    mode,
    registerForm,
    rememberMe,
    resetPasswordError,
    resetPasswordForm,
    resetPasswordSuccess,
    screenBackground,
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
    toggleRememberMe: () => setRememberMe((current) => !current),
    toggleRegisterTerms: () =>
      setRegisterForm((current) => ({
        ...current,
        acceptedTerms: !current.acceptedTerms,
      })),
    toggleShowLoginPassword: () =>
      setShowLoginPassword((current) => !current),
    toggleShowRegisterConfirmPassword: () =>
      setShowRegisterConfirmPassword((current) => !current),
    toggleShowRegisterPassword: () =>
      setShowRegisterPassword((current) => !current),
    toggleShowResetConfirmPassword: () =>
      setShowResetConfirmPassword((current) => !current),
    toggleShowResetPassword: () =>
      setShowResetPassword((current) => !current),
  };
};
