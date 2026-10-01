"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../app/context/AppContext";
import { adminAPI } from "../app/lib/api";

export const AdminDashboard: React.FC = () => {
  const { showToast } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    "users" | "canteens" | "permissions" | "logs" | "categories"
  >("users");

  const [usersList, setUsersList] = useState<any[]>([]);
  const [logsList, setLogsList] = useState<any[]>([]);

  useEffect(() => {
    adminAPI
      .getUsers()
      .then((res) => {
        if (res.data) setUsersList(res.data);
      })
      .catch((err) => console.warn("[API] Admin getUsers failed:", err));

    adminAPI
      .getLogs()
      .then((res) => {
        if (res.data) setLogsList(res.data);
      })
      .catch((err) => console.warn("[API] Admin getLogs failed:", err));
  }, []);

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
                {(usersList.length > 0
                  ? usersList
                  : [
                      {
                        _id: "u-1",
                        name: "Student Customer",
                        email: "customer@canteen.com",
                        role: "customer",
                        account_status: "active",
                      },
                      {
                        _id: "u-2",
                        name: "Kitchen Chef / Staff",
                        email: "staff@canteen.com",
                        role: "staff",
                        account_status: "active",
                      },
                      {
                        _id: "u-3",
                        name: "Canteen Manager",
                        email: "manager@canteen.com",
                        role: "manager",
                        account_status: "active",
                      },
                      {
                        _id: "u-4",
                        name: "System Administrator",
                        email: "admin@canteen.com",
                        role: "admin",
                        account_status: "active",
                      },
                    ]
                ).map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 uppercase text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        {u.account_status || u.status || "active"}
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
            {(logsList.length > 0
              ? logsList
              : [
                  {
                    _id: "log-1",
                    created_at: new Date().toISOString(),
                    user_name: "Student Customer",
                    action: "ORDER_PLACED",
                    details: { order_id: "ORD-20261001-1023", token: "C-023" },
                  },
                  {
                    _id: "log-2",
                    created_at: new Date().toISOString(),
                    user_name: "Kitchen Chef / Staff",
                    action: "ORDER_STATUS_TRANSITION",
                    details: { from: "Accepted", to: "Preparing" },
                  },
                ]
            ).map((log) => (
              <div
                key={log._id || log.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-slate-400 font-semibold shrink-0">
                    [{new Date(log.created_at || Date.now()).toLocaleTimeString()}]
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">
                    {log.user_name || log.user || "System"}:
                  </span>
                  <span className="text-slate-700 truncate">
                    {log.action} {log.details ? JSON.stringify(log.details) : ""}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                  {log.role || "AUDIT"}
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
