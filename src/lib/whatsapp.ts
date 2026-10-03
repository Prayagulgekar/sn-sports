import { WA, inr } from './utils';
import type { CartItem } from './cart';
export const waLink = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
export function orderMessage(items: CartItem[]) {
  const lines = items.map((i, n) => [`${n + 1}. Product: ${i.name}`, `Size: ${i.size}`, i.color && `Color: ${i.color}`, i.playerName && `Name: ${i.playerName}`, i.playerNumber && `Number: ${i.playerNumber}`, i.teamName && `Team: ${i.teamName}`, `Quantity: ${i.qty}`, `Price: ${inr(i.unit)} each`, i.logo && 'Customization: Team Logo', i.notes && `Notes: ${i.notes}`].filter(Boolean).join('\n'));
  const total = items.reduce((s, i) => s + i.qty * i.unit, 0);
  return `Hello SN Sports,\n\nI want to order:\n\n${lines.join('\n\n')}\n\nTotal: ${inr(total)}\n\nPlease confirm availability and order details.`;
}
