'use client';
import { useState } from 'react'; import { supabaseBrowser } from '@/lib/supabase/client';
export default function Login() {
  const [msg, setMsg] = useState(''); const [email, setEmail] = useState('');
  async function go(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const pw = String(new FormData(e.currentTarget).get('password'));
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password: pw }); if (error) setMsg('Invalid email or password'); else window.location.href = '/admin'; }
  async function reset() { if (!email) return setMsg('Enter your email first'); await supabaseBrowser().auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/admin' }); setMsg('If this email exists, a reset link has been sent.'); }
  return (<div className="grid min-h-screen place-items-center bg-ink p-4"><form onSubmit={go} className="grid w-full max-w-sm gap-3 rounded-2xl bg-white p-6"><h1 className="font-display text-4xl font-bold uppercase">Admin login</h1>
    <input className="input" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input className="input" name="password" type="password" required placeholder="Password" />
    {msg && <p role="alert" className="text-sm text-red-600">{msg}</p>}<button className="btn btn-blue">Login</button><button type="button" onClick={reset} className="text-sm underline">Forgot password?</button></form></div>);
}
