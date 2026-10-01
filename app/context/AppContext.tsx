"use client";

import React, { createContext, useContext, useState } from "react";
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

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  smartCardBalance?: number;
  studentId?: string;
}

const MOCK_USERS: Record<UserRole, UserAccount> = {
  customer: {
    id: "u-cust-1",
    name: "Alex Rivera",
    email: "alex.rivera@campus.edu.pk",
    role: "customer",
    smartCardBalance: 34.5,
    studentId: "MUET - 24CS031",
  },
  kitchen: {
    id: "u-kitch-1",
    name: "Chef Marcus Vance",
    email: "marcus.vance@canteen.edu.pk",
    role: "kitchen",
  },
  manager: {
    id: "u-mgr-1",
    name: "Elena Rostova",
    email: "elena.r@canteen.edu.pk",
    role: "manager",
  },
  admin: {
    id: "u-admin-1",
    name: "Admin Director",
    email: "admin@canteen.edu.pk",
    role: "admin",
  },
};

const INITIAL_MENU: MenuItem[] = [
  {
    id: "item-1",
    name: "Chicken Deluxe Burger",
    category: "Burgers",
    price: 4.5,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 12,
    preparationTime: 8,
    status: "Available",
    description: "Crispy chicken patty, cheddar cheese, crisp lettuce & house brioche bun.",
    isVegetarian: false,
    isFastPrep: true,
    underFive: true,
    isPopular: true,
    calories: 540,
  },
  {
    id: "item-2",
    name: "Mango Passion Sparkler",
    category: "Beverages",
    price: 2.8,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 25,
    preparationTime: 3,
    status: "Available",
    description: "Chilled sparkling passionfruit with mint leaves & zero artificial sugar.",
    isVegetarian: true,
    isFastPrep: true,
    underFive: true,
    isPopular: true,
    calories: 120,
  },
  {
    id: "item-3",
    name: "Golden Crispy Fries",
    category: "Snacks",
    price: 2.5,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 18,
    preparationTime: 5,
    status: "Available",
    description: "Seasoned sea-salt golden crinkle cut potato fries.",
    isVegetarian: true,
    isFastPrep: true,
    underFive: true,
    isPopular: true,
    calories: 320,
  },
  {
    id: "item-4",
    name: "Artisanal Veggie Buddha Bowl",
    category: "Meals",
    price: 6.2,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 8,
    preparationTime: 12,
    status: "Available",
    description: "Quinoa, avocado, roasted chickpea, fresh kale, and tahini drizzle.",
    isVegetarian: true,
    isFastPrep: false,
    underFive: false,
    isPopular: false,
    calories: 410,
  },
  {
    id: "item-5",
    name: "Classic Iced Matcha Latte",
    category: "Beverages",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 15,
    preparationTime: 4,
    status: "Available",
    description: "Ceremonial grade Uji matcha with chilled oat milk.",
    isVegetarian: true,
    isFastPrep: true,
    underFive: true,
    isPopular: true,
    calories: 160,
  },
  {
    id: "item-6",
    name: "Spicy Paneer Tikka Wrap",
    category: "Meals",
    price: 4.9,
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 6,
    preparationTime: 9,
    status: "Limited",
    description: "Grilled cottage cheese cubes, mint chutney, wrapped in whole wheat flatbread.",
    isVegetarian: true,
    isFastPrep: true,
    underFive: true,
    isPopular: false,
    calories: 460,
  },
  {
    id: "item-7",
    name: "Double Chocolate Brownie Sundae",
    category: "Desserts",
    price: 3.2,
    image:
      "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 0,
    preparationTime: 4,
    status: "Sold Out",
    description: "Fudgy chocolate brownie served warm with vanilla gelato.",
    isVegetarian: true,
    isFastPrep: true,
    underFive: true,
    isPopular: true,
    calories: 480,
  },
  {
    id: "item-8",
    name: "Smokey BBQ Bacon Burger",
    category: "Burgers",
    price: 5.8,
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
    availableQuantity: 10,
    preparationTime: 10,
    status: "Available",
    description: "Angus beef patty, crispy strip bacon, BBQ glaze & onion rings.",
    isVegetarian: false,
    isFastPrep: false,
    underFive: false,
    isPopular: true,
    calories: 680,
  },
];

