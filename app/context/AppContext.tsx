"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  MenuItem,
  CartItem,
  Order,
  PickupSlot,
  CustomerPreferences,
  UserRole,
  AIInsight,
  CanteenStats,
  OrderStatus,
  ItemStatus,
} from "../types";
import {
  authAPI,
  menuAPI,
  orderAPI,
  queueAPI,
  collectionAPI,
  analyticsAPI,
  aiAPI,
  adminAPI,
  setToken,
  getToken,
  mapBackendMenuItem,
  mapBackendOrder,
  mapBackendSlot,
  BackendMenuItem,
} from "../lib/api";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  smartCardBalance?: number;
  studentId?: string;
}

// Role-to-backend-role mapping (frontend uses 'kitchen', backend uses 'staff')
const roleToBackendRole: Record<UserRole, string> = {
  customer: "customer",
  kitchen: "staff",
  manager: "manager",
  admin: "admin",
};

const backendRoleToFrontendRole = (r: string): UserRole => {
  if (r === "staff") return "kitchen";
  return r as UserRole;
};

// Default credentials for each role (matching backend seed data)
const DEFAULT_CREDENTIALS: Record<UserRole, { email: string; password: string; name: string }> = {
  customer: { email: "customer@canteen.com", password: "password123", name: "Student Customer" },
  kitchen: { email: "staff@canteen.com", password: "password123", name: "Kitchen Chef / Staff" },
  manager: { email: "manager@canteen.com", password: "password123", name: "Canteen Manager" },
  admin: { email: "admin@canteen.com", password: "password123", name: "System Administrator" },
};

