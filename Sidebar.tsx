'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const NAV: [string, string, string][] = [
  ['/dashboard', '🏠', 'Dashboard'],
  ['/profile', '👤', 'My Profile'],
  ['/universities', '🎓', 'Universities'],
  ['/skill-gap', '🧠', 'Skill Gap'],
  ['/roadmap', '🗺', '12-Month Roadmap'],
  ['/ai-assistant', '🤖', 'AI Assistant'],
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await supabase.auth.signOut();
    router.push('/');
  }
  return (
    <aside className="w-56 shrink-0 border-r border-border p-4 sticky top-0 h-screen overflow-y-auto">
      <div className="font-extrabold text-lg mb-4">🚀 FutureMinds</div>
      {NAV.map(([href, icon, label]) => (
        <Link key={href} href={href} className={`navlink ${pathname === href ? 'active' : ''}`}>
          {icon} {label}
        </Link>
      ))}
      <button onClick={logout} className="btn-ghost w-full mt-4 text-sm">Выйти</button>
    </aside>
  );
}
