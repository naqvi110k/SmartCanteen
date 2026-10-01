"use client";

import React from "react";
import { useApp } from "./context/AppContext";
import { Header } from "../components/Header";
import { CustomerHome } from "../components/CustomerHome";
import { CartCheckout } from "../components/CartCheckout";
import { LiveOrderTracker } from "../components/LiveOrderTracker";
import { OrderHistory } from "../components/OrderHistory";
import { CustomerPreferences } from "../components/CustomerPreferences";
import { KitchenDashboard } from "../components/KitchenDashboard";
import { ManagerDashboard } from "../components/ManagerDashboard";
import { AdminDashboard } from "../components/AdminDashboard";

export default function HomeShell() {
  const { role, activeTab } = useApp();

  const renderContent = () => {
    if (role === "kitchen") return <KitchenDashboard />;
    if (role === "manager") return <ManagerDashboard />;
    if (role === "admin") return <AdminDashboard />;

    // Customer Role views
    switch (activeTab) {
      case "cart":
        return <CartCheckout />;
      case "live-order":
        return <LiveOrderTracker />;
      case "history":
        return <OrderHistory />;
      case "preferences":
        return <CustomerPreferences />;
      case "home":
      default:
        return <CustomerHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <Header />
      <main className="flex-1 pt-24 md:pt-24">{renderContent()}</main>
    </div>
  );
}
