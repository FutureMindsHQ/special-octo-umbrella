export type Profile = {
  gpa?: number;
  english?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  programmingCount?: number;
  mathScore?: number;
  projectsCount?: number;
  researchCount?: number;
  olympiadsCount?: number;
  leadershipCount?: number;
  volunteeringCount?: number;
  major?: string;
};

export type University = {
  id: string;
  name: string;
  country: string;
  city: string;
  majors: string[];
  gpaMin: number;
  english: string;
  engPct: number;
  docs: string[];
  deadline: string;
  site: string;
};

const ENG_PCT: Record<string, number> = { A1: 20, A2: 35, B1: 50, B2: 65, C1: 80, C2: 95 };

export function engPct(level?: string) {
  return ENG_PCT[level || 'B1'] ?? 50;
}

export function skillGap(p: Profile) {
  return [
    { k: 'GPA', v: Math.min(100, Math.round(((p.gpa || 0) / 4) * 100)) },
    { k: 'Английский', v: engPct(p.english) },
    { k: 'Программирование', v: Math.min(100, (p.programmingCount || 0) * 20) },
    { k: 'Математика', v: Math.min(100, p.mathScore || 0) },
    { k: 'Проекты', v: Math.min(100, (p.projectsCount || 0) * 25) },
    { k: 'Исследования', v: Math.min(100, (p.researchCount || 0) * 50) },
    { k: 'Олимпиады', v: Math.min(100, (p.olympiadsCount || 0) * 30) },
    { k: 'Лидерство', v: Math.min(100, (p.leadershipCount || 0) * 30) },
    { k: 'Волонтёрство', v: Math.min(100, (p.volunteeringCount || 0) * 25) },
  ];
}

export function matchUniversity(uni: University, p: Profile) {
  const checks = [
    { label: 'GPA', pass: (p.gpa || 0) >= uni.gpaMin, detail: `Твой GPA ${p.gpa ?? '—'}, нужно от ${uni.gpaMin}` },
    { label: 'Английский', pass: engPct(p.english) >= uni.engPct, detail: `Твой уровень ${p.english}, ориентир — ${uni.english}` },
    { label: 'Профильные проекты', pass: (p.projectsCount || 0) >= 1, detail: `У тебя ${p.projectsCount || 0} проектов` },
    { label: 'Олимпиады/конкурсы', pass: (p.olympiadsCount || 0) >= 1, detail: `У тебя ${p.olympiadsCount || 0}` },
    { label: 'Исследовательский опыт', pass: (p.researchCount || 0) >= 1, detail: `У тебя ${p.researchCount || 0}` },
  ];
  const passed = checks.filter((c) => c.pass).length;
  return { pct: Math.round((passed / checks.length) * 100), checks };
}

const MAJOR_TRACKS: Record<string, string[]> = {
  'Computer Science': ['Python и алгоритмы', 'Pet-проект на GitHub', 'Hackathon', 'Структуры данных', 'Портфолио проектов'],
  Medicine: ['Углублённая биология', 'Углублённая химия', 'Волонтёрство в клинике', 'Research-проект', 'Профильные экзамены'],
  Economics: ['Математика и статистика', 'Основы экономики', 'Кейс-чемпионат', 'Финансовое моделирование', 'Стажировка'],
};

export function roadmap12(p: Profile) {
  const sg = skillGap(p).sort((a, b) => a.v - b.v);
  const weak = sg.slice(0, 4).map((s) => s.k);
  const track = MAJOR_TRACKS[p.major || ''] || ['Профильные курсы', 'Личный проект', 'Олимпиада/конкурс', 'Практика по теме', 'Портфолио'];
  const months: string[][] = [
    [`Начать усиливать: ${weak[0]}`, 'Список из 5–7 университетов', track[0]],
    [`Продолжить: ${weak[1]}`, 'Начать IELTS/TOEFL', track[1]],
    ['Найти 2–3 олимпиады/конкурса', 'Продолжить язык', 'Начать проект'],
    [`Работать над: ${weak[2]}`, 'Черновик проекта', 'Требования университетов'],
    ['Черновик CV', 'Первые сертификаты', track[2]],
    [`Усилить: ${weak[3]}`, 'Участие в олимпиаде', 'Обновить портфолио'],
    ['Пробный IELTS/TOEFL', 'Черновик motivation letter', 'Найти ментора'],
    ['Доработать эссе', 'Рекомендательные письма', 'Продолжить проект'],
    [track[3] || 'Углубить специализацию', 'Финализировать язык', 'Проверить SAT/ACT'],
    ['Завершить проекты', 'Чек-лист документов', 'Финальные эссе'],
    ['Проверить дедлайны', 'Собрать документы', 'Финальные рекомендации'],
    ['Подать заявки', 'Подать на стипендии', 'Отслеживать статус'],
  ];
  return months.map((tasks, i) => ({ month: i + 1, tasks }));
}
