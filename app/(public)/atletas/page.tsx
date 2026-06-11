import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Athlete } from '@/lib/types';

export const revalidate = 60;

export const metadata = {
  title: 'Atletas',
  description: 'Conheça os atletas representados pela Unity Soccer.',
};

export default async function AtletasPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('athletes')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  const athletes = (data as Athlete[]) ?? [];

  return (
    <>
      <section className="bg-paper pt-40 pb-16">
        <div className="wrap">
          <p className="section-label" data-reveal>Plantel</p>
          <h1 className="section-title" data-reveal data-delay="1">
            Nossos <span className="text-gold">Atletas</span>
          </h1>
          <p className="text-ink-mid text-lg max-w-2xl" data-reveal data-delay="2">
            Profissionais e jovens promessas que confiam na nossa gestão para conduzir suas
            carreiras com excelência.
          </p>
        </div>
      </section>

      <section className="section bg-paper-warm">
        <div className="wrap">
          {athletes.length === 0 ? (
            <p className="text-ink-mid text-center py-20">
              Nenhum atleta cadastrado no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
              {athletes.map((a, i) => (
                <Link
                  key={a.id}
                  href={`/atletas/${a.slug}`}
                  className="relative aspect-[3/4] overflow-hidden flex flex-col justify-end p-6 text-paper transition-transform duration-200 hover:-translate-y-1 group bg-cover bg-center"
                  data-reveal
                  data-delay={((i % 3) + 1) as 1 | 2 | 3}
                  style={{
                    backgroundImage: a.photo_url
                      ? `linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 70%, #0A0A0A 100%), url(${a.photo_url})`
                      : undefined,
                    backgroundColor: a.photo_url ? undefined : 'var(--ink-soft)',
                  }}
                >
                  {a.position && (
                    <span className="inline-block w-fit px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase bg-gold text-paper rounded-sm mb-3">
                      {a.position}
                    </span>
                  )}
                  <h2 className="font-display text-[1.75rem] leading-none tracking-[0.02em] uppercase mb-2">
                    {a.name}
                  </h2>
                  {a.current_club && (
                    <p className="text-xs text-paper/60 mb-4">{a.current_club}</p>
                  )}
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase text-gold-light group-hover:translate-x-1 transition-transform">
                    Ver perfil <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
