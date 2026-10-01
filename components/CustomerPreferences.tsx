"use client";

import React from "react";
import { useApp } from "../app/context/AppContext";

export const CustomerPreferences: React.FC = () => {
  const { preferences, updatePreferences, showToast } = useApp();

  return (
    <div className="max-w-4xl mx-auto w-full px-4 pt-4 pb-32 flex flex-col gap-6">
      {/* 1. Profile Header Hero Card */}
      <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-100 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-100 rounded-full blur-2xl opacity-40 pointer-events-none"></div>

        {/* Avatar */}
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 shadow-md border-2 border-white">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Alex Rivera"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => showToast("Profile picture editor opened")}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">
              photo_camera
            </span>
          </button>
        </div>

        <h1 className="font-headline text-xl font-extrabold text-slate-900 tracking-tight">
          Alex Rivera
        </h1>

        <div className="mt-1 inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-slate-700">
          <span className="material-symbols-outlined text-[16px] text-blue-600">
            school
          </span>
          <span className="text-xs font-bold">MUET - 24CS031</span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-slate-500 text-xs">
          <span>alex.rivera@campus.edu.pk</span>
          <span className="material-symbols-outlined text-[16px] text-emerald-600">
            verified
          </span>
        </div>

        {/* Smart Card Mini Wallet Pill */}
        <div className="mt-4 w-full bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">
                account_balance_wallet
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs text-slate-500 font-medium">
                Campus Smart Card Balance
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                $34.50
              </span>
            </div>
          </div>
          <button
            onClick={() => showToast("Added $10.00 to Smart Card Balance")}
            className="h-9 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              add_circle
            </span>
            <span>Top Up</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Micro Stats */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[20px]">
              shopping_bag
            </span>
          </div>
          <span className="text-lg font-extrabold text-slate-900">28</span>
          <span className="text-[11px] text-slate-500 font-medium">
            Total Orders
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[20px]">
              fastfood
            </span>
          </div>
          <span className="text-xs font-extrabold text-slate-900 truncate w-full">
            Chicken Burger
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Favorite Meal
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <span className="text-lg font-extrabold text-slate-900">8 mins</span>
          <span className="text-[11px] text-slate-500 font-medium">
            Avg Wait
          </span>
        </div>
      </div>

      {/* 3. Campus & Dietary Preferences */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Dietary & Canteen Preferences
        </h2>

        {/* Dietary Toggles */}
        <div className="flex flex-col gap-3 divide-y divide-slate-100">
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  eco
                </span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">
                  Vegetarian Filter
                </span>
                <span className="text-[11px] text-slate-500">
                  Automatically highlight vegetarian meals
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.vegetarianOnly}
              onChange={(e) =>
                updatePreferences({ vegetarianOnly: e.target.checked })
              }
              className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  warning
                </span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">
                  Nut Allergy Warning
                </span>
                <span className="text-[11px] text-slate-500">
                  Alert when food items contain trace peanuts/nuts
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.nutAllergyWarning}
              onChange={(e) =>
                updatePreferences({ nutAllergyWarning: e.target.checked })
              }
              className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  notifications_active
                </span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">
                  Token Ready Push Alerts
                </span>
                <span className="text-[11px] text-slate-500">
                  Receive sound notification when order is ready for pickup
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.notifyOnReady}
              onChange={(e) =>
                updatePreferences({ notifyOnReady: e.target.checked })
              }
              className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
