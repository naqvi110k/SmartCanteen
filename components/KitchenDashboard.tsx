"use client";

import React, { useState } from "react";
import { useApp } from "../app/context/AppContext";
import { OrderStatus } from "../app/types";
import { collectionAPI } from "../app/lib/api";

export const KitchenDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    menu,
    toggleItemStatus,
    showToast,
  } = useApp();

  const [scanTokenInput, setScanTokenInput] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("Active");

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === "Active")
      return ["Placed", "Accepted", "Preparing", "Ready"].includes(o.status);
    if (selectedFilter === "Preparing") return o.status === "Preparing";
    if (selectedFilter === "Ready") return o.status === "Ready";
    if (selectedFilter === "Completed")
      return ["Collected", "Completed"].includes(o.status);
    return true;
  });

  const handleVerifyQRScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const tokenOrId = scanTokenInput.trim();
    if (!tokenOrId) return;

    try {
      const res = await collectionAPI.confirm({
        token_number: tokenOrId.startsWith("C-") ? tokenOrId : undefined,
        order_id: !tokenOrId.startsWith("C-") ? tokenOrId : undefined,
      });
      showToast(`✅ Verified Token ${tokenOrId}! Marked as COMPLETED.`);
      updateOrderStatus(res.data._id || res.data.order_id, "Completed");
      setScanTokenInput("");
    } catch (err: any) {
      showToast(`⚠️ ${err.message || "Invalid token or order already collected!"}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 pt-4 pb-32 flex flex-col gap-6">
      {/* Kitchen Banner Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[28px]">
              soup_kitchen
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white font-headline">
                Kitchen Staff Display & Queue
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Kitchen Sync
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Counter Station B — Hot Express Griddle
            </span>
          </div>
        </div>

        {/* Quick QR Scanner Simulator Form */}
        <form
          onSubmit={handleVerifyQRScan}
          className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700 w-full md:w-auto"
        >
          <div className="relative flex-1 flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
              qr_code_scanner
            </span>
            <input
              type="text"
              value={scanTokenInput}
              onChange={(e) => setScanTokenInput(e.target.value)}
              placeholder="Scan/Type Token (e.g. C-023)..."
              className="w-full md:w-56 h-9 pl-9 pr-3 bg-transparent text-white placeholder:text-slate-500 text-xs font-mono outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shrink-0"
          >
            Verify Pickup
          </button>
        </form>
      </div>

      {/* Main Grid: Queue & Menu Availability Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Live Orders Queue */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Live Kitchen Queue
              </h2>
              <span className="bg-orange-100 text-orange-800 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                {filteredOrders.length} Orders
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {["Active", "Preparing", "Ready", "Completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedFilter === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 text-slate-400">
              <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">
                check_circle
              </span>
              <p className="font-bold text-slate-700 text-sm">
                No orders in this queue filter
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4 relative overflow-hidden"
                >
                  {/* Status Banner Stripe */}
                  <div
                    className={`h-1.5 w-full absolute top-0 left-0 right-0 ${
                      order.status === "Ready"
                        ? "bg-emerald-500"
                        : order.status === "Preparing"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    }`}
                  ></div>

                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-orange-400 font-extrabold text-base flex items-center justify-center font-headline shadow-md">
                        {order.tokenNumber}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-slate-500">
                          Ordered: {order.orderTime} • Pickup Slot:{" "}
                          <strong className="text-slate-900">
                            {order.pickupSlot}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === "Ready"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.status === "Preparing"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Order Items List */}
                  <div className="bg-slate-50 rounded-xl p-3.5 flex flex-col gap-2 border border-slate-100">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col pb-1.5 border-b border-slate-200/60 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        {item.specialInstruction && (
                          <div className="mt-1 bg-amber-50 text-amber-900 px-2 py-1 rounded text-[11px] font-semibold border border-amber-200/60 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-amber-700">
                              edit_note
                            </span>
                            <span>
                              Special Note: "{item.specialInstruction}"
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Kitchen Action Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() =>
                        showToast(`Reported kitchen delay for Order ${order.tokenNumber}`)
                      }
                      className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        report_problem
                      </span>
                      <span>Report Issue / Delay</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {order.status === "Placed" && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, "Rejected")}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, "Accepted")}
                            className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition-all"
                          >
                            Accept Order
                          </button>
                        </>
                      )}

                      {order.status === "Accepted" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "Preparing")}
                          className="px-4 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sm hover:bg-orange-700 transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            skillet
                          </span>
                          <span>Start Preparation</span>
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "Ready")}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            notifications_active
                          </span>
                          <span>Mark Order Ready</span>
                        </button>
                      )}

                      {order.status === "Ready" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "Collected")}
                          className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm hover:bg-slate-800 transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            task_alt
                          </span>
                          <span>Confirm Collection</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Food Item Sold Out Controls */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Menu Item Availability
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Live Toggle
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Kitchen staff can instantly toggle items as Sold Out when stock runs out.
            </p>

            <div className="divide-y divide-slate-100 mt-1">
              {menu.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-2"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Stock: {item.availableQuantity} Left
                    </span>
                  </div>

                  <button
                    onClick={() => toggleItemStatus(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      item.status === "Available"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {item.status === "Available" ? "Available" : "Sold Out"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
