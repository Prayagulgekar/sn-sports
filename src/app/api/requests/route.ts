import { NextResponse } from 'next/server'; import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';
const Body = z.object({ kind: z.enum(['bulk', 'tournament', 'league', 'custom']), customer_name: z.string().trim().min(2).max(100), phone: z.string().trim().regex(/^[+\d][\d\s-]{7,16}$/, 'Enter a valid phone number'),
  email: z.string().trim().email().optional().or(z.literal('')), team_name: z.string().max(100).optional(), sport: z.string().max(60).optional(),
  quantity: z.coerce.number().int().min(1).max(100000).optional().or(z.literal('').transform(() => undefined)), required_date: z.string().optional() }).passthrough();
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid form' }, { status: 400 });
  const { kind, customer_name, phone, email, team_name, sport, quantity, required_date, ...rest } = parsed.data;
  const details = Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v === 'string' && v.length <= 2000 && v !== ''));
  const { error } = await supabaseServer().from('requests').insert({ kind, customer_name, phone, email: email || null, team_name: team_name || null, sport: sport || null, quantity: quantity ?? null, required_date: required_date || null, details });
  if (error) return NextResponse.json({ error: 'Could not save your request. Please call us.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
