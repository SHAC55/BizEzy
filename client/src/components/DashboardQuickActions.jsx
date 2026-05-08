import React from "react";
import { Users, CreditCard, Boxes, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardQuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      name: "Add Inventory",
      icon: Boxes,
      path: "/add-inventory",
      description: "Stock new items",
    },
    {
      name: "Add Customer",
      icon: Users,
      path: "/add-customer",
      description: "Register new client",
    },
    {
      name: "Add Sale",
      icon: CreditCard,
      path: "/add-transaction",
      description: "Record transaction",
    },
  ];

  return (
    <div className="px-4 sm:px-5 lg:mt-6 mt-12">
      <div className="relative overflow-hidden bg-white border border-gray-200 rounded-3xl shadow-sm">

        {/* Subtle corner accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-50 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* LEFT */}
          <div className="space-y-2 max-w-full lg:max-w-sm">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-gray-900" />
              <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                Quick Actions
              </p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Add anything,{" "}
              <span className="text-gray-400 font-light italic">instantly</span>
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              One-click access to essential operations — no menus, no friction.
            </p>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex gap-3 w-full lg:w-auto">
            {actions.map((act, idx) => {
              const Icon = act.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(act.path)}
                  className="group relative overflow-hidden rounded-2xl border border-gray-900 bg-gray-900 p-5 text-left transition-all duration-200 hover:border-gray-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 w-full lg:w-[148px]"
                >
                  {/* White fill sweeps in on hover */}
                  <div className="absolute inset-0 bg-white scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-out rounded-2xl" />

                  <div className="relative flex flex-col items-center gap-3 text-center">
                    {/* Icon box */}
                    <div className="h-11 w-11 rounded-xl border border-white/20 bg-white/10 flex items-center justify-center group-hover:border-gray-200 group-hover:bg-gray-50 transition-all duration-300">
                      <Icon
                        size={20}
                        className="text-white group-hover:text-gray-700 transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <span className="block text-sm font-semibold text-white group-hover:text-gray-900 transition-colors duration-300">
                        {act.name}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5 group-hover:text-gray-500 transition-colors duration-300">
                        {act.description}
                      </span>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      size={14}
                      className="absolute top-0 right-0 opacity-0 -translate-x-1 text-white group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-gray-400 transition-all duration-300"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardQuickActions;