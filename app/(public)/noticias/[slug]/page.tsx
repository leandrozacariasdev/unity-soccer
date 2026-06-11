import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { News, Comment, Athlete } from '@/lib/types';
import { formatDateLong } from '@/lib/utils';
import { CommentSection } from '@/components/public/CommentSection';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const supabase = createClient();
  const { data } = await supabase
    .from('news')
    .select('title, excerpt, meta_title, meta_description, cover_url')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();
  if (!data) return { title: 'Notícia não encontrada' };
  return {
    title: data.meta_title || data.title,
    description: data.meta_description || data.excerpt || data.title,
    openGraph: {
      title: data.title,
      description: data.excerpt || data.title,
      images: data.cover_url ? [data.cover_url] : [],
    },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const supabase = createClient();
  const { data: newsItem } = await supabase
    .from('news')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!newsItem) notFound();
  const n = newsItem as News;

  // Incrementar views
  await supabase
    .from('news')
    .update({ views: n.views + 1 })
    .eq('id', n.id)
    .then(() => {});

  // Buscar atleta relacionado
  let athlete: Athlete | null = null;
  if (n.related_athlete_id) {
    const { data } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', n.related_athlete_id)
      .single();
    athlete = data as Athlete | null;
  }

  // Buscar comentários aprovados
  const { data: commentsData } = await supabase
    .from('news_comments')
    .select('*')
    .eq('news_id', n.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  const comments = (commentsData as Comment[]) ?? [];

  // Buscar notícias relacionadas
  const { data: relatedData } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .neq('id', n.id)
    .order('published_at', { ascending: false })
    .limit(3);
  const related = ((relatedData as News[]) ?? []).slice(0, 3);

  return (
    <article>
      {/* Cover */}
      {n.cover_url && (
        <div className="relative h-[60vh] min-h-[400px] bg-ink">
          <Image
            src={n.cover_url}
            alt={n.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
      )}

      <div className="wrap py-16 max-w-3xl mx-auto">
        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 text-ink-mid hover:text-gold mb-8 text-sm"
        >
          <ArrowLeft size={16} /> Voltar para Notícias
        </Link>

        <header className="mb-10">
          {n.category && (
            <span className="inline-block px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase bg-gold/10 text-gold rounded-sm mb-4 capitalize">
              {n.category}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.02em] text-ink leading-[0.95] mb-6">
            {n.title}
          </h1>
          {n.excerpt && (
            <p className="text-xl text-ink-mid leading-[1.6] mb-6">{n.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-smoke pb-6 border-b border-border">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {n.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDateLong(n.published_at || n.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} /> {n.views + 1} visualizações
            </span>
          </div>
        </header>

        {/* Related athlete */}
        {athlete && (
          <Link
            href={`/atletas/${athlete.slug}`}
            className="flex items-center gap-4 bg-paper-warm border border-border p-4 rounded-sm mb-10 hover:border-gold transition-colors"
          >
            {athlete.photo_url && (
              <div className="relative w-16 h-16 rounded-sm overflow-hidden bg-ink-soft flex-shrink-0">
                <Image
                  src={athlete.photo_url}
                  alt={athlete.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="text-xs text-smoke uppercase tracking-[0.08em]">Atleta relacionado</div>
              <div className="font-display text-xl uppercase text-ink">{athlete.name}</div>
            </div>
            <span className="text-gold text-sm font-semibold">Ver perfil →</span>
          </Link>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-ink-mid leading-[1.85] [&_h2]:font-display [&_h2]:text-3xl [&_h2]:uppercase [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:uppercase [&_h3]:text-ink [&_h3]:mt-10 [&_h3]:mb-3 [&_p]:mb-5 [&_img]:rounded-sm [&_img]:my-8 [&_a]:text-gold [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-ink [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5"
          dangerouslySetInnerHTML={{ __html: n.content }}
        />

        {n.cover_caption && (
          <p className="text-sm text-smoke text-center mt-2 italic">{n.cover_caption}</p>
        )}
      </div>

      {/* Comments */}
      <CommentSection newsId={n.id} initialComments={comments} />

      {/* Related */}
      {related.length > 0 && (
        <section className="section bg-paper-warm">
          <div className="wrap">
            <p className="section-label">Continue lendo</p>
            <h2 className="section-title mb-10">Leia também</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/noticias/${r.slug}`} className="group block">
                  {r.cover_url && (
                    <div className="relative aspect-[16/9] mb-4 overflow-hidden bg-ink-soft rounded-sm">
                      <Image
                        src={r.cover_url}
                        alt={r.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="text-xs text-smoke mb-2">
                    {formatDateLong(r.published_at || r.created_at)}
                  </div>
                  <h3 className="font-display text-lg uppercase tracking-[0.02em] text-ink group-hover:text-gold transition-colors leading-[1.15]">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
