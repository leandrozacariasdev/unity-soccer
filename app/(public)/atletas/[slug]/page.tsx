import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Ruler, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Athlete, News } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const supabase = createClient();
  const { data } = await supabase
    .from('athletes')
    .select('name, bio')
    .eq('slug', params.slug)
    .single();
  if (!data) return { title: 'Atleta não encontrado' };
  return {
    title: data.name,
    description: data.bio || `${data.name} - Atleta representado pela Unity Soccer`,
  };
}

export default async function AtletaPage({ params }: Props) {
  const supabase = createClient();
  const { data: athlete } = await supabase
    .from('athletes')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!athlete) notFound();
  const a = athlete as Athlete;

  const { data: relatedNews } = await supabase
    .from('news')
    .select('*')
    .eq('related_athlete_id', a.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);
  const news = (relatedNews as News[]) ?? [];

  return (
    <>
      {/* Hero / Cover */}
      <section className="relative h-[60vh] min-h-[400px] bg-ink overflow-hidden">
        {a.cover_url ? (
          <Image
            src={a.cover_url}
            alt={a.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
        ) : a.photo_url ? (
          <Image
            src={a.photo_url}
            alt={a.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div className="relative z-10 wrap h-full flex flex-col justify-end pb-12">
          <Link
            href="/atletas"
            className="inline-flex items-center gap-2 text-paper/60 hover:text-paper mb-6 text-sm"
          >
            <ArrowLeft size={16} /> Voltar para Atletas
          </Link>
          {a.position && (
            <span className="inline-block w-fit px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase bg-gold text-paper rounded-sm mb-4">
              {a.position}
            </span>
          )}
          <h1 className="font-display text-paper uppercase text-[clamp(3rem,8vw,6rem)] leading-[0.95] tracking-[0.02em]">
            {a.name}
          </h1>
          {a.current_club && (
            <p className="text-paper/70 text-lg mt-3">{a.current_club}</p>
          )}
        </div>
      </section>

      {/* Info bar */}
      <section className="bg-ink-soft border-b border-border-inv">
        <div className="wrap py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {a.birth_date && (
            <div>
              <div className="text-[0.6875rem] font-semibold tracking-[0.08em] uppercase text-paper/50 mb-1">
                Nascimento
              </div>
              <div className="text-paper">{formatDate(a.birth_date)}</div>
            </div>
          )}
          {a.nationality && (
            <div>
              <div className="text-[0.6875rem] font-semibold tracking-[0.08em] uppercase text-paper/50 mb-1 flex items-center gap-1.5">
                <Globe size={11} /> Nacionalidade
              </div>
              <div className="text-paper">{a.nationality}</div>
            </div>
          )}
          {a.height_cm && (
            <div>
              <div className="text-[0.6875rem] font-semibold tracking-[0.08em] uppercase text-paper/50 mb-1 flex items-center gap-1.5">
                <Ruler size={11} /> Altura
              </div>
              <div className="text-paper">
                {(a.height_cm / 100).toFixed(2).replace('.', ',')} m
              </div>
            </div>
          )}
          {a.preferred_foot && (
            <div>
              <div className="text-[0.6875rem] font-semibold tracking-[0.08em] uppercase text-paper/50 mb-1">
                Pé Dominante
              </div>
              <div className="text-paper">{a.preferred_foot}</div>
            </div>
          )}
        </div>
      </section>

      {/* Bio + Stats */}
      <section className="section bg-paper">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="section-label">Biografia</p>
              <h2 className="section-title text-3xl md:text-4xl mb-6">Sobre</h2>
              {a.full_bio ? (
                <div className="prose prose-lg max-w-none text-ink-mid">
                  {a.full_bio.split('\n\n').map((p, i) => (
                    <p key={i} className="mb-4 leading-[1.75]">
                      {p}
                    </p>
                  ))}
                </div>
              ) : a.bio ? (
                <p className="text-ink-mid text-lg leading-[1.75]">{a.bio}</p>
              ) : null}
            </div>

            {a.stats && Object.keys(a.stats).length > 0 && (
              <div>
                <p className="section-label">Números</p>
                <h2 className="section-title text-3xl md:text-4xl mb-6">Estatísticas</h2>
                <div className="grid grid-cols-2 gap-px bg-paper-warm border border-border">
                  {Object.entries(a.stats).map(([key, value]) => (
                    <div key={key} className="p-5 bg-paper text-center">
                      <div className="font-display text-3xl text-gold leading-none mb-1">
                        {value}
                      </div>
                      <div className="text-[0.6875rem] font-semibold tracking-[0.08em] uppercase text-smoke">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Career */}
      {a.career && a.career.length > 0 && (
        <section className="section bg-paper-warm">
          <div className="wrap">
            <p className="section-label">Trajetória</p>
            <h2 className="section-title mb-10">Carreira</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-xs font-semibold tracking-[0.08em] uppercase text-smoke">
                      Temporada
                    </th>
                    <th className="text-left py-3 text-xs font-semibold tracking-[0.08em] uppercase text-smoke">
                      Clube
                    </th>
                    <th className="text-right py-3 text-xs font-semibold tracking-[0.08em] uppercase text-smoke">
                      Jogos
                    </th>
                    <th className="text-right py-3 text-xs font-semibold tracking-[0.08em] uppercase text-smoke">
                      Gols
                    </th>
                    <th className="text-right py-3 text-xs font-semibold tracking-[0.08em] uppercase text-smoke">
                      Assist.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {a.career.map((entry, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="py-4 text-sm text-ink">{entry.season}</td>
                      <td className="py-4 text-sm font-semibold text-ink">{entry.club}</td>
                      <td className="py-4 text-sm text-right text-ink-mid">{entry.apps ?? '—'}</td>
                      <td className="py-4 text-sm text-right text-ink-mid">{entry.goals ?? '—'}</td>
                      <td className="py-4 text-sm text-right text-ink-mid">{entry.assists ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Related news */}
      {news.length > 0 && (
        <section className="section bg-paper">
          <div className="wrap">
            <p className="section-label">Notícias</p>
            <h2 className="section-title mb-10">
              Últimas sobre {a.name.split(' ')[0]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((n) => (
                <Link
                  key={n.id}
                  href={`/noticias/${n.slug}`}
                  className="group block"
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
                  <div className="text-xs text-smoke mb-2">
                    {formatDate(n.published_at || n.created_at)}
                  </div>
                  <h3 className="font-display text-xl uppercase tracking-[0.02em] text-ink group-hover:text-gold transition-colors leading-[1.15]">
                    {n.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section bg-ink text-center">
        <div className="wrap">
          <h2 className="font-display text-paper uppercase text-4xl md:text-5xl mb-6">
            Quer ser nosso próximo atleta?
          </h2>
          <p className="text-paper/60 mb-8 max-w-xl mx-auto">
            Entre em contato com a Unity Soccer e descubra como podemos impulsionar sua carreira.
          </p>
          <Link href="/#contato" className="btn btn-gold">
            Falar com a Agência
          </Link>
        </div>
      </section>
    </>
  );
}
