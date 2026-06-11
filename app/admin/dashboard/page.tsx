import Link from 'next/link';
import { Users, Image as ImageIcon, Newspaper, MessageSquare, Mail, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Dashboard · Admin' };

export default async function DashboardPage() {
  const supabase = createClient();

  const [
    { count: athletesCount },
    { count: galleryCount },
    { count: newsCount },
    { count: commentsCount },
    { count: unreadContacts },
    { data: recentContacts },
    { data: pendingComments },
  ] = await Promise.all([
    supabase.from('athletes').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('news_comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('news_comments').select('*, news:news_id(title, slug)').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: 'Atletas', count: athletesCount ?? 0, icon: Users, href: '/admin/athletes', color: 'text-gold' },
    { label: 'Galeria', count: galleryCount ?? 0, icon: ImageIcon, href: '/admin/gallery', color: 'text-blue-500' },
    { label: 'Notícias', count: newsCount ?? 0, icon: Newspaper, href: '/admin/news', color: 'text-green-500' },
    { label: 'Comentários pendentes', count: commentsCount ?? 0, icon: MessageSquare, href: '/admin/comments', color: 'text-orange-500' },
    { label: 'Contatos não lidos', count: unreadContacts ?? 0, icon: Mail, href: '/admin/contacts', color: 'text-red-500' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-4xl uppercase tracking-[0.02em] text-ink mb-2">Dashboard</h1>
        <p className="text-ink-mid text-sm">Visão geral do site</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {stats.map(({ label, count, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-paper border border-border p-5 rounded-sm hover:border-gold transition-colors"
          >
            <Icon className={`mb-3 ${color}`} size={22} />
            <div className="font-display text-3xl text-ink leading-none mb-1">{count}</div>
            <div className="text-xs text-ink-mid uppercase tracking-[0.04em]">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-paper border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl uppercase text-ink">Últimos contatos</h2>
            <Link href="/admin/contacts" className="text-xs text-gold hover:underline">Ver todos</Link>
          </div>
          {recentContacts && recentContacts.length > 0 ? (
            <div className="space-y-3">
              {recentContacts.map((c) => (
                <div key={c.id} className="flex items-start justify-between gap-4 pb-3 border-b border-border last:border-0">
                  <div className="min-w-0">
                    <div className="font-semibold text-ink text-sm">{c.name}</div>
                    <div className="text-xs text-ink-mid truncate">{c.email}</div>
                    {c.subject && <div className="text-xs text-smoke mt-0.5">{c.subject}</div>}
                  </div>
                  <div className="text-xs text-smoke flex-shrink-0">
                    {formatDate(c.created_at)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-mid italic">Nenhum contato ainda.</p>
          )}
        </div>

        <div className="bg-paper border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl uppercase text-ink">Comentários pendentes</h2>
            <Link href="/admin/comments" className="text-xs text-gold hover:underline">Moderar</Link>
          </div>
          {pendingComments && pendingComments.length > 0 ? (
            <div className="space-y-3">
              {pendingComments.map((c: { id: string; author_name: string; content: string; news: { title: string; slug: string } | null }) => (
                <div key={c.id} className="pb-3 border-b border-border last:border-0">
                  <div className="font-semibold text-ink text-sm">{c.author_name}</div>
                  <div className="text-xs text-ink-mid italic mt-0.5">
                    em: {c.news?.title || '(removido)'}
                  </div>
                  <p className="text-xs text-ink-mid mt-1 line-clamp-2">{c.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-mid italic">Nenhum comentário pendente.</p>
          )}
        </div>
      </div>
    </div>
  );
}
