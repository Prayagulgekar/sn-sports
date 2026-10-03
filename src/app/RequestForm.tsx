'use client';
import { useState } from 'react';
export type Field = { name: string; label: string; type?: 'text' | 'tel' | 'email' | 'number' | 'date' | 'textarea'; required?: boolean };
export default function RequestForm({ kind, fields, cta }: { kind: string; fields: Field[]; cta: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | string>('idle');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState('sending');
    const body = Object.fromEntries(new FormData(e.currentTarget)); body.kind = kind;
    try { const r = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const j = await r.json(); setState(r.ok ? 'done' : j.error || 'Something went wrong. Please call us.'); } catch { setState('Network error. Please try again or call us.'); }
  }
  if (state === 'done') return <div className="rounded-2xl bg-chalk p-8"><h2 className="font-display text-3xl font-bold uppercase">Request received</h2><p className="mt-2">We will contact you on your phone number soon.</p></div>;
  return (<form onSubmit={submit} className="grid gap-4">
    {fields.map((f) => <label key={f.name} className="grid gap-1 text-sm font-medium">{f.label}{f.required && ' *'}
      {f.type === 'textarea' ? <textarea name={f.name} required={f.required} maxLength={2000} className="input" rows={4} /> : <input name={f.name} type={f.type ?? 'text'} required={f.required} maxLength={200} className="input" />}</label>)}
    <p className="text-sm text-neutral-600">Logo or reference images: send them on WhatsApp after submitting.</p>
    {state !== 'idle' && state !== 'sending' && <p role="alert" className="text-red-600">{state}</p>}
    <button disabled={state === 'sending'} className="btn btn-blue disabled:opacity-50">{state === 'sending' ? 'Sending…' : cta}</button></form>);
}
