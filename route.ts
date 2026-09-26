import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.DEMO_AI_MODE === 'true';
const openai = DEMO_MODE ? null : new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function demoReply(message: string): string {
  const kb: [RegExp, string][] = [
    [/ielts|toefl|английск/i, 'Для большинства программ бакалавриата нужен IELTS 6.0–7.0. Начни готовиться минимум за 3–4 месяца.'],
    [/грант|scholarship|стипенд/i, 'Посмотри раздел Scholarships — там собраны демо-варианты по категориям.'],
    [/дедлайн|deadline/i, 'Добавь даты в Calendar — получишь напоминания за 10, 5, 3, 1 день и в день дедлайна.'],
    [/эссе|essay/i, 'Загрузи эссе в Essay Analyzer — покажу сильные и слабые стороны без переписывания текста.'],
  ];
  for (const [re, ans] of kb) if (re.test(message)) return ans;
  return 'Это demo-режим без ключа OpenAI. Добавь OPENAI_API_KEY в .env, чтобы получать полноценные ответы.';
}

export async function POST(req: NextRequest) {
  const { messages, profile } = await req.json();
  const lastUserMessage = messages?.[messages.length - 1]?.content || '';

  if (DEMO_MODE) {
    return NextResponse.json({ reply: demoReply(lastUserMessage), demo: true });
  }

  try {
    const completion = await openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Ты — AI-ассистент FutureMinds, помогаешь школьникам и студентам с поступлением, грантами, олимпиадами, эссе и документами. Профиль ученика: ${JSON.stringify(profile)}. Отвечай по-русски, просто и конкретно.`,
        },
        ...messages,
      ],
    });
    return NextResponse.json({ reply: completion.choices[0].message.content });
  } catch (e) {
    return NextResponse.json({ reply: demoReply(lastUserMessage), demo: true, error: 'openai_failed' });
  }
}
