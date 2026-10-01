"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [email, setEmail] = useState("alex.rivera@campus.edu.pk");
  const [password, setPassword] = useState("password123");

  const rolesConfig: {
    role: UserRole;
    title: string;
    description: string;
    icon: string;
    color: string;
    defaultEmail: string;
    redirectTo: string;
  }[] = [
    {
      role: "customer",
      title: "Student / Employee",
      description: "Pre-order meals, select 15-min pickup slots & receive digital tokens",
      icon: "person",
      color: "border-orange-500 bg-orange-50/50 text-orange-600",
      defaultEmail: "alex.rivera@campus.edu.pk",
      redirectTo: "/",
    },
    {
      role: "kitchen",
      title: "Kitchen / Staff",
      description: "Live kitchen queue board, QR token collection scanner & order status advancer",
      icon: "soup_kitchen",
      color: "border-emerald-500 bg-emerald-50/50 text-emerald-600",
      defaultEmail: "marcus.vance@canteen.edu.pk",
      redirectTo: "/kitchen",
    },
    {
      role: "manager",
      title: "Canteen Manager",
      description: "Manage menu prices, stock levels, slot limits, sales reports & AI insights",
      icon: "query_stats",
      color: "border-blue-500 bg-blue-50/50 text-blue-600",
      defaultEmail: "elena.r@canteen.edu.pk",
      redirectTo: "/manager",
    },
    {
      role: "admin",
      title: "System Admin",
      description: "Manage users, canteen accounts, permissions, audit logs & categories",
      icon: "admin_panel_settings",
      color: "border-purple-500 bg-purple-50/50 text-purple-600",
      defaultEmail: "admin@canteen.edu.pk",
      redirectTo: "/admin",
    },
  ];

  const handleRoleSelect = (r: UserRole) => {
    setSelectedRole(r);
    const conf = rolesConfig.find((c) => c.role === r);
    if (conf) setEmail(conf.defaultEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    const conf = rolesConfig.find((c) => c.role === selectedRole);
    router.push(conf ? conf.redirectTo : "/");
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined text-[32px]">
              restaurant
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-headline">
            Smart Canteen Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-sm">
            Sign in to access Pre-Order Management, Digital Tokens, Kitchen Queue, or Manager Operations.
          </p>
        </div>

        {/* Role Selector Cards */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Your Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rolesConfig.map((item) => (
              <div
                key={item.role}
                onClick={() => handleRoleSelect(item.role)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  selectedRole === item.role
                    ? `${item.color} ring-2 ring-orange-500/20 shadow-md`
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span className="font-bold text-xs text-slate-900">
                      {item.title}
                    </span>
                  </div>
                  {selectedRole === item.role && (
                    <span className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all active:scale-95 mt-2"
          >
            Sign In as {selectedRole.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
}
