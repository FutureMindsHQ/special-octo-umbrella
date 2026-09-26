'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';

export default function AIAssistant() {
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    })();
  }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const next = [...messages, { role: 'user' as const, content: input }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, profile }),
      });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'AI сейчас недоступен, попробуй позже.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
        <div className="card h-96 overflow-y-auto flex flex-col gap-2">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${m.role === 'user' ? 'bg-primary text-[#04140a] self-end font-medium' : 'bg-bg border border-border'}`}>
              {m.content}
            </div>
          ))}
          {loading && <p className="text-muted text-sm">Думаю...</p>}
        </div>
        <form onSubmit={send} className="flex gap-2 mt-3">
          <input className="input flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Задай вопрос..." />
          <button className="btn" type="submit">Отправить</button>
        </form>
      </main>
    </div>
  );
}
