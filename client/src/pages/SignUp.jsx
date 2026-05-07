import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Building2,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import { googleAuthURL } from "../api/auth.api";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Reusable Field                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
const Field = ({ label, optional, error, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-medium tracking-[0.12em] uppercase text-neutral-500 font-mono">
      {label}
      {optional && (
        <span className="ml-1.5 text-[9px] opacity-40 normal-case tracking-normal">
          (optional)
        </span>
      )}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none"
        />
      )}
      {children}
    </div>
    {error && <p className="text-[11px] text-red-500 font-mono">{error}</p>}
  </div>
);

/* shared input classes */
const inputCls = (hasIcon, hasError) =>
  [
    "w-full py-3 pr-4 text-sm bg-transparent border outline-none transition-all duration-200",
    "text-neutral-900 placeholder:text-neutral-300",
    "focus:bg-neutral-50 focus:border-neutral-900",
    hasIcon ? "pl-10" : "pl-4",
    hasError ? "border-red-400" : "border-neutral-200",
  ].join(" ");

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SignUp                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) =>
    registerUser({
      businessName: data.businessName,
      username: data.username,
      email: data.email || undefined,
      phone: data.mobileNumber,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

  const handleGoogleSignUp = () => (window.location.href = googleAuthURL());

  /* ── Google SVG ── */
  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  return (
    <section className="min-h-screen w-full bg-stone-50 flex">
      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex md:w-[42%] bg-neutral-900 flex-col justify-between p-10 lg:p-14 relative overflow-hidden flex-shrink-0">
        {/* decorative rings */}
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
            Run your
            <br />
            <span className="italic text-white/40">business</span>
            <br />
            smarter.
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs font-light">
            One platform for invoicing, inventory, customers, and every
            operation in between.
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
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-8">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-400 mb-2">
              Step 1 of 1 — Registration
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              Create your
              <br />
              account
            </h2>
          </div>

          {/* API Error */}
          {error && (
            <div className="mb-5 border-l-4 border-red-500 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              {/* Business Name */}
              <Field
                label="Business Name"
                icon={Building2}
                error={errors.businessName?.message}
              >
                <input
                  placeholder="Acme Corp."
                  className={inputCls(true, !!errors.businessName)}
                  {...register("businessName", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 characters" },
                  })}
                />
              </Field>

              {/* Username */}
              <Field
                label="Username"
                icon={User}
                error={errors.username?.message}
              >
                <input
                  placeholder="john_doe"
                  className={inputCls(true, !!errors.username)}
                  {...register("username", {
                    required: "Required",
                    minLength: { value: 3, message: "Min 3 characters" },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Letters, numbers & underscores only",
                    },
                  })}
                />
              </Field>

              {/* Mobile */}
              <Field
                label="Mobile Number"
                icon={Phone}
                error={errors.mobileNumber?.message}
              >
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={inputCls(true, !!errors.mobileNumber)}
                  {...register("mobileNumber", {
                    required: "Required",
                    minLength: { value: 7, message: "Enter a valid number" },
                  })}
                />
              </Field>

              {/* Email */}
              <Field
                label="Email"
                optional
                icon={Mail}
                error={errors.email?.message}
              >
                <input
                  type="email"
                  placeholder="you@company.com"
                  className={inputCls(true, !!errors.email)}
                  {...register("email", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
              </Field>

              {/* Password */}
              <Field
                label="Password"
                icon={Lock}
                error={errors.password?.message}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className={inputCls(true, !!errors.password) + " pr-11"}
                  {...register("password", {
                    required: "Required",
                    minLength: { value: 6, message: "Min 6 characters" },
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

              {/* Confirm Password */}
              <Field
                label="Confirm Password"
                icon={Lock}
                error={errors.confirmPassword?.message}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  className={
                    inputCls(true, !!errors.confirmPassword) + " pr-11"
                  }
                  {...register("confirmPassword", {
                    required: "Required",
                    validate: (v) => v === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </Field>

              {/* Terms */}
              <div className="sm:col-span-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 accent-neutral-900 cursor-pointer flex-shrink-0"
                    {...register("terms", {
                      required: "You must accept to continue",
                    })}
                  />

                  <p className="text-sm text-neutral-500 leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-neutral-900 font-medium underline underline-offset-2 hover:opacity-60 transition-opacity"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-neutral-900 font-medium underline underline-offset-2 hover:opacity-60 transition-opacity"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>

                {errors.terms && (
                  <p className="text-[11px] text-red-500 font-mono mt-1.5 ml-7">
                    {errors.terms.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="sm:col-span-2 mt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-neutral-900 text-white py-4 font-mono text-[12px] tracking-[0.14em] uppercase flex items-center justify-center gap-2.5 hover:bg-neutral-800 active:bg-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="sm:col-span-2 flex items-center gap-4 my-1">
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                  or
                </span>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>

              {/* Google */}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center gap-3 border border-neutral-200 bg-white text-neutral-700 py-3.5 text-sm font-medium hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </div>

              {/* Sign In */}
              <p className="sm:col-span-2 text-center text-sm text-neutral-500 mt-2">
                Already have an account?{" "}
                <NavLink
                  to="/signin"
                  className="text-neutral-900 font-semibold border-b border-neutral-900 pb-px hover:opacity-60 transition-opacity"
                >
                  Sign in
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </main>
    </section>
  );
};

export default SignUp;
