/**
 * Smart Canteen API Client
 * Connects Next.js frontend to Express backend at localhost:5000
 */

const API_BASE = "http://localhost:5000/api";

// ─── Token Management ─────────────────────────────────
let authToken: string | null = null;

export const setToken = (token: string | null) => {
  authToken = token;
  if (token) {
    if (typeof window !== "undefined") localStorage.setItem("sc_token", token);
  } else {
    if (typeof window !== "undefined") localStorage.removeItem("sc_token");
  }
};

export const getToken = (): string | null => {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("sc_token");
  }
  return authToken;
};

// ─── Fetch Wrapper ─────────────────────────────────────
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `API Error ${res.status}`);
  }

  return json;
}

// ─── Auth APIs ─────────────────────────────────────────
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    account_status: string;
    phone: string;
  };
}

export const authAPI = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, phone?: string) =>
    apiFetch<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    }),

  getMe: () => apiFetch<{ message: string; user: any }>("/auth/me"),

  getPreferences: () =>
    apiFetch<{ data: Record<string, boolean | number | string> }>("/auth/preferences"),

  updatePreferences: (preferences: Record<string, boolean | number | string>) =>
    apiFetch<{ data: Record<string, boolean | number | string> }>("/auth/preferences", {
      method: "PATCH",
      body: JSON.stringify(preferences),
    }),
};

// ─── Menu APIs ─────────────────────────────────────────
export interface BackendMenuItem {
  _id: string;
  item_id?: string;
  item_name: string;
  category: string;
  price: number;
  available_quantity: number;
  preparation_time: number;
  status: string;
  image: string;
  total_orders_count?: number;
}

export const menuAPI = {
  getAll: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return apiFetch<{ data: BackendMenuItem[] }>(`/menu${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) =>
    apiFetch<{ data: BackendMenuItem }>(`/menu/${id}`),

  create: (item: {
    item_name: string;
    category: string;
    price: number;
    available_quantity: number;
    preparation_time: number;
    status?: string;
    image?: string;
  }) =>
    apiFetch<{ data: BackendMenuItem }>("/menu", {
      method: "POST",
      body: JSON.stringify(item),
    }),

  update: (id: string, item: any) =>
    apiFetch<{ data: BackendMenuItem }>(`/menu/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    }),

  updateStock: (id: string, available_quantity: number, status?: string) =>
    apiFetch<{ data: BackendMenuItem }>(`/menu/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ available_quantity, ...(status ? { status } : {}) }),
    }),

  delete: (id: string) =>
    apiFetch(`/menu/${id}`, { method: "DELETE" }),
};

// ─── Order APIs ────────────────────────────────────────
export interface BackendOrderItem {
  order_item_id?: string;
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
  special_instruction?: string;
}

export interface BackendOrder {
  _id: string;
  order_id: string;
  customer_id: string;
  customer_name: string;
  token_number: string;
  qr_code?: string;
  items: BackendOrderItem[];
  total_amount: number;
  order_time: string;
  pickup_slot: string;
  pickup_time?: string;
  estimated_ready_time: string;
  order_status: string;
  payment_status?: string;
  payment_method?: string;
  priority_score?: number;
  is_delayed?: boolean;
  delay_reason?: string;
  history?: any[];
}

export const orderAPI = {
  create: (data: {
    items: { item_id: string; quantity: number; special_instruction?: string }[];
    pickup_slot?: string;
    pickup_time?: string;
    idempotency_key?: string;
    payment_method?: string;
  }) =>
    apiFetch<{ data: BackendOrder; eta?: any }>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: (params?: { status?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return apiFetch<{ data: BackendOrder[] }>(`/orders${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) =>
    apiFetch<{ data: BackendOrder }>(`/orders/${id}`),

  cancel: (id: string, reason?: string) =>
    apiFetch<{ data: BackendOrder }>(`/orders/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason: reason || "Cancelled by customer" }),
    }),

  getPickupSlots: () =>
    apiFetch<{
      data: { slot: string; available: number; totalCapacity: number }[];
    }>("/orders/pickup-slots"),
};

// ─── Queue APIs ────────────────────────────────────────
export const queueAPI = {
  getLive: () =>
    apiFetch<{ data: BackendOrder[] }>("/queue/live"),

  updateStatus: (id: string, status: string, delay_reason?: string) =>
    apiFetch<{ data: BackendOrder }>(`/queue/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...(delay_reason ? { delay_reason } : {}) }),
    }),

  markDelayed: (id: string) =>
    apiFetch<{ data: BackendOrder }>(`/queue/${id}/delayed`, {
      method: "PATCH",
    }),
};

