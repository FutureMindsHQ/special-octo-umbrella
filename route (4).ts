import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.DEMO_AI_MODE === 'true';
const openai = DEMO_MODE ? null : new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function demoAnalysis(text: string) {
  const wc = text.trim().split(/\s+/).filter(Boolean).length;
  const pros: string[] = [], cons: string[] = [];
  if (wc > 250) pros.push('Хороший объём текста'); else cons.push('Текст короткий — добавь больше деталей');
  if (/потому что|так как/i.test(text)) pros.push('Есть аргументация'); else cons.push('Не хватает объяснения «почему»');
  if (/университет|программ/i.test(text)) pros.push('Есть упоминание университета'); else cons.push('Добавь, почему выбран именно этот университет');
  return { wordCount: wc, pros, cons, demo: true };
}

export async function POST(req: NextRequest) {
  const { text, major } = await req.json();
  if (DEMO_MODE) return NextResponse.json(demoAnalysis(text));

  try {
    const completion = await openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{
        role: 'user',
        content: `Проанализируй мотивационное эссе абитуриента для специальности "${major}". Верни JSON {"pros":["..."],"cons":["..."]} на русском — 3-5 сильных сторон и 3-5 конкретных советов по улучшению, без переписывания текста.\n\nТекст:\n"""${text}"""`,
      }],
    });
    const parsed = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json({ wordCount: text.trim().split(/\s+/).filter(Boolean).length, ...parsed });
  } catch {
    return NextResponse.json(demoAnalysis(text));
  }
}
