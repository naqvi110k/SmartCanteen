import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../app/context/AppContext";

export const OrderHistory: React.FC = () => {
  const router = useRouter();
  const { orders, reorderPastOrder, menu, showToast } = useApp();
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const handleReorder = async (order: typeof orders[0]) => {
    try {
      setReorderingId(order.id);
      const result = await reorderPastOrder(order);
      if (result.success) {
        router.push("/cart");
      }
    } catch (err: any) {
      showToast("Could not reorder this past order. Please try again.");
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 pt-4 pb-32 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900 font-headline">
          Your Order History
        </h2>
        <span className="text-xs font-semibold text-slate-500">
          Total Pre-Orders: {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center border border-slate-100">
          <span className="material-symbols-outlined text-[54px] text-slate-300 mb-2">
            history
          </span>
          <p className="font-bold text-slate-800 text-sm">No previous orders found</p>
          <p className="text-xs text-slate-500 mt-1">
            Place your first pre-order from the canteen menu!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3"
            >
              {/* Header: Token & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 font-extrabold text-sm flex items-center justify-center font-headline shadow-sm">
                    {order.tokenNumber}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-slate-900">
                      Order #{order.id}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {order.orderTime} • Slot: {order.pickupSlot}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      order.paymentStatus === "Paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : order.paymentStatus === "Failed"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : order.paymentStatus === "Refunded"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    💳 {order.paymentStatus || "Pending"}
                  </span>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.status === "Completed" || order.status === "Collected"
                        ? "bg-emerald-100 text-emerald-800"
                        : order.status === "Preparing" || order.status === "Ready"
                        ? "bg-orange-100 text-orange-800"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="flex flex-col gap-1.5 py-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-700 font-medium">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-slate-900 font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer: Reorder & Total */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Total Paid
                  </span>
                  <span className="text-base font-extrabold text-slate-900">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleReorder(order)}
                  disabled={reorderingId === order.id}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[16px] ${reorderingId === order.id ? "animate-spin" : ""}`}>
                    {reorderingId === order.id ? "progress_activity" : "replay"}
                  </span>
                  <span>{reorderingId === order.id ? "Validating Menu..." : "Reorder"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
