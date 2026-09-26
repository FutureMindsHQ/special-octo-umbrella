import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.DEMO_AI_MODE === 'true';
const openai = DEMO_MODE ? null : new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { text, from, to } = await req.json();

  if (DEMO_MODE) {
    return NextResponse.json({
      translated: null,
      demo: true,
      message: `Demo-режим: реальный перевод ${from} → ${to} появится, когда в .env будет добавлен OPENAI_API_KEY.`,
    });
  }

  try {
    const completion = await openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Переведи документ с ${from} на ${to}. Сохрани структуру, заголовки, даты и форматирование где возможно. Верни только перевод.\n\n${text}`,
      }],
    });
    return NextResponse.json({ translated: completion.choices[0].message.content });
  } catch {
    return NextResponse.json({ translated: null, demo: true, message: 'AI переводчик временно недоступен.' });
  }
}
