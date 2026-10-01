"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../app/context/AppContext";
import { MenuItem } from "../app/types";

export const CustomerHome: React.FC = () => {
  const { menu, addToCart, cartCount, cartTotal, preferences } = useApp();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Categories include backend's "Fast Food" + others
  const categories = [
    "All",
    "Popular 🔥",
    "Fast Prep (<5m) ⚡",
    "Fast Food 🍔",
    "Meals 🍱",
    "Beverages 🥤",
    "Snacks 🍟",
    "Desserts 🍨",
  ];

  // Filtering logic
  const filteredMenu = menu.filter((item) => {
    // Search query
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Dietary Preferences (from settings)
    if (preferences.vegetarianOnly && !item.isVegetarian) return false;

    // Selected Category
    if (selectedCategory === "Popular 🔥" && !item.isPopular) return false;
    if (selectedCategory === "Fast Prep (<5m) ⚡" && item.preparationTime > 5)
      return false;
    if (
      selectedCategory !== "All" &&
      !selectedCategory.includes(item.category) &&
      !selectedCategory.includes(item.name)
    ) {
      if (
        selectedCategory === "Fast Food 🍔" &&
        item.category !== "Fast Food"
      )
        return false;
      if (selectedCategory === "Meals 🍱" && item.category !== "Meals")
        return false;
      if (
        selectedCategory === "Beverages 🥤" &&
        item.category !== "Beverages"
      )
        return false;
      if (selectedCategory === "Snacks 🍟" && item.category !== "Snacks")
        return false;
      if (
        selectedCategory === "Desserts 🍨" &&
        item.category !== "Desserts"
      )
        return false;
    }

    // Quick Filter chips
    if (activeFilter === "fast" && item.preparationTime > 10) return false;
    if (activeFilter === "veg" && !item.isVegetarian) return false;
    if (activeFilter === "cheap" && item.price >= 5) return false;

    return true;
  });

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Sticky Search & Quick Filter Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <div className="relative flex-1 flex items-center group">
            <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[22px] pointer-events-none group-focus-within:text-orange-600 transition-colors">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search burgers, drinks, snacks, meals..."
              className="w-full h-12 pl-11 pr-4 bg-slate-100/80 text-slate-900 placeholder:text-slate-400 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>
          <button
            onClick={() => router.push("/preferences")}
            title="Dietary Preferences & Filters"
            className="w-12 h-12 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-all relative active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">
              tune
            </span>
            {(preferences.vegetarianOnly || preferences.veganOnly) && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-orange-600 ring-2 ring-white"></span>
            )}
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-7xl mx-auto w-full">
          <button
            onClick={() =>
              setActiveFilter(activeFilter === "fast" ? null : "fast")
            }
            className={`inline-flex items-center gap-1 h-8 px-3.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              activeFilter === "fast"
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>⚡ Fast Prep (&lt;10m)</span>
          </button>
          <button
            onClick={() =>
              setActiveFilter(activeFilter === "veg" ? null : "veg")
            }
            className={`inline-flex items-center gap-1 h-8 px-3.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              activeFilter === "veg"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>🌱 Vegetarian</span>
          </button>
          <button
            onClick={() =>
              setActiveFilter(activeFilter === "cheap" ? null : "cheap")
            }
            className={`inline-flex items-center gap-1 h-8 px-3.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              activeFilter === "cheap"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>🏷️ Under $5</span>
          </button>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="text-xs text-orange-600 font-bold underline px-2 shrink-0"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 pt-4 flex flex-col gap-5">
        {/* Real-time Kitchen Rush Insight Banner */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
          <div className="shimmer-layer opacity-30"></div>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[22px] electric-icon">
                bolt
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-slate-900 truncate">
                Lunch Rush Hour Active (1:00 PM – 2:00 PM)
              </span>
              <span className="text-xs text-slate-500 truncate">
                Counter Station B average pickup prep: ~6 mins
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push("/live-order")}
            className="shrink-0 text-xs font-bold text-orange-600 hover:underline flex items-center gap-0.5"
          >
            <span>View Queue</span>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`h-10 px-4 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-sm border border-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
          {filteredMenu.map((item: MenuItem) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between interactive-card group relative"
            >
              {/* Top Item Badges */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 bg-slate-100">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80") {
                      target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {item.isVegetarian && (
                    <span className="bg-emerald-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-sm">
                      🌱 Veg
                    </span>
                  )}
                  {item.isPopular && (
                    <span className="bg-amber-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-sm">
                      🔥 Top Choice
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-orange-400">
                    schedule
                  </span>
                  <span>{item.preparationTime}m prep</span>
                </div>
              </div>

              {/* Item Info */}
              <div className="flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </h3>
                  <span className="font-extrabold text-slate-900 text-base">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Stock Status & Add to Cart */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                    Stock Level
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      item.status === "Sold Out"
                        ? "text-slate-400 line-through"
                        : item.status === "Limited"
                        ? "text-orange-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {item.status === "Sold Out"
                      ? "Sold Out"
                      : `${item.availableQuantity} Left`}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  disabled={item.status === "Sold Out"}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    item.status === "Sold Out"
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-orange-600 hover:bg-orange-700 text-white shadow-md active:scale-95"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                  <span>Pre-Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="py-16 text-center flex flex-col items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">
              no_food
            </span>
            <p className="text-base font-bold text-slate-700">
              No matching food items found
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search or dietary filter chips.
            </p>
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-2xl mx-auto">
          <div className="bg-slate-900 text-white p-3 px-5 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-800 anim-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-inner cart-wiggling">
                {cartCount}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold uppercase">
                  Pre-Order Basket Total
                </span>
                <span className="font-extrabold text-lg text-white">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/cart")}
              className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <span>Review & Select Pickup Slot</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