// ─── Collection APIs ───────────────────────────────────
export const collectionAPI = {
  verify: (data: { token_number?: string; order_id?: string; qr_payload?: string }) =>
    apiFetch<{ data: BackendOrder }>("/collection/verify", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  confirm: (data: { order_id?: string; token_number?: string }) =>
    apiFetch<{ data: BackendOrder }>("/collection/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  markNotCollected: (id: string) =>
    apiFetch(`/collection/${id}/not-collected`, { method: "PATCH" }),
};

// ─── Analytics APIs ────────────────────────────────────
export const analyticsAPI = {
  getDashboard: () =>
    apiFetch<{ data: any }>("/analytics/dashboard"),

  getReports: () =>
    apiFetch<{ data: any }>("/analytics/reports"),
};

// ─── AI APIs ───────────────────────────────────────────
export const aiAPI = {
  getDemandPrediction: () => apiFetch<{ data: any }>("/ai/demand-prediction"),
  getPeakTimePrediction: () => apiFetch<{ data: any }>("/ai/peak-time-prediction"),
  getPrepForecast: () => apiFetch<{ data: any }>("/ai/prep-forecasting"),
  getRecommendations: () => apiFetch<{ data: any }>("/ai/recommendations"),
  getWastePrediction: () => apiFetch<{ data: any }>("/ai/waste-prediction"),
  getDelayPrediction: () => apiFetch<{ data: any }>("/ai/delay-prediction"),
  getSalesInsights: () => apiFetch<{ data: any }>("/ai/sales-insights"),
};

// ─── Admin APIs ────────────────────────────────────────
export const adminAPI = {
  getUsers: () => apiFetch<{ data: any[] }>("/admin/users"),
  updateUserRoleStatus: (id: string, data: { role?: string; account_status?: string }) =>
    apiFetch(`/admin/users/${id}/role-status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  getSettings: () => apiFetch<{ data: any }>("/admin/settings"),
  updateSettings: (data: any) =>
    apiFetch("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getLogs: () => apiFetch<{ data: any[] }>("/admin/logs"),
};

// ─── Field Mappers (backend snake_case → frontend camelCase) ──

import type { MenuItem, Order, OrderItem, PickupSlot } from "../types";

export function mapBackendMenuItem(b: BackendMenuItem): MenuItem {
  return {
    id: b._id,
    name: b.item_name,
    category: b.category,
    price: b.price,
    image: b.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    availableQuantity: b.available_quantity,
    preparationTime: b.preparation_time,
    status: b.status as MenuItem["status"],
    description: `Fresh ${b.item_name} prepared daily.`,
    isVegetarian: b.category === "Meals" || b.category === "Salads",
    isFastPrep: b.preparation_time <= 5,
    underFive: b.price < 500,
    isPopular: (b.total_orders_count || 0) > 100,
    calories: undefined,
  };
}

export function mapBackendOrder(b: BackendOrder): Order {
  const statusToProgress: Record<string, number> = {
    Placed: 15,
    Accepted: 35,
    Preparing: 65,
    Ready: 100,
    Collected: 100,
    Completed: 100,
    Delayed: 50,
    Cancelled: 0,
    Rejected: 0,
    "Not Collected": 100,
  };

  return {
    id: b._id || b.order_id,
    tokenNumber: b.token_number,
    qrCode: b.qr_code,
    customerId: b.customer_id,
    customerName: b.customer_name,
    items: b.items.map(
      (it): OrderItem => ({
        id: it.order_item_id || it.item_id,
        menuItemId: it.item_id,
        name: it.item_name,
        price: it.price,
        quantity: it.quantity,
        specialInstruction: it.special_instruction || "",
      })
    ),
    totalAmount: b.total_amount,
    orderTime: new Date(b.order_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    pickupSlot: b.pickup_slot || "",
    estimatedReadyTime: b.estimated_ready_time
      ? new Date(b.estimated_ready_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    prepProgress: statusToProgress[b.order_status] || 15,
    status: b.order_status as Order["status"],
    pickupCounter: "Counter Station B — Hot Express",
    isDelayed: b.is_delayed,
    delayReason: b.delay_reason,
  };
}

export function mapBackendSlot(b: {
  slot: string;
  available: number;
  totalCapacity: number;
}): PickupSlot {
  return {
    id: `slot-${b.slot}`,
    timeSlot: b.slot,
    maxCapacity: b.totalCapacity,
    currentOrders: b.totalCapacity - b.available,
    isAvailable: b.available > 0,
    stationName: "Counter Station B — Hot Express",
  };
}
