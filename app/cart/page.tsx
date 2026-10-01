"use client";

import React from "react";
import { Header } from "../../components/Header";
import { CartCheckout } from "../../components/CartCheckout";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
      <Header />
      <main className="flex-1 pt-24">
        <CartCheckout />
      </main>
    </div>
  );
}