const INITIAL_SLOTS: PickupSlot[] = [
  {
    id: "slot-1",
    timeSlot: "1:00 PM – 1:15 PM",
    maxCapacity: 20,
    currentOrders: 20,
    isAvailable: false,
    stationName: "Express Station Locker A",
  },
  {
    id: "slot-2",
    timeSlot: "1:15 PM – 1:30 PM",
    maxCapacity: 20,
    currentOrders: 14,
    isAvailable: true,
    stationName: "Counter Station B — Hot Express",
  },
  {
    id: "slot-3",
    timeSlot: "1:30 PM – 1:45 PM",
    maxCapacity: 20,
    currentOrders: 8,
    isAvailable: true,
    stationName: "Counter Station B — Hot Express",
  },
  {
    id: "slot-4",
    timeSlot: "1:45 PM – 2:00 PM",
    maxCapacity: 20,
    currentOrders: 3,
    isAvailable: true,
    stationName: "Express Pickup Gate 3",
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    tokenNumber: "C-023",
    customerId: "cust-1",
    customerName: "Alex Rivera",
    items: [
      {
        id: "oi-1",
        menuItemId: "item-1",
        name: "Chicken Deluxe Burger",
        price: 4.5,
        quantity: 1,
        specialInstruction: "Extra mayo, no raw onions",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "oi-2",
        menuItemId: "item-2",
        name: "Mango Passion Sparkler",
        price: 2.8,
        quantity: 2,
        specialInstruction: "Less ice, extra mint",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmount: 10.1,
    orderTime: "12:54 PM",
    pickupSlot: "1:15 PM – 1:30 PM",
    estimatedReadyTime: "1:18 PM",
    prepProgress: 65,
    status: "Preparing",
    pickupCounter: "Counter Station B — Hot Express Griddle",
    specialNotes: "Student has 15-min gap between lectures.",
  },
  {
    id: "ord-100",
    tokenNumber: "C-022",
    customerId: "cust-2",
    customerName: "Jordan Smith",
    items: [
      {
        id: "oi-3",
        menuItemId: "item-3",
        name: "Golden Crispy Fries",
        price: 2.5,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "oi-4",
        menuItemId: "item-5",
        name: "Classic Iced Matcha Latte",
        price: 3.5,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmount: 6.0,
    orderTime: "12:48 PM",
    pickupSlot: "1:00 PM – 1:15 PM",
    estimatedReadyTime: "1:10 PM",
    prepProgress: 100,
    status: "Ready",
    pickupCounter: "Express Station Locker A",
  },
  {
    id: "ord-099",
    tokenNumber: "C-021",
    customerId: "cust-3",
    customerName: "Samantha Reed",
    items: [
      {
        id: "oi-5",
        menuItemId: "item-4",
        name: "Artisanal Veggie Buddha Bowl",
        price: 6.2,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      },
    ],
    totalAmount: 6.2,
    orderTime: "12:35 PM",
    pickupSlot: "1:00 PM – 1:15 PM",
    estimatedReadyTime: "12:55 PM",
    prepProgress: 100,
    status: "Collected",
    pickupCounter: "Counter Station B",
  },
];

const INITIAL_AI_INSIGHTS: AIInsight[] = [
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserAccount>(MOCK_USERS.customer);

  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([
    {
      menuItem: INITIAL_MENU[0],
      quantity: 1,
      specialInstruction: "Extra mayo, no onions",
    },
    {
      menuItem: INITIAL_MENU[1],
      quantity: 2,
      specialInstruction: "Less ice, extra mint",
    },
  ]);
  const [slots, setSlots] = useState<PickupSlot[]>(INITIAL_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("slot-2");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [aiInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setCurrentUser(MOCK_USERS[newRole]);
    setIsAuthenticated(true);
    showToast(`Switched active session to ${newRole.toUpperCase()} (${MOCK_USERS[newRole].name})`);
  };

  const login = (newRole: UserRole) => {
    setRoleState(newRole);
    setCurrentUser(MOCK_USERS[newRole]);
    setIsAuthenticated(true);
    showToast(`Logged in successfully as ${MOCK_USERS[newRole].name} (${newRole.toUpperCase()})`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast("Logged out of Smart Canteen session");
  };

  // Menu CRUD
  const saveMenuItem = (itemData: Partial<MenuItem> & { id?: string }) => {
    if (itemData.id) {
      // Edit
      setMenu((prev) =>
        prev.map((m) => (m.id === itemData.id ? ({ ...m, ...itemData } as MenuItem) : m))
      );
      showToast(`Updated menu item "${itemData.name}"`);
    } else {
      // Add
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: itemData.name || "New Food Item",
        category: itemData.category || "Meals",
        price: itemData.price || 4.0,
        image:
          itemData.image ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
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
      showToast(`Added new item "${newItem.name}" to canteen menu!`);
    }
  };

  const deleteMenuItem = (itemId: string) => {
    setMenu((prev) => prev.filter((m) => m.id !== itemId));
    showToast("Deleted item from canteen menu.");
  };

  // Cart operations
  const addToCart = (item: MenuItem) => {
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
  };

  const updateCartQty = (itemId: string, delta: number) => {
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
  };

  const updateCartInstruction = (itemId: string, note: string) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.menuItem.id === itemId ? { ...ci, specialInstruction: note } : ci
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place Pre-Order
  const placeOrder = (slotId: string): Order | null => {
    if (cart.length === 0) return null;
    const targetSlot = slots.find((s) => s.id === slotId) || slots[1];

    if (!targetSlot.isAvailable || targetSlot.currentOrders >= targetSlot.maxCapacity) {
      showToast("Selected pickup slot is full! Please choose another slot.");
      return null;
    }

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
      pickupSlot: targetSlot.timeSlot,
      estimatedReadyTime: "1:22 PM",
      prepProgress: 15,
      status: "Placed",
      pickupCounter: targetSlot.stationName,
    };

    setSlots((prev) =>
      prev.map((s) =>
        s.id === targetSlot.id
          ? {
              ...s,
              currentOrders: s.currentOrders + 1,
              isAvailable: s.currentOrders + 1 < s.maxCapacity,
            }
          : s
      )
    );

    setMenu((prev) =>
      prev.map((m) => {
        const orderedItem = cart.find((ci) => ci.menuItem.id === m.id);
        if (orderedItem) {
          const newQty = Math.max(0, m.availableQuantity - orderedItem.quantity);
          return {
            ...m,
            availableQuantity: newQty,
            status: newQty === 0 ? "Sold Out" : newQty <= 3 ? "Limited" : m.status,
          };
        }
        return m;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Pre-Order Confirmed! Token #${tokenNum} issued.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
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
  };

  const activeOrder =
    orders.find((o) => ["Placed", "Accepted", "Preparing", "Ready"].includes(o.status)) ||
    orders[0] ||
    null;

  const updatePreferences = (newPrefs: Partial<CustomerPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
    showToast("Dietary preferences updated!");
  };

  const toggleItemStatus = (itemId: string) => {
    setMenu((prev) =>
      prev.map((m) => {
        if (m.id === itemId) {
          const nextStatus: ItemStatus =
            m.status === "Available" ? "Sold Out" : "Available";
          return {
            ...m,
            status: nextStatus,
            availableQuantity: nextStatus === "Sold Out" ? 0 : 15,
          };
        }
        return m;
      })
    );
  };

  const updateItemStock = (itemId: string, newStock: number) => {
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
  };

  const stats: CanteenStats = {
    totalOrdersToday: 186,
    activeOrders: orders.filter((o) =>
      ["Placed", "Accepted", "Preparing", "Ready"].includes(o.status)
    ).length,
    preparingOrders: orders.filter((o) => o.status === "Preparing").length,
    readyOrders: orders.filter((o) => o.status === "Ready").length,
    completedOrders: 153,
    cancelledOrders: 15,
    totalSalesToday: 894.5,
    avgPrepTimeMinutes: 11,
    peakOrderingTime: "1:00 PM – 1:30 PM",
    popularItems: [
      { name: "Chicken Deluxe Burger", count: 74 },
      { name: "Mango Passion Sparkler", count: 58 },
      { name: "Golden Crispy Fries", count: 49 },
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
