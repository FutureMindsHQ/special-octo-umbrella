'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';

const FIELDS: [string, string][] = [
  ['name', 'Имя'], ['surname', 'Фамилия'], ['age', 'Возраст'], ['country', 'Страна'],
  ['city', 'Город'], ['school', 'Школа/университет'], ['grade', 'Класс/курс'], ['gpa', 'GPA'],
  ['major', 'Специальность'], ['countries', 'Интересующие страны'], ['github', 'GitHub'],
];
const COUNTERS: [string, string][] = [
  ['olympiads_count', 'Олимпиады'], ['projects_count', 'Проекты'], ['research_count', 'Исследования'],
  ['leadership_count', 'Лидерство'], ['volunteering_count', 'Волонтёрство'], ['programming_count', 'Программирование'],
];

export default function Profile() {
  const [p, setP] = useState<any>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setP(data || { id: user.id });
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').upsert({ ...p, id: user.id });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Мой профиль</h1>
        <form onSubmit={save} className="card space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            {FIELDS.map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-muted">{label}</label>
                <input className="input" value={p[key] || ''} onChange={(e) => setP({ ...p, [key]: e.target.value })} />
              </div>
            ))}
          </div>
          <h3 className="font-semibold pt-2">Счётчики для Skill Gap</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {COUNTERS.map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-muted">{label}</label>
                <input type="number" className="input" value={p[key] ?? 0} onChange={(e) => setP({ ...p, [key]: Number(e.target.value) })} />
              </div>
            ))}
          </div>
          <button className="btn" type="submit">Сохранить профиль</button>
          {saved && <span className="text-primary text-sm ml-3">Сохранено ✓</span>}
        </form>
      </main>
    </div>
  );
}
