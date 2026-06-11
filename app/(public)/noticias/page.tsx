import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { News } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const revalidate = 60;

export const metadata = {
  title: 'Notícias',
  description: 'Fique por dentro das últimas notícias, transferências e conquistas dos atletas da Unity Soccer.',
};

export default async function NoticiasPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false });
  const news = (data as News[]) ?? [];

  const featured = news[0];
  const rest = news.slice(1);

  return (
    <>
      <section className="bg-paper pt-40 pb-16">
        <div className="wrap">
          <p className="section-label" data-reveal>Fique por Dentro</p>
          <h1 className="section-title" data-reveal data-delay="1">
            Últimas <span className="text-gold">Notícias</span>
          </h1>
          <p className="text-ink-mid text-lg max-w-2xl" data-reveal data-delay="2">
            Transferências, contratos, premiações e tudo sobre nossos atletas.
          </p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="wrap">
          {news.length === 0 ? (
            <p className="text-ink-mid text-center py-20">Nenhuma notícia publicada ainda.</p>
          ) : (
            <>
              {featured && (
                <Link
                  href={`/noticias/${featured.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 pb-16 border-b border-border"
                  data-reveal
                >
                  {featured.cover_url && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink-soft rounded-sm">
                      <Image
                        src={featured.cover_url}
                        alt={featured.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    {featured.is_featured && (
                      <span className="inline-block w-fit px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase bg-gold text-paper rounded-sm mb-4">
                        Destaque
                      </span>
                    )}
                    <div className="text-xs font-semibold tracking-[0.08em] uppercase text-smoke mb-3">
                      {formatDate(featured.published_at || featured.created_at)}
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl uppercase tracking-[0.02em] text-ink mb-4 leading-[1.05] group-hover:text-gold transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-ink-mid text-base leading-[1.7] mb-6">{featured.excerpt}</p>
                    )}
                    <span className="text-sm font-semibold text-gold group-hover:opacity-70">
                      Ler mais →
                    </span>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((n, i) => (
                    <Link
                      key={n.id}
                      href={`/noticias/${n.slug}`}
                      className="group block"
                      data-reveal
                      data-delay={((i % 3) + 1) as 1 | 2 | 3}
                    >
                      {n.cover_url && (
                        <div className="relative aspect-[16/9] mb-4 overflow-hidden bg-ink-soft rounded-sm">
                          <Image
                            src={n.cover_url}
                            alt={n.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="text-xs font-semibold tracking-[0.08em] uppercase text-smoke mb-2">
                        {formatDate(n.published_at || n.created_at)}
                      </div>
                      <h3 className="font-display text-xl uppercase tracking-[0.02em] text-ink group-hover:text-gold transition-colors leading-[1.15] mb-2">
                        {n.title}
                      </h3>
                      {n.excerpt && (
                        <p className="text-sm text-ink-mid line-clamp-2">{n.excerpt}</p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