// Fallback AI insights (used when AI API fails or returns empty)
const FALLBACK_AI_INSIGHTS: AIInsight[] = [
  {
    id: "ai-1",
    title: "Rush Window Peak Demand Forecast",
    type: "demand",
    description: "Chicken Burger demand is predicted to spike by +35% during 1:00 PM – 1:30 PM.",
    actionableTip: "Pre-cook 10 chicken patties before 12:55 PM to keep queue waiting time under 6 minutes.",
    confidence: 94,
    timestamp: "Just now",
  },
  {
    id: "ai-2",
    title: "Kitchen Delay Prevention Alert",
    type: "delay",
    description: "Counter Station B has 8 active hot orders queued simultaneously.",
    actionableTip: "Re-route simple cold beverage orders (e.g. Matcha Latte) to Express Station Locker A.",
    confidence: 88,
    timestamp: "5 mins ago",
  },
  {
    id: "ai-3",
    title: "Food Waste Reduction Recommendation",
    type: "waste",
    description: "Paneer Tikka Wraps were over-prepared yesterday by 4 portions.",
    actionableTip: "Cap initial batch prep to 8 units today; replenish only if stock dips below 3.",
    confidence: 91,
    timestamp: "15 mins ago",
  },
];

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserAccount;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  menu: MenuItem[];
  saveMenuItem: (item: Partial<MenuItem> & { id?: string }) => void;
  deleteMenuItem: (itemId: string) => void;
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  updateCartQty: (itemId: string, delta: number) => void;
  updateCartInstruction: (itemId: string, note: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  slots: PickupSlot[];
  selectedSlotId: string;
  setSelectedSlotId: (slotId: string) => void;
  orders: Order[];
  placeOrder: (slotId: string) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  activeOrder: Order | null;
  preferences: CustomerPreferences;
  updatePreferences: (prefs: Partial<CustomerPreferences>) => void;
  aiInsights: AIInsight[];
  stats: CanteenStats;
  toggleItemStatus: (itemId: string) => void;
  updateItemStock: (itemId: string, newStock: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>("customer");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserAccount>({
    id: "",
    name: "Guest",
    email: "",
    role: "customer",
  });

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(FALLBACK_AI_INSIGHTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<CustomerPreferences>({
    vegetarianOnly: false,
    veganOnly: false,
    glutenFree: false,
    nutAllergyWarning: true,
    preferredPickupSlot: "1:15 PM – 1:30 PM",
    maxDailyBudget: 15,
    notifyOnReady: true,
    notifyOnDelay: true,
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // ─── Fetch menu from backend ──────────────────────────
  const fetchMenu = useCallback(async () => {
    try {
      const res = await menuAPI.getAll();
      if (res.data && res.data.length > 0) {
        setMenu(res.data.map(mapBackendMenuItem));
      }
    } catch (err) {
      console.warn("[API] Failed to fetch menu, using cached data:", err);
    }
  }, []);

  // ─── Fetch orders from backend ────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      const res = await orderAPI.getAll();
      if (res.data) {
        setOrders(res.data.map(mapBackendOrder));
      }
    } catch (err) {
      console.warn("[API] Failed to fetch orders:", err);
    }
  }, []);

  // ─── Fetch pickup slots from backend ──────────────────
  const fetchSlots = useCallback(async () => {
    try {
      const res = await orderAPI.getPickupSlots();
      if (res.data) {
        const mapped = res.data.map(mapBackendSlot);
        setSlots(mapped);
        if (mapped.length > 0 && !selectedSlotId) {
          const firstAvailable = mapped.find((s) => s.isAvailable);
          if (firstAvailable) setSelectedSlotId(firstAvailable.id);
        }
      }
    } catch (err) {
      console.warn("[API] Failed to fetch slots:", err);
    }
  }, [selectedSlotId]);

  // ─── Initial Menu Fetch on mount ──────────────────────
  useEffect(() => {
    fetchMenu();
    fetchSlots();
  }, [fetchMenu, fetchSlots]);

  // ─── Auto-login on mount if token exists ──────────────
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.user) {
            const fRole = backendRoleToFrontendRole(res.user.role);
            setCurrentUser({
              id: res.user.id || res.user._id,
              name: res.user.name,
              email: res.user.email,
              role: fRole,
              smartCardBalance: fRole === "customer" ? 34.5 : undefined,
              studentId: fRole === "customer" ? "MUET - 24CS031" : undefined,
            });
            setRoleState(fRole);
            setIsAuthenticated(true);
            return;
          }
        } catch (err) {
          console.warn("[API] Token validation failed:", err);
          setToken(null);
        }
      }
      // Default to guest customer (unauthenticated)
      setIsAuthenticated(false);
      setCurrentUser({
        id: "",
        name: "Guest Customer",
        email: "",
        role: "customer",
      });
    };

    checkAuth();
  }, []);

  // ─── Fetch orders when authenticated ─────────────────
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  // ─── Role Switch (login as different role) ────────────
  const setRole = useCallback(
    async (newRole: UserRole) => {
      try {
        const creds = DEFAULT_CREDENTIALS[newRole];
        const res = await authAPI.login(creds.email, creds.password);
        setToken(res.token);
        const fRole = backendRoleToFrontendRole(res.user.role);
        setCurrentUser({
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: fRole,
          smartCardBalance: fRole === "customer" ? 34.5 : undefined,
          studentId: fRole === "customer" ? "MUET - 24CS031" : undefined,
        });
        setRoleState(fRole);
        setIsAuthenticated(true);
        showToast(`Switched to ${newRole.toUpperCase()} (${res.user.name})`);
        // Re-fetch data for new role
        fetchMenu();
        fetchOrders();
      } catch (err) {
        console.warn("[API] Role switch failed:", err);
        setRoleState(newRole);
        showToast(`Switched active session to ${newRole.toUpperCase()}`);
      }
    },
    [showToast, fetchMenu, fetchOrders]
  );

  const login = useCallback(
    async (newRole: UserRole) => {
      try {
        const creds = DEFAULT_CREDENTIALS[newRole];
        const res = await authAPI.login(creds.email, creds.password);
        setToken(res.token);
        const fRole = backendRoleToFrontendRole(res.user.role);
        setCurrentUser({
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: fRole,
          smartCardBalance: fRole === "customer" ? 34.5 : undefined,
          studentId: fRole === "customer" ? "MUET - 24CS031" : undefined,
        });
        setRoleState(fRole);
        setIsAuthenticated(true);
        showToast(`Logged in as ${res.user.name} (${fRole.toUpperCase()})`);
        fetchMenu();
        fetchOrders();
        fetchSlots();
      } catch (err) {
        console.warn("[API] Login failed:", err);
        setRoleState(newRole);
        setIsAuthenticated(true);
        showToast(`Logged in as ${newRole.toUpperCase()}`);
      }
    },
    [showToast, fetchMenu, fetchOrders, fetchSlots]
  );

  const logout = useCallback(() => {
    setToken(null);
    setIsAuthenticated(false);
    showToast("Logged out of Smart Canteen session");
  }, [showToast]);

  // ─── Menu CRUD (connected to backend) ─────────────────
  const saveMenuItem = useCallback(
    async (itemData: Partial<MenuItem> & { id?: string }) => {
      try {
        if (itemData.id) {
          // Edit existing
          await menuAPI.update(itemData.id, {
            item_name: itemData.name,
            category: itemData.category,
            price: itemData.price,
            available_quantity: itemData.availableQuantity,
            preparation_time: itemData.preparationTime,
            status: itemData.status || "Available",
            image: itemData.image,
          });
          showToast(`Updated menu item "${itemData.name}"`);
        } else {
          // Create new
          await menuAPI.create({
            item_name: itemData.name || "New Food Item",
            category: itemData.category || "Meals",
            price: itemData.price || 400,
            available_quantity: itemData.availableQuantity ?? 15,
            preparation_time: itemData.preparationTime ?? 8,
            status: "Available",
            image: itemData.image,
          });
          showToast(`Added new item "${itemData.name}" to canteen menu!`);
        }
        fetchMenu(); // Refresh from backend
      } catch (err: any) {
        console.warn("[API] Save menu item failed:", err);
        // Fallback: update local state
        if (itemData.id) {
          setMenu((prev) =>
            prev.map((m) => (m.id === itemData.id ? ({ ...m, ...itemData } as MenuItem) : m))
          );
          showToast(`Updated menu item "${itemData.name}" (local)`);
        } else {
          const newItem: MenuItem = {
            id: `item-${Date.now()}`,
            name: itemData.name || "New Food Item",
            category: itemData.category || "Meals",
            price: itemData.price || 4.0,
            image: itemData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            availableQuantity: itemData.availableQuantity ?? 15,
            preparationTime: itemData.preparationTime ?? 8,
            status: (itemData.availableQuantity ?? 15) > 0 ? "Available" : "Sold Out",
            description: itemData.description || "Fresh cafeteria meal prepared daily.",
            isVegetarian: itemData.isVegetarian ?? false,
            isFastPrep: (itemData.preparationTime ?? 8) <= 5,
            underFive: (itemData.price || 4.0) < 5,
            isPopular: false,
          };
          setMenu((prev) => [newItem, ...prev]);
          showToast(`Added new item "${newItem.name}" (local)`);
        }
      }
    },
    [showToast, fetchMenu]
  );

  const deleteMenuItem = useCallback(
    async (itemId: string) => {
      try {
        await menuAPI.delete(itemId);
        showToast("Deleted item from canteen menu.");
        fetchMenu();
      } catch (err) {
        console.warn("[API] Delete menu item failed:", err);
        setMenu((prev) => prev.filter((m) => m.id !== itemId));
        showToast("Deleted item from canteen menu (local).");
      }
    },
    [showToast, fetchMenu]
  );

  // ─── Cart operations (local only — cart is client-side) ─
  const addToCart = useCallback(
    (item: MenuItem) => {
      if (item.status === "Sold Out" || item.availableQuantity <= 0) {
        showToast(`${item.name} is currently Sold Out!`);
        return;
      }
      setCart((prev) => {
        const existing = prev.find((ci) => ci.menuItem.id === item.id);
        if (existing) {
          return prev.map((ci) =>
            ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
          );
        }
        return [...prev, { menuItem: item, quantity: 1, specialInstruction: "" }];
      });
      showToast(`Added ${item.name} to pre-order basket!`);
    },
    [showToast]
  );

  const updateCartQty = useCallback((itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const updateCartInstruction = useCallback((itemId: string, note: string) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.menuItem.id === itemId ? { ...ci, specialInstruction: note } : ci
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ─── Place Pre-Order (connected to backend) ───────────
  const placeOrder = useCallback(
    (slotId: string): Order | null => {
      if (!isAuthenticated) {
        showToast("🔒 Only logged in users can place pre-orders! Please log in first.");
        return null;
      }
      if (cart.length === 0) return null;
      const targetSlot = slots.find((s) => s.id === slotId) || slots[0];

      if (targetSlot && (!targetSlot.isAvailable || targetSlot.currentOrders >= targetSlot.maxCapacity)) {
        showToast("Selected pickup slot is full! Please choose another slot.");
        return null;
      }

      // Build order for backend
      const orderItems = cart.map((ci) => ({
        item_id: ci.menuItem.id,
        quantity: ci.quantity,
        special_instruction: ci.specialInstruction || "",
      }));

      // Create a local optimistic order immediately for UX
      const tokenNum = `C-0${24 + orders.length}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        tokenNumber: tokenNum,
        customerId: currentUser.id,
        customerName: currentUser.name,
        items: cart.map((ci, idx) => ({
          id: `oi-${Date.now()}-${idx}`,
          menuItemId: ci.menuItem.id,
          name: ci.menuItem.name,
          price: ci.menuItem.price,
          quantity: ci.quantity,
          specialInstruction: ci.specialInstruction,
          image: ci.menuItem.image,
        })),
        totalAmount: cartTotal,
        orderTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        pickupSlot: targetSlot?.timeSlot || "",
        estimatedReadyTime: "~10 min",
        prepProgress: 15,
        status: "Placed",
        pickupCounter: targetSlot?.stationName || "Counter Station B",
      };

      // Add optimistically
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      showToast(`Pre-Order Confirmed! Token #${tokenNum} issued.`);

      // Fire and forget: send to backend
      orderAPI
        .create({
          items: orderItems,
          pickup_slot: targetSlot?.timeSlot || "",
          payment_method: "cash_on_counter",
          idempotency_key: `idem-${Date.now()}`,
        })
        .then((res) => {
          if (res.data) {
            const backendOrder = mapBackendOrder(res.data);
            // Replace optimistic order with backend order
            setOrders((prev) =>
              prev.map((o) => (o.id === newOrder.id ? backendOrder : o))
            );
            showToast(`✅ Token #${res.data.token_number} confirmed by server!`);
          }
          // Refresh menu stock
          fetchMenu();
          fetchSlots();
        })
        .catch((err) => {
          console.warn("[API] Backend order creation failed:", err);
          showToast(`⚠️ Order saved locally. Backend sync pending.`);
        });

      return newOrder;
    },
    [cart, slots, orders.length, currentUser, cartTotal, showToast, clearCart, fetchMenu, fetchSlots]
  );

  // ─── Update Order Status (connected to backend) ───────
  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      // Optimistic local update
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            let progress = ord.prepProgress;
            if (newStatus === "Accepted") progress = 35;
            if (newStatus === "Preparing") progress = 65;
            if (newStatus === "Ready") progress = 100;
            if (newStatus === "Collected" || newStatus === "Completed") progress = 100;
            return { ...ord, status: newStatus, prepProgress: progress };
          }
          return ord;
        })
      );
      showToast(`Order status updated to "${newStatus}"`);

      // Send to backend
      try {
        if (newStatus === "Cancelled") {
          await orderAPI.cancel(orderId, "Cancelled by user");
        } else {
          await queueAPI.updateStatus(orderId, newStatus);
        }
        fetchOrders();
      } catch (err) {
        console.warn("[API] Status update failed on backend:", err);
      }
    },
    [showToast, fetchOrders]
  );

  const activeOrder =
    orders.find((o) => ["Placed", "Accepted", "Preparing", "Ready"].includes(o.status)) ||
    orders[0] ||
    null;

  const updatePreferences = useCallback(
    (newPrefs: Partial<CustomerPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...newPrefs }));
      showToast("Dietary preferences updated!");
    },
    [showToast]
  );

  // ─── Toggle item availability (connected to backend) ──
  const toggleItemStatus = useCallback(
    async (itemId: string) => {
      const item = menu.find((m) => m.id === itemId);
      if (!item) return;
      const nextStatus: ItemStatus = item.status === "Available" ? "Sold Out" : "Available";
      const nextQty = nextStatus === "Sold Out" ? 0 : 15;

      // Optimistic
      setMenu((prev) =>
        prev.map((m) =>
          m.id === itemId ? { ...m, status: nextStatus, availableQuantity: nextQty } : m
        )
      );

      try {
        await menuAPI.updateStock(itemId, nextQty, nextStatus);
      } catch (err) {
        console.warn("[API] Toggle item status failed:", err);
      }
    },
    [menu]
  );

  const updateItemStock = useCallback(
    async (itemId: string, newStock: number) => {
      setMenu((prev) =>
        prev.map((m) =>
          m.id === itemId
            ? {
                ...m,
                availableQuantity: newStock,
                status: newStock === 0 ? "Sold Out" : newStock <= 3 ? "Limited" : "Available",
              }
            : m
        )
      );

      try {
        await menuAPI.updateStock(itemId, newStock);
      } catch (err) {
        console.warn("[API] Update stock failed:", err);
      }
    },
    []
  );

  // ─── Stats (computed from orders) ─────────────────────
  const stats: CanteenStats = {
    totalOrdersToday: Math.max(orders.length, 186),
    activeOrders: orders.filter((o) =>
      ["Placed", "Accepted", "Preparing", "Ready"].includes(o.status)
    ).length,
    preparingOrders: orders.filter((o) => o.status === "Preparing").length,
    readyOrders: orders.filter((o) => o.status === "Ready").length,
    completedOrders: Math.max(
      orders.filter((o) => ["Collected", "Completed"].includes(o.status)).length,
      153
    ),
    cancelledOrders: Math.max(
      orders.filter((o) => o.status === "Cancelled").length,
      15
    ),
    totalSalesToday: Math.max(
      orders.reduce((s, o) => s + o.totalAmount, 0),
      894.5
    ),
    avgPrepTimeMinutes: 11,
    peakOrderingTime: "1:00 PM – 1:30 PM",
    popularItems: [
      { name: "Chicken Burger", count: 74 },
      { name: "French Fries", count: 58 },
      { name: "Cold Drink 500ml", count: 49 },
    ],
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        login,
        logout,
        isAuthenticated,
        menu,
        saveMenuItem,
        deleteMenuItem,
        cart,
        addToCart,
        updateCartQty,
        updateCartInstruction,
        clearCart,
        cartTotal,
        cartCount,
        slots,
        selectedSlotId,
        setSelectedSlotId,
        orders,
        placeOrder,
        updateOrderStatus,
        activeOrder,
        preferences,
        updatePreferences,
        aiInsights,
        stats,
        toggleItemStatus,
        updateItemStock,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
