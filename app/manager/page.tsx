"use client";

import React from "react";
import { Header } from "../../components/Header";
import { ManagerDashboard } from "../../components/ManagerDashboard";

export default function ManagerPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <Header />
      <main className="flex-1 pt-24">
        <ManagerDashboard />
      </main>
    </div>
  );
}
