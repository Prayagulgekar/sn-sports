'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export type CartItem = { key: string; productId: string; name: string; image?: string; size: string; color?: string; qty: number; unit: number; playerName?: string; playerNumber?: string; teamName?: string; notes?: string; logo?: boolean };
type Ctx = { items: CartItem[]; add: (i: CartItem) => void; setQty: (k: string, q: number) => void; remove: (k: string) => void; clear: () => void; total: number; count: number };
const C = createContext<Ctx>(null!);
export const useCart = () => useContext(C);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem('sn-cart') || '[]')); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem('sn-cart', JSON.stringify(items)); } catch {} }, [items]);
  const add = (i: CartItem) => setItems((c) => c.some((x) => x.key === i.key) ? c.map((x) => x.key === i.key ? { ...x, qty: x.qty + i.qty } : x) : [...c, i]);
  const setQty = (k: string, q: number) => setItems((c) => c.map((x) => x.key === k ? { ...x, qty: Math.max(1, q) } : x));
  return <C.Provider value={{ items, add, setQty, remove: (k) => setItems((c) => c.filter((x) => x.key !== k)), clear: () => setItems([]), total: items.reduce((s, i) => s + i.qty * i.unit, 0), count: items.reduce((s, i) => s + i.qty, 0) }}>{children}</C.Provider>;
}
