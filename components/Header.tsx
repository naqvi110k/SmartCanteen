"use client";

import React, { useState } from "react";
import { useApp } from "../app/context/AppContext";
import { UserRole } from "../app/types";

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    activeTab,
    setActiveTab,
    cartCount,
    activeOrder,
    toastMessage,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badge: string; bg: string }> = {
    customer: { title: "Customer / Student", badge: "Student Pass", bg: "bg-orange-500" },
    kitchen: { title: "Kitchen / Staff", badge: "Chef Station", bg: "bg-emerald-600" },
    manager: { title: "Canteen Manager", badge: "Manager AI", bg: "bg-blue-600" },
    admin: { title: "System Admin", badge: "Superuser", bg: "bg-purple-600" },
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div
            onClick={() => role === "customer" && setActiveTab("home")}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 shrink-0">
              <span className="material-symbols-outlined text-[24px]">
                restaurant
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-headline">
                  Smart Canteen
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full ${roleLabels[role].bg}`}
                >
                  {roleLabels[role].badge}
                </span>
              </div>
              <span className="text-xs text-slate-500 truncate">
                Campus Dining & Queue Hub
              </span>
            </div>
          </div>

          {/* Nav Links (For Customer Role) */}
          {role === "customer" && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
              <button
                onClick={() => setActiveTab("home")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "home"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab("cart")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "cart"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Cart
                {cartCount > 0 && (
                  <span className="bg-orange-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("live-order")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "live-order"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Live Token
                {activeOrder && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "history"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "preferences"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Preferences
              </button>
            </nav>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Active Live Token Banner Pill */}
            {activeOrder && role === "customer" && (
              <button
                onClick={() => setActiveTab("live-order")}
                className="relative inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-all shadow-sm active:scale-95"
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="pulse-radar-dot absolute inline-flex h-2.5 w-2.5 rounded-full bg-orange-600"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-600"></span>
                </span>
                <span className="text-xs text-orange-950 font-bold whitespace-nowrap">
                  #{activeOrder.tokenNumber}: {activeOrder.status}
                </span>
              </button>
            )}

            {/* Cart Icon Trigger */}
            {role === "customer" && (
              <button
                onClick={() => setActiveTab("cart")}
                aria-label="Cart"
                className="relative w-11 h-11 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors active:scale-90"
              >
                <span className="material-symbols-outlined text-[24px]">
                  shopping_bag
                </span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-orange-600 text-white font-bold text-[10px] leading-none rounded-full flex items-center justify-center px-1 shadow-sm badge-breathing">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 text-slate-800 text-xs font-semibold transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">
                  manage_accounts
                </span>
                <span className="hidden sm:inline">{roleLabels[role].title}</span>
                <span className="material-symbols-outlined text-[16px]">
                  expand_more
                </span>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 anim-fade-in-up">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch App Role
                  </div>
                  {(["customer", "kitchen", "manager", "admin"] as UserRole[]).map(
                    (r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          role === r
                            ? "text-orange-600 font-bold bg-orange-50/50"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{roleLabels[r].title}</span>
                        {role === r && (
                          <span className="material-symbols-outlined text-[16px] text-orange-600">
                            check
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar for Customer */}
        {role === "customer" && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 px-2 py-1 flex items-center justify-around">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold ${
                activeTab === "home" ? "text-orange-600" : "text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                restaurant_menu
              </span>
              <span>Menu</span>
            </button>
            <button
              onClick={() => setActiveTab("cart")}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold relative ${
                activeTab === "cart" ? "text-orange-600" : "text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                shopping_cart
              </span>
              <span>Cart ({cartCount})</span>
            </button>
            <button
              onClick={() => setActiveTab("live-order")}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold ${
                activeTab === "live-order" ? "text-orange-600" : "text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                confirmation_number
              </span>
              <span>Live Token</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold ${
                activeTab === "history" ? "text-orange-600" : "text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">history</span>
              <span>History</span>
            </button>
          </div>
        )}
      </header>

      {/* Global Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 max-w-md anim-fade-in-up">
          <span className="material-symbols-outlined text-orange-400 text-[20px]">
            info
          </span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </>
  );
};
