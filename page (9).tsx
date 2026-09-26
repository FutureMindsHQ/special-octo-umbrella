'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { roadmap12 } from '@/lib/skillGap';
import Sidebar from '@/components/Sidebar';

export default function RoadmapPage() {
  const [p, setP] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setP(data);
    })();
  }, []);

  if (!p) return <main className="p-8">Загрузка...</main>;

  const months = roadmap12({
    gpa: p.gpa, english: p.english, programmingCount: p.programming_count, mathScore: p.math_score,
    projectsCount: p.projects_count, researchCount: p.research_count, olympiadsCount: p.olympiads_count,
    leadershipCount: p.leadership_count, volunteeringCount: p.volunteering_count, major: p.major,
  });

  async function addToCalendar(task: string, monthIndex: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const d = new Date();
    d.setMonth(d.getMonth() + monthIndex);
    await supabase.from('calendar_events').insert({
      user_id: user.id, title: task, date: d.toISOString().slice(0, 10),
      category: 'Roadmap', priority: 'Средний', status: 'Запланировано',
    });
    alert('Добавлено в календарь');
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-1">12-Month Roadmap</h1>
        <p className="text-muted text-sm mb-4">План под специальность «{p.major}» и твои слабые зоны Skill Gap.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {months.map((m) => (
            <div key={m.month} className="card">
              <h3 className="font-semibold mb-2">Месяц {m.month}</h3>
              {m.tasks.map((t) => (
                <div key={t} className="flex justify-between items-center text-sm border-b border-border py-1.5">
                  <span>• {t}</span>
                  <button className="btn-ghost text-xs px-2 py-1" onClick={() => addToCalendar(t, m.month - 1)}>+ Календарь</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
