'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Users, Image as ImageIcon, Newspaper,
  MessageSquare, Mail, Settings, LogOut, Menu, X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/athletes', label: 'Atletas', icon: Users },
  { href: '/admin/gallery', label: 'Galeria', icon: ImageIcon },
  { href: '/admin/news', label: 'Notícias', icon: Newspaper },
  { href: '/admin/comments', label: 'Comentários', icon: MessageSquare },
  { href: '/admin/contacts', label: 'Contatos', icon: Mail },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
];

export function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper-warm flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 bg-ink text-paper flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-6 border-b border-border-inv">
          <Link href="/admin/dashboard" className="font-display text-2xl uppercase tracking-[0.06em] text-paper">
            Unity <span className="text-gold-light">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors',
                  active
                    ? 'bg-gold/15 text-gold-light border-l-2 border-gold'
                    : 'text-paper/60 hover:text-paper hover:bg-paper/5',
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-border-inv">
          {userEmail && (
            <div className="text-xs text-paper/40 mb-3 truncate">{userEmail}</div>
          )}
          <Link
            href="/"
            target="_blank"
            className="block text-xs text-paper/60 hover:text-paper mb-2"
          >
            Ver site público →
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-paper/60 hover:text-gold transition-colors w-full"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed inset-x-0 top-0 z-30 bg-ink text-paper flex items-center justify-between px-4 h-14">
        <Link href="/admin/dashboard" className="font-display text-lg uppercase">
          Unity <span className="text-gold-light">Admin</span>
        </Link>
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-20 bg-ink text-paper pt-14">
          <nav className="px-3 py-4 space-y-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-paper/70 hover:bg-paper/5"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-sm text-paper/60 w-full"
            >
              <LogOut size={18} /> Sair
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 md:ml-64 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
