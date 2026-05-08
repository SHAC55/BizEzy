import React, { useState } from "react";
import { Boxes, Wrench, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import InventoryProducts from "../components/InventoryProducts";
import InventoryServices from "../components/InventoryServices";

const TABS = [
  { id: "products", label: "Products", icon: Boxes },
  { id: "services", label: "Services", icon: Wrench },
];

const Inventory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  const addPath =
    activeTab === "services" ? "/add-service" : "/add-inventory";
  const addLabel =
    activeTab === "services" ? "Add Service" : "Add Product";

  return (
    <div className="bg-white text-black mb-3 mr-3 w-full rounded-3xl p-2 md:ml-20 md:mt-2 mt-14 min-h-screen">
      <Header
        title="Inventory"
        para="Add, manage and track products and services"
      />

      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Inventory tabs"
            className="inline-flex items-center gap-1 rounded-2xl border border-black/8 bg-black/[0.02] p-1"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-black text-white shadow-sm"
                      : "text-black/55 hover:text-black"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate(addPath)}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-900 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            {addLabel}
          </button>
        </div>
      </div>

      {activeTab === "products" ? <InventoryProducts /> : <InventoryServices />}
    </div>
  );
};

export default Inventory;
