'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { skillGap } from '@/lib/skillGap';
import Sidebar from '@/components/Sidebar';

export default function SkillGapPage() {
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

  const sg = skillGap({
    gpa: p.gpa, english: p.english, programmingCount: p.programming_count, mathScore: p.math_score,
    projectsCount: p.projects_count, researchCount: p.research_count, olympiadsCount: p.olympiads_count,
    leadershipCount: p.leadership_count, volunteeringCount: p.volunteering_count,
  });
  const weak = sg.filter((s) => s.v < 40);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Skill Gap</h1>
        <div className="card">
          {sg.map((s) => (
            <div key={s.k} className="mb-3">
              <div className="text-sm">{s.k} — {s.v}%</div>
              <div className="h-2 bg-lav rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${s.v}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card mt-4">
          <h3 className="font-semibold mb-2">Рекомендации</h3>
          {weak.length === 0 && <p className="text-muted text-sm">Профиль сбалансирован — продолжай развивать текущие направления.</p>}
          {weak.map((s) => (
            <p key={s.k} className="text-sm mb-1 pl-3 border-l-2 border-primary">
              Стоит усилить: <b>{s.k}</b> — это одна из самых слабых зон профиля для специальности «{p.major}».
            </p>
          ))}
        </div>
      </main>
    </div>
  );
}
