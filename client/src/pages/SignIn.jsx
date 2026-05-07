import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { googleAuthURL } from "../api/auth.api";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Reusable Field (same as SignUp)                                            */
/* ─────────────────────────────────────────────────────────────────────────── */
const Field = ({ label, error, icon: Icon, children, rightSlot }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-500 font-mono">
        {label}
      </label>
      {rightSlot}
    </div>
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none"
        />
      )}
      {children}
    </div>
    {error && (
      <p className="text-[11px] text-red-500 font-mono">{error}</p>
    )}
  </div>
);

const inputCls = (hasError) =>
  [
    "w-full py-3 pl-10 pr-4 text-sm bg-transparent border outline-none transition-all duration-200",
    "text-neutral-900 placeholder:text-neutral-300",
    "focus:bg-neutral-50 focus:border-neutral-900",
    hasError ? "border-red-400" : "border-neutral-200",
  ].join(" ");

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Google Icon SVG                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SignIn                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const SignIn = () => {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLogin();
  const googleError = new URLSearchParams(location.search).get("error");
  const resetSuccess = location.state?.resetSuccess;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login({ username: data.username, password: data.password });
  };

  const handleGoogleSignIn = () => {
    window.location.href = googleAuthURL();
  };

  return (
    <section className="min-h-screen w-full bg-stone-50 flex">

      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex md:w-[42%] bg-neutral-900 flex-col justify-between p-10 lg:p-14 relative overflow-hidden flex-shrink-0">

        {/* Decorative rings */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full border border-white/5 pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-8 h-8 border-2 border-white grid place-items-center font-serif text-white font-black text-base">
            B
          </div>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/50">
            BizEzy
          </span>
        </div>

        {/* Headline */}
        <div className="z-10">
          <h1 className="font-serif text-white font-black leading-[1.07] tracking-tight text-5xl lg:text-6xl mb-6">
            Welcome<br />
            <span className="italic text-white/40">back</span>
            <br />to work.
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs font-light">
            Pick up right where you left off. Your invoices, inventory, and
            customers are all here waiting.
          </p>
        </div>

        {/* Stats */}
        {/* <div className="z-10">
          <div className="w-10 h-px bg-white/10 mb-5" />
          <div className="flex gap-8">
            {[["12k+", "Businesses"], ["99.9%", "Uptime"], ["4.9★", "Rating"]].map(
              ([num, label]) => (
                <div key={label}>
                  <div className="font-mono text-white text-xl font-medium">{num}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/30 mt-0.5">
                    {label}
                  </div>
                </div>
              )
            )}
          </div>
        </div> */}
      </aside>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-start justify-center overflow-y-auto py-10 px-6 sm:px-12 md:mt-28 mt-0">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-400 mb-2">
              Sign In — Returning User
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              Sign in to<br />your account
            </h2>
          </div>

          {/* Alerts */}
          {resetSuccess && (
            <div className="mb-5 border-l-4 border-green-500 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-700">
                Password reset successful. Sign in with your new password.
              </p>
            </div>
          )}
          {googleError && (
            <div className="mb-5 border-l-4 border-red-500 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                Google sign-in failed. Please try again.
              </p>
            </div>
          )}
          {error && (
            <div className="mb-5 border-l-4 border-red-500 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">

              {/* Username */}
              <Field label="Username" icon={User} error={errors.username?.message}>
                <input
                  placeholder="john_doe"
                  autoComplete="username"
                  className={inputCls(!!errors.username)}
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
              </Field>

              {/* Password */}
              <Field
                label="Password"
                icon={Lock}
                error={errors.password?.message}
                rightSlot={
                  <NavLink
                    to="/forgot-password"
                    className="font-mono text-[10px] text-neutral-900 underline underline-offset-2 hover:opacity-60 transition-opacity"
                  >
                    Forgot Password?
                  </NavLink>
                }
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  autoComplete="current-password"
                  className={inputCls(!!errors.password) + " pr-11"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </Field>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-neutral-900 cursor-pointer flex-shrink-0"
                  {...register("rememberMe")}
                />
                <span className="text-sm text-neutral-500">Remember me</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-neutral-900 text-white py-4 font-mono text-[12px] tracking-[0.14em] uppercase flex items-center justify-center gap-2.5 hover:bg-neutral-800 active:bg-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-1">
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">or</span>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 border border-neutral-200 bg-white text-neutral-700 py-3.5 text-sm font-medium hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-neutral-500 mt-2">
                Don't have an account?{" "}
                <NavLink
                  to="/signup"
                  className="text-neutral-900 font-semibold border-b border-neutral-900 pb-px hover:opacity-60 transition-opacity"
                >
                  Create Account
                </NavLink>
              </p>

            </div>
          </form>
        </div>
      </main>
    </section>
  );
};

export default SignIn;