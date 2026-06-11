'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Users, Briefcase, Newspaper, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/#top', icon: Home, label: 'Início' },
  { href: '/atletas', icon: Users, label: 'Atletas' },
  { href: '/#servicos', icon: Briefcase, label: 'Serviços' },
  { href: '/noticias', icon: Newspaper, label: 'Notícias' },
  { href: '/#contato', icon: Mail, label: 'Contato' },
];

export function BottomNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        'md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40',
        'flex items-center gap-0.5 px-1.5 py-1.5',
        'bg-ink-soft border border-border-inv rounded-full',
        'shadow-2xl backdrop-blur-xl',
        'transition-all duration-400 ease-soft',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none',
      )}
    >
      {items.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-0 px-3.5 py-2.5 rounded-full text-paper/45 hover:text-gold active:scale-95 transition-all min-w-[44px] min-h-[44px] justify-center"
        >
          <Icon size={20} strokeWidth={2} />
        </Link>
      ))}
    </nav>
  );
}
