import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Medicine } from '../types/medicine.types';

export type RequestItem = {
  medicine: Medicine;
  quantity: number;
};

const STORAGE_KEY = 'order_request';

type OrderRequestContextType = {
  items: RequestItem[];
  addItem: (medicine: Medicine) => void;
  updateQuantity: (medicineId: number, quantity: number) => void;
  removeItem: (medicineId: number) => void;
  clearItems: () => void;
};

const OrderRequestContext = createContext<OrderRequestContextType | null>(null);

export function OrderRequestProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RequestItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (medicine: Medicine) => {
    setItems(prev => {
      const existing = prev.find(i => i.medicine.id === medicine.id);
      if (existing) {
        return prev.map(i =>
          i.medicine.id === medicine.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (medicineId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(medicineId);
      return;
    }
    setItems(prev =>
      prev.map(i => i.medicine.id === medicineId ? { ...i, quantity } : i)
    );
  };

  const removeItem = (medicineId: number) => {
    setItems(prev => prev.filter(i => i.medicine.id !== medicineId));
  };

  const clearItems = () => setItems([]);

  return (
    <OrderRequestContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearItems }}>
      {children}
    </OrderRequestContext.Provider>
  );
}

export function useOrderRequest() {
  const context = useContext(OrderRequestContext);
  if (!context) throw new Error('useOrderRequest must be used within OrderRequestProvider');
  return context;
}