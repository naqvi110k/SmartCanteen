"use client";

import React, { useState } from "react";
import { useApp } from "../app/context/AppContext";

export const ManagerDashboard: React.FC = () => {
  const {
    menu,
    stats,
    aiInsights,
    slots,
    updateItemStock,
    showToast,
  } = useApp();

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const handlePriceSave = (itemId: string) => {
    showToast(`Updated menu price to $${tempPrice.toFixed(2)}`);
    setEditingPriceId(null);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 pt-4 pb-32 flex flex-col gap-6">
      {/* Manager Header & KPI Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[28px]">
                query_stats
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold text-white font-headline">
                Canteen Manager Operations & Analytics
              </h1>
              <span className="text-xs text-slate-400">
                Live Sales, Inventory Controls & AI Demand Predictions
              </span>
            </div>
          </div>
          <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 self-start md:self-auto">
            Peak Rush Window: 1:00 PM – 1:30 PM
          </span>
        </div>

        {/* KPI Micro Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">
              Total Revenue Today
            </span>
            <span className="text-xl font-extrabold text-emerald-400">
              ${stats.totalSalesToday.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">
              Orders Completed / Total
            </span>
            <span className="text-xl font-extrabold text-white">
              {stats.completedOrders} / {stats.totalOrdersToday}
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">
              Avg Preparation Time
            </span>
            <span className="text-xl font-extrabold text-orange-400">
              {stats.avgPrepTimeMinutes} mins
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">
              Cancelled Orders
            </span>
            <span className="text-xl font-extrabold text-red-400">
              {stats.cancelledOrders}
            </span>
          </div>
        </div>
      </div>

      {/* AI Insights & Demand Predictions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-600 text-[24px]">
              auto_awesome
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Intelligent AI Demand & Delay Predictions
            </h2>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            AI Engine Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between gap-2"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-white px-2 py-0.5 rounded border border-orange-200">
                    {insight.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {insight.confidence}% confidence
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-xs mt-1">
                  {insight.title}
                </h3>
                <p className="text-[11px] text-slate-600">
                  {insight.description}
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-800 font-semibold flex items-center gap-1.5 mt-2">
                <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0">
                  lightbulb
                </span>
                <span>{insight.actionableTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Inventory Manager & Slot Capacities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory & Price Control Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Menu Items, Prices & Stock Inventory
            </h2>
            <button
              onClick={() => showToast("Add Item Modal opened")}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">
                add
              </span>
              <span>Add New Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price ($)</th>
                  <th className="p-3">Stock Qty</th>
                  <th className="p-3">Prep Time</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {menu.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="p-3 text-slate-600">{item.category}</td>
                    <td className="p-3 font-extrabold text-slate-900">
                      {editingPriceId === item.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.1"
                            value={tempPrice}
                            onChange={(e) =>
                              setTempPrice(parseFloat(e.target.value))
                            }
                            className="w-16 h-7 px-1.5 border border-slate-300 rounded text-xs font-bold"
                          />
                          <button
                            onClick={() => handlePriceSave(item.id)}
                            className="text-emerald-600 font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span>${item.price.toFixed(2)}</span>
                          <button
                            onClick={() => {
                              setEditingPriceId(item.id);
                              setTempPrice(item.price);
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              edit
                            </span>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={item.availableQuantity}
                          onChange={(e) =>
                            updateItemStock(item.id, parseInt(e.target.value) || 0)
                          }
                          className="w-14 h-7 px-1.5 border border-slate-200 rounded text-xs font-bold text-center"
                        />
                        <span className="text-[10px] text-slate-400">units</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">
                      {item.preparationTime} mins
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => showToast(`Editing ${item.name}`)}
                        className="text-blue-600 hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 15-Min Pickup Slots Limits & Popular Items Ranking */}
        <div className="flex flex-col gap-6">
          {/* Pickup Slot Limits */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900">
              15-Minute Slot Pickup Limits
            </h2>
            <p className="text-xs text-slate-500">
              Set maximum order capacity per slot to prevent kitchen overload.
            </p>

            <div className="divide-y divide-slate-100">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">
                      {slot.timeSlot}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {slot.stationName}
                    </span>
                  </div>
                  <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                    {slot.currentOrders} / {slot.maxCapacity} Max
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Ranking */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900">
              Top Selling Food Ranking
            </h2>
            <div className="divide-y divide-slate-100">
              {stats.popularItems.map((pop, idx) => (
                <div
                  key={pop.name}
                  className="py-2 flex items-center justify-between text-xs font-bold"
                >
                  <span className="text-slate-800">
                    #{idx + 1} {pop.name}
                  </span>
                  <span className="text-slate-500">{pop.count} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
