"use client";

import React from "react";
import { Header } from "../../components/Header";
import { OrderHistory } from "../../components/OrderHistory";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <Header />
      <main className="flex-1 pt-24">
        <OrderHistory />
      </main>
    </div>
  );
}
