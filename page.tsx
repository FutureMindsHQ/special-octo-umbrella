'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    router.push('/dashboard');
  }

  return (
    <main className="max-w-sm mx-auto mt-20 px-6">
      <div className="card">
        <h1 className="text-xl font-bold mb-4">Вход в FutureMinds</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="btn w-full" type="submit">Войти</button>
        </form>
      </div>
    </main>
  );
}
