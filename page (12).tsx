'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import universities from '@/data/universities.json';
import { matchUniversity, skillGap } from '@/lib/skillGap';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>();
  const uni = (universities as any[]).find((u) => u.id === id);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    })();
  }, []);

  if (!uni) return <main className="p-8">Университет не найден.</main>;

  const p = profile
    ? {
        gpa: profile.gpa, english: profile.english, projectsCount: profile.projects_count,
        olympiadsCount: profile.olympiads_count, researchCount: profile.research_count,
      }
    : {};
  const match = matchUniversity(uni, p);
  const sg = profile ? skillGap(p) : [];

  async function addApplication() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Сначала войдите в аккаунт');
    await supabase.from('applications').insert({ user_id: user.id, university_id: uni.id, program: uni.majors[0], status: 'Research' });
    alert('Добавлено в My Applications');
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-2xl">
        <h1 className="text-2xl font-bold">{uni.name}</h1>
        <p className="text-muted">{uni.city}, {uni.country}</p>
        <div className="card mt-4 space-y-1 text-sm">
          <p><b>Специальности:</b> {uni.majors.join(', ')}</p>
          <p><b>Мин. GPA:</b> {uni.gpaMin} · <b>Язык:</b> {uni.english}</p>
          <p><b>Стоимость:</b> {uni.tuition}</p>
          <p><b>Документы:</b> {uni.docs.join(', ')}</p>
          <p><b>Дедлайн:</b> {uni.deadline} · <a className="text-primary underline" href={uni.site} target="_blank">Официальный сайт</a></p>
        </div>

        {profile ? (
          <div className="card mt-4">
            <h3 className="font-semibold mb-2">Твой Match — {match.pct}%</h3>
            {match.checks.map((c) => (
              <div key={c.label} className="text-sm flex gap-2 mb-1">
                <span>{c.pass ? '✓' : '✗'}</span>
                <span>{c.label}: <span className="text-muted">{c.detail}</span></span>
              </div>
            ))}
            <p className="text-muted text-xs mt-2">
              Обозначения условны — это не гарантия поступления, а ориентир для подготовки.
            </p>
          </div>
        ) : (
          <p className="text-muted text-sm mt-4">Войдите и заполните профиль, чтобы увидеть Match.</p>
        )}

        <button className="btn mt-4" onClick={addApplication}>Добавить в заявки</button>
      </main>
    </div>
  );
}
