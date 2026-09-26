import Link from 'next/link';
import universities from '@/data/universities.json';
import opportunities from '@/data/opportunities.json';

const FEATURES = [
  ['🎓', 'Universities', 'База университетов Казахстана и мира с демо-критериями поступления'],
  ['💰', 'Scholarships & Grants', 'Стипендии и гранты по категориям, с фильтрами'],
  ['🗂', 'My Portfolio', 'Academic, Projects, Research, Awards и другие разделы портфолио'],
  ['🧠', 'Skill Gap', 'AI показывает сильные и слабые стороны портфолио'],
  ['🗺', '12-Month Roadmap', 'Персональный план поступления с ветвлением по специальности'],
  ['🤖', 'AI Assistant', 'Отвечает на вопросы о поступлении с учётом твоего профиля'],
];

export default function Landing() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-center">
      <div className="text-primary font-bold">🚀 FUTUREMINDS</div>
      <h1 className="text-4xl font-bold mt-3 mb-4">
        Твой AI-помощник для поступления и развития портфолио
      </h1>
      <p className="text-muted max-w-xl mx-auto mb-6">
        Университеты, гранты, олимпиады, проекты и стажировки — в одном месте.
      </p>
      <div className="flex gap-3 justify-center mb-8">
        <Link href="/register" className="btn">Создать профиль</Link>
        <Link href="/dashboard" className="btn-ghost">Демо-режим</Link>
      </div>
      <div className="flex gap-2 justify-center mb-14 flex-wrap">
        <span className="pill">{universities.length} университетов (демо)</span>
        <span className="pill">{opportunities.length} возможностей (демо)</span>
      </div>
      <div className="grid md:grid-cols-3 gap-4 text-left">
        {FEATURES.map(([icon, title, desc]) => (
          <div key={title} className="card">
            <div className="text-2xl">{icon}</div>
            <h3 className="font-semibold mt-2">{title}</h3>
            <p className="text-muted text-sm mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
