"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../app/context/AppContext";
import { UserRole } from "../app/types";

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    cartCount,
    activeOrder,
    toastMessage,
    currentUser,
    logout,
    isAuthenticated,
  } = useApp();

  const pathname = usePathname();
  const router = useRouter();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badge: string; bg: string; defaultRoute: string }> = {
    customer: { title: "Customer / Student", badge: "Student Pass", bg: "bg-orange-500", defaultRoute: "/" },
    kitchen: { title: "Kitchen / Staff", badge: "Chef Station", bg: "bg-emerald-600", defaultRoute: "/kitchen" },
    manager: { title: "Canteen Manager", badge: "Manager AI", bg: "bg-blue-600", defaultRoute: "/manager" },
    admin: { title: "System Admin", badge: "Superuser", bg: "bg-purple-600", defaultRoute: "/admin" },
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setRoleMenuOpen(false);
    router.push(roleLabels[newRole].defaultRoute);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <Link
            href="/"
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
          </Link>

          {/* Navigation Links for Customer */}
          {role === "customer" && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
              <Link
                href="/"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname === "/" || pathname === "/menu"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Menu
              </Link>
              <Link
                href="/cart"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/cart"
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
              </Link>
              <Link
                href="/live-order"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/live-order"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Live Token
                {activeOrder && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </Link>
              <Link
                href="/history"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname === "/history"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                History
              </Link>
              <Link
                href="/preferences"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  pathname === "/preferences"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Preferences
              </Link>
            </nav>
          )}

          {/* Navigation Links for Staff / Manager / Admin */}
          {role !== "customer" && (
            <div className="hidden md:flex items-center gap-2 text-xs font-bold">
              <Link
                href="/kitchen"
                className={`px-3.5 py-2 rounded-xl border transition-all ${
                  pathname === "/kitchen"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                }`}
              >
                Kitchen Board
              </Link>
              <Link
                href="/manager"
                className={`px-3.5 py-2 rounded-xl border transition-all ${
                  pathname === "/manager"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                }`}
              >
                Manager Ops & AI
              </Link>
              <Link
                href="/admin"
                className={`px-3.5 py-2 rounded-xl border transition-all ${
                  pathname === "/admin"
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                }`}
              >
                Admin Console
              </Link>
            </div>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Active Live Token Banner Pill */}
            {activeOrder && role === "customer" && (
              <Link
                href="/live-order"
                className="relative inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-all shadow-sm active:scale-95"
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="pulse-radar-dot absolute inline-flex h-2.5 w-2.5 rounded-full bg-orange-600"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-600"></span>
                </span>
                <span className="text-xs text-orange-950 font-bold whitespace-nowrap">
                  #{activeOrder.tokenNumber}: {activeOrder.status}
                </span>
              </Link>
            )}

            {/* Cart Icon Trigger */}
            {role === "customer" && (
              <Link
                href="/cart"
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
              </Link>
            )}

            {/* Sign In button or Role Switcher / Profile Dropdown */}
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full text-xs font-extrabold shadow-md transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">
                  login
                </span>
                <span>Sign In</span>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 text-slate-800 text-xs font-semibold transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    manage_accounts
                  </span>
                  <span className="hidden sm:inline">{currentUser.name}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    expand_more
                  </span>
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 anim-fade-in-up">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                    </div>

                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      Switch User Role
                    </div>
                    {(["customer", "kitchen", "manager", "admin"] as UserRole[]).map(
                      (r) => (
                        <button
                          key={r}
                          onClick={() => handleRoleSwitch(r)}
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

                    <div className="pt-2 mt-2 border-t border-slate-100 px-2">
                      <Link
                        href="/login"
                        onClick={() => {
                          logout();
                          setRoleMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-between"
                      >
                        <span>Sign In / Switch Login</span>
                        <span className="material-symbols-outlined text-[16px]">
                          login
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar for Customer */}
        {role === "customer" && (
          <div className="md:hidden border-t border-slate-100 bg-white/95 px-2 py-1 flex items-center justify-around">
            <Link
              href="/"
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold ${
                pathname === "/" || pathname === "/menu" ? "text-orange-600" : "text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                restaurant_menu
              </span>
              <span>Menu</span>
            </Link>
            <Link
              href="/cart"
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold relative ${
                pathname === "/cart" ? "text-orange-600" : "text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                shopping_cart
              </span>
              <span>Cart ({cartCount})</span>
            </Link>
            <Link
              href="/live-order"
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold ${
                pathname === "/live-order" ? "text-orange-600" : "text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                confirmation_number
              </span>
              <span>Live Token</span>
            </Link>
            <Link
              href="/history"
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold ${
                pathname === "/history" ? "text-orange-600" : "text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">history</span>
              <span>History</span>
            </Link>
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
