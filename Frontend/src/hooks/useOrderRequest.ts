import { useState, useEffect } from 'react';
import { Medicine } from '../types/medicine.types';

export type CartItem = {
  medicine: Medicine;
  quantity: number;
};

const STORAGE_KEY = 'order_request';

export function useOrderRequest() {
  const [items, setItems] = useState<CartItem[]>(() => {
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
        // すでにある場合は数量+1
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

  const clearItems = () => {
    setItems([]);
  };

  return { items, addItem, updateQuantity, removeItem, clearItems };
}