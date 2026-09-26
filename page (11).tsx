'use client';
import Link from 'next/link';
import { useState } from 'react';
import universities from '@/data/universities.json';
import Sidebar from '@/components/Sidebar';

export default function Universities() {
  const [q, setQ] = useState('');
  const list = universities.filter((u: any) => u.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-2">Universities</h1>
        <p className="text-muted text-sm mb-4">Демо-база данных. Требования и дедлайны — примерные.</p>
        <input className="input max-w-xs mb-4" placeholder="Найти университет..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="grid md:grid-cols-3 gap-4">
          {list.map((u: any) => (
            <div key={u.id} className="card">
              <b>{u.name}</b>
              <div className="text-muted text-sm">{u.city}, {u.country}</div>
              <Link href={`/universities/${u.id}`} className="btn-ghost text-sm inline-block mt-3">Подробнее</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
