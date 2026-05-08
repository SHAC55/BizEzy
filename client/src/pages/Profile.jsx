import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useLogout } from "../hooks/useAuth";
import { useUpdateBusiness } from "../hooks/useBusiness";

import {
  MdBusiness,
  MdPerson,
  MdPhone,
  MdEmail,
  MdLogout,
  MdVerified,
  MdReceiptLong,
  MdLocationOn,
} from "react-icons/md";

const Profile = () => {
  const { user, isLoading } = useAuthContext();
  const { logout, isLoading: isLoggingOut } = useLogout();

  const {
    updateBusiness,
    isLoading: isSavingBusiness,
    error: businessError,
  } = useUpdateBusiness();

  const [businessForm, setBusinessForm] = useState({
    name: "",
    gstNumber: "",
    address: "",
  });

  useEffect(() => {
    setBusinessForm({
      name: user?.business?.name || "",
      gstNumber: user?.business?.gstNumber || "",
      address: user?.business?.address || "",
    });
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-neutral-300 border-t-black animate-spin" />
          <p className="text-sm tracking-[0.25em] uppercase text-neutral-500">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/signin";
    return null;
  }

  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    updateBusiness(businessForm);
  };

  const infoCards = [
    {
      icon: <MdPerson size={18} />,
      label: "Username",
      value: user.name || "—",
    },
    {
      icon: <MdEmail size={18} />,
      label: "Email",
      value: user.email || "—",
    },
    {
      icon: <MdPhone size={18} />,
      label: "Mobile",
      value: user.mobile || "—",
    },
    {
      icon: <MdBusiness size={18} />,
      label: "Business",
      value: user.business?.name || "—",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-neutral-100">
      {/* HERO */}
      <div className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 mb-3">
              Account Dashboard
            </p>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              Profile
            </h1>

            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-400">
              {user.name}
            </p>
          </div>

          <button
            onClick={logout}
            disabled={isLoggingOut}
            className="h-11 px-5 rounded-xl border border-neutral-700 hover:bg-neutral-900 transition flex items-center justify-center gap-2 text-sm font-medium"
          >
            {isLoggingOut ? (
              <div className="h-4 w-4 rounded-full border-2 border-neutral-500 border-t-white animate-spin" />
            ) : (
              <MdLogout size={18} />
            )}

            {isLoggingOut ? "Logging out..." : "Sign out"}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="border-b border-neutral-200 px-6 py-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center">
              <MdPerson size={20} className="text-neutral-700" />
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-wide uppercase text-neutral-800">
                Personal Information
              </h2>

              <p className="text-xs text-neutral-500 mt-1">
                Your account details
              </p>
            </div>
          </div>

          <div className="p-6">

            {/* USER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-neutral-200">
              <div className="h-16 w-16 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {user.name}
                  </h3>

                  {user.verified && (
                    <MdVerified
                      size={20}
                      className="text-emerald-600"
                    />
                  )}
                </div>

                <p className="text-sm text-neutral-500 mt-1">
                  Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {infoCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 flex items-start gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
                    {card.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                      {card.label}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-neutral-900 break-words">
                      {card.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center">
              <MdVerified size={20} className="text-neutral-700" />
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Account Status
              </h2>

              <p className="text-xs text-neutral-500 mt-1">
                Verification & provider details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  user.verified
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />

              <p className="text-sm text-neutral-700">
                Account is{" "}
                <span className="font-semibold">
                  {user.verified
                    ? "verified"
                    : "pending verification"}
                </span>
              </p>
            </div>

            {user.provider && (
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-black" />

                <p className="text-sm text-neutral-700">
                  Signed in via{" "}
                  <span className="font-semibold">
                    {user.provider}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* BUSINESS DETAILS */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="border-b border-neutral-200 px-6 py-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center">
              <MdReceiptLong size={20} className="text-neutral-700" />
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Invoice Business Details
              </h2>

              <p className="text-xs text-neutral-500 mt-1">
                Used in invoices & reminders
              </p>
            </div>
          </div>

          <div className="p-6">

            {businessError && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {businessError}
              </div>
            )}

            <form onSubmit={handleBusinessSubmit} className="space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* BUSINESS NAME */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">
                    Business Name
                  </label>

                  <input
                    type="text"
                    value={businessForm.name}
                    onChange={(e) =>
                      setBusinessForm((c) => ({
                        ...c,
                        name: e.target.value,
                      }))
                    }
                    className="w-full h-12 rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-sm outline-none focus:border-black focus:bg-white transition"
                  />
                </div>

                {/* GST */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">
                    GST Number
                  </label>

                  <input
                    type="text"
                    value={businessForm.gstNumber}
                    onChange={(e) =>
                      setBusinessForm((c) => ({
                        ...c,
                        gstNumber: e.target.value,
                      }))
                    }
                    placeholder="29ABCDE1234F1Z5"
                    className="w-full h-12 rounded-2xl border border-neutral-300 bg-neutral-50 px-4 text-sm outline-none focus:border-black focus:bg-white transition"
                  />
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">
                  Business Address
                </label>

                <textarea
                  rows={5}
                  value={businessForm.address}
                  onChange={(e) =>
                    setBusinessForm((c) => ({
                      ...c,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Billing address for invoices"
                  className="w-full rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm outline-none focus:border-black focus:bg-white transition resize-none"
                />
              </div>

              {/* HINT */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 flex items-start gap-3">
                <MdLocationOn
                  size={20}
                  className="text-neutral-500 shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-sm font-semibold text-neutral-800">
                    Invoice Readiness
                  </p>

                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                    {user.business?.gstNumber &&
                    user.business?.address
                      ? "GST and address are available. Invoices will include complete billing details."
                      : "Add GST number and address to generate professional invoices."}
                  </p>
                </div>
              </div>

              {/* SAVE */}
              <button
                type="submit"
                disabled={isSavingBusiness}
                className="h-12 px-6 rounded-2xl bg-black hover:bg-neutral-800 transition text-white text-sm font-semibold"
              >
                {isSavingBusiness
                  ? "Saving..."
                  : "Save Business Details"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;