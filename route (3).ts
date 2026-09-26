import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.DEMO_AI_MODE === 'true';
const openai = DEMO_MODE ? null : new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function demoCheck(text: string) {
  const has = (re: RegExp) => re.test(text);
  return {
    items: [
      { label: 'ФИО', ok: has(/[a-zа-яё]+\s+[a-zа-яё]+/i) },
      { label: 'Дата/год', ok: has(/\d{4}/) },
      { label: 'GPA/оценки', ok: has(/gpa|балл|оценк/i) },
      { label: 'Email', ok: has(/@/) },
      { label: 'Учебное заведение', ok: has(/школ|university|университет|college/i) },
    ],
    demo: true,
  };
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (DEMO_MODE) return NextResponse.json(demoCheck(text));

  try {
    const completion = await openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{
        role: 'user',
        content: `Проверь текст документа абитуриента (CV/транскрипт/анкета) на заполненность обязательных полей: ФИО, дата рождения, контакты, учебное заведение, оценки/GPA, специальность. Верни JSON {"items":[{"label":"...","ok":true|false,"note":"..."}]} на русском. Не утверждай подлинность документа — только заполнение полей.\n\nТекст:\n"""${text}"""`,
      }],
    });
    return NextResponse.json(JSON.parse(completion.choices[0].message.content || '{}'));
  } catch {
    return NextResponse.json(demoCheck(text));
  }
}
