'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { skillGap } from '@/lib/skillGap';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    })();
  }, []);

  if (!profile) return <main className="p-8">Загрузка...</main>;

  const sg = skillGap({
    gpa: profile.gpa, english: profile.english, programmingCount: profile.programming_count,
    mathScore: profile.math_score, projectsCount: profile.projects_count,
    researchCount: profile.research_count, olympiadsCount: profile.olympiads_count,
    leadershipCount: profile.leadership_count, volunteeringCount: profile.volunteering_count,
  });
  const avg = Math.round(sg.reduce((a, b) => a + b.v, 0) / sg.length);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Привет, {profile.name || 'друг'}! 👋</h1>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card"><div className="text-muted text-sm">GPA</div><div className="text-2xl font-bold">{profile.gpa ?? '—'}</div></div>
          <div className="card"><div className="text-muted text-sm">Portfolio Score</div><div className="text-2xl font-bold">{avg}%</div></div>
          <div className="card"><div className="text-muted text-sm">Специальность</div><div className="text-lg font-bold">{profile.major}</div></div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3">Мой Skill Gap</h3>
          {sg.map((s) => (
            <div key={s.k} className="mb-2">
              <div className="text-sm">{s.k} — {s.v}%</div>
              <div className="h-2 bg-lav rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${s.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
