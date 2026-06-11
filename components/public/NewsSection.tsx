import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { News } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export async function NewsSection({ limit = 3 }: { limit?: number }) {
  let news: News[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);
    news = (data as News[]) ?? [];
  } catch {
    news = [];
  }

  if (news.length === 0) return null;

  return (
    <section className="section bg-paper" id="noticias" aria-labelledby="news-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-6">
          <div>
            <p className="section-label" data-reveal>Fique por Dentro</p>
            <h2 id="news-title" className="section-title" data-reveal data-delay="1">
              Últimas <span className="text-gold">Notícias</span>
            </h2>
          </div>
          <Link
            href="/noticias"
            className="text-sm font-semibold tracking-[0.08em] uppercase text-gold hover:text-gold-light transition-colors"
          >
            Ver todas <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {news.map((n, i) => (
            <Link
              key={n.id}
              href={`/noticias/${n.slug}`}
              className="bg-paper-warm border border-border p-8 rounded-sm transition-all hover:border-gold hover:-translate-y-0.5 group"
              data-reveal
              data-delay={((i % 3) + 1) as 1 | 2 | 3}
            >
              {n.cover_url && (
                <div className="relative aspect-[16/9] mb-5 overflow-hidden bg-ink-soft rounded-sm">
                  <Image
                    src={n.cover_url}
                    alt={n.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="text-[0.6875rem] font-semibold tracking-[0.08em] uppercase text-smoke mb-3">
                {formatDate(n.published_at || n.created_at)}
              </div>
              <h3 className="font-display text-[1.25rem] tracking-[0.02em] uppercase text-ink mb-3 leading-[1.15]">
                {n.title}
              </h3>
              {n.excerpt && (
                <p className="text-sm text-ink-mid leading-[1.65] mb-5 line-clamp-3">{n.excerpt}</p>
              )}
              <span className="text-[0.8125rem] font-semibold text-gold group-hover:opacity-70 transition-opacity">
                Ler mais →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
