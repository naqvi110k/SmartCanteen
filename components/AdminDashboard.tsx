"use client";

import React, { useState } from "react";
import { useApp } from "../app/context/AppContext";

export const AdminDashboard: React.FC = () => {
  const { showToast } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    "users" | "canteens" | "permissions" | "logs" | "categories"
  >("users");

  const mockUsers = [
    {
      id: "u-1",
      name: "Alex Rivera",
      email: "alex.rivera@campus.edu.pk",
      role: "Customer",
      status: "Active",
    },
    {
      id: "u-2",
      name: "Chef Marcus Vance",
      email: "marcus.vance@canteen.edu.pk",
      role: "Kitchen Staff",
      status: "Active",
    },
    {
      id: "u-3",
      name: "Elena Rostova",
      email: "elena.r@canteen.edu.pk",
      role: "Canteen Manager",
      status: "Active",
    },
    {
      id: "u-4",
      name: "Syed Mohsin",
      email: "mohsin.cs24@muet.edu.pk",
      role: "Customer",
      status: "Active",
    },
  ];

  const mockLogs = [
    {
      id: "log-1",
      timestamp: "12:54:10 PM",
      user: "Alex Rivera",
      action: "Placed Pre-Order #C-023",
      severity: "INFO",
    },
    {
      id: "log-2",
      timestamp: "12:50:02 PM",
      user: "Chef Marcus Vance",
      action: "Advanced Order #C-022 to READY",
      severity: "INFO",
    },
    {
      id: "log-3",
      timestamp: "12:45:30 PM",
      user: "Elena Rostova",
      action: "Updated Chicken Deluxe Burger stock to 12",
      severity: "AUDIT",
    },
    {
      id: "log-4",
      timestamp: "12:30:15 PM",
      user: "System AI Engine",
      action: "Generated Rush Hour Peak Demand Alert",
      severity: "SYSTEM",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 pt-4 pb-32 flex flex-col gap-6">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[28px]">
              admin_panel_settings
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white font-headline">
                System Administrator Console
              </h1>
              <span className="bg-purple-500/20 text-purple-300 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full border border-purple-500/30">
                Superuser Access
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Manage Users, Roles, Canteen Accounts & System Logs
            </span>
          </div>
        </div>

        {/* Admin Section Tabs */}
        <div className="flex items-center gap-1 bg-slate-800 p-1.5 rounded-xl border border-slate-700 overflow-x-auto">
          {[
            { key: "users", label: "Users & Accounts" },
            { key: "canteens", label: "Canteen Hubs" },
            { key: "permissions", label: "Permissions" },
            { key: "categories", label: "Categories" },
            { key: "logs", label: "System Logs" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveAdminTab(t.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeAdminTab === t.key
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: User Management */}
      {activeAdminTab === "users" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              System Accounts & Role Assignments
            </h2>
            <button
              onClick={() => showToast("Add User Modal opened")}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">
                person_add
              </span>
              <span>Create New User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => showToast(`Editing user ${u.name}`)}
                        className="text-purple-600 hover:underline font-bold"
                      >
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: System Logs */}
      {activeAdminTab === "logs" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              System Audit & Activity Logs
            </h2>
            <span className="text-xs text-slate-500">Live Audit Stream</span>
          </div>

          <div className="divide-y divide-slate-100 font-mono text-xs">
            {mockLogs.map((log) => (
              <div
                key={log.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-slate-400 font-semibold shrink-0">
                    [{log.timestamp}]
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">
                    {log.user}:
                  </span>
                  <span className="text-slate-700 truncate">{log.action}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    log.severity === "AUDIT"
                      ? "bg-purple-100 text-purple-800"
                      : log.severity === "SYSTEM"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {log.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Canteen Accounts / Hubs */}
      {activeAdminTab === "canteens" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
          <h2 className="text-base font-bold text-slate-900">
            Canteen Locations & Accounts Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Campus Central Cafeteria
                </h3>
                <p className="text-xs text-slate-500">Science Block, Gate 3</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Express Station Locker A
                </h3>
                <p className="text-xs text-slate-500">Engineering Quad</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Categories Manager */}
      {activeAdminTab === "categories" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
          <h2 className="text-base font-bold text-slate-900">
            Food Category Management
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Burgers 🍔", "Meals 🍱", "Beverages 🥤", "Snacks 🍟", "Desserts 🍨"].map((cat) => (
              <div
                key={cat}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2"
              >
                <span>{cat}</span>
                <span className="material-symbols-outlined text-[16px] text-slate-400 cursor-pointer">
                  edit
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Role Permissions Matrix */}
      {activeAdminTab === "permissions" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
          <h2 className="text-base font-bold text-slate-900">
            Role Access Permissions Matrix
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Permission Feature</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Kitchen Staff</th>
                  <th className="p-3">Manager</th>
                  <th className="p-3">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-bold">Pre-Order & Select Slot</td>
                  <td className="p-3 text-emerald-600 font-bold">YES</td>
                  <td className="p-3 text-slate-400">NO</td>
                  <td className="p-3 text-slate-400">NO</td>
                  <td className="p-3 text-slate-400">NO</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Advance Order Prep Status</td>
                  <td className="p-3 text-slate-400">NO</td>
                  <td className="p-3 text-emerald-600 font-bold">YES</td>
                  <td className="p-3 text-emerald-600 font-bold">YES</td>
                  <td className="p-3 text-emerald-600 font-bold">YES</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Edit Item Prices & Stock</td>
                  <td className="p-3 text-slate-400">NO</td>
                  <td className="p-3 text-slate-400">NO</td>
                  <td className="p-3 text-emerald-600 font-bold">YES</td>
                  <td className="p-3 text-emerald-600 font-bold">YES</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Manage Users & Permissions</td>
                  <td className="p-3 text-slate-400">NO</td>
                  <td className="p-3 text-slate-400">NO</td>
                  <td className="p-3 text-slate-400">NO</td>
                  <td className="p-3 text-purple-600 font-bold">YES</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
