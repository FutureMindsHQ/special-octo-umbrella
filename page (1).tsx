'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); return; }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, name });
    }
    router.push('/profile');
  }

  return (
    <main className="max-w-sm mx-auto mt-20 px-6">
      <div className="card">
        <h1 className="text-xl font-bold mb-1">Создать профиль</h1>
        <p className="text-muted text-sm mb-4">Регистрация в FutureMinds</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted">Имя</label>
            <input className="input" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted">Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted">Пароль</label>
            <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="btn w-full" type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </main>
  );
}
