import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Athlete } from '@/lib/types';

export async function AthletesSection({ limit = 6 }: { limit?: number }) {
  let athletes: Athlete[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('athletes')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(limit);
    athletes = (data as Athlete[]) ?? [];
  } catch {
    athletes = [];
  }

  if (athletes.length === 0) return null;

  return (
    <section className="section bg-paper-warm" id="atletas" aria-labelledby="athletes-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-6">
          <div>
            <p className="section-label" data-reveal>Nosso Plantel</p>
            <h2 id="athletes-title" className="section-title" data-reveal data-delay="1">
              Atletas <span className="text-gold">Representados</span>
            </h2>
          </div>
          <Link
            href="/atletas"
            className="text-sm font-semibold tracking-[0.08em] uppercase text-gold hover:text-gold-light transition-colors"
          >
            Ver todos <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>

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
              <h3 className="font-display text-[1.75rem] leading-none tracking-[0.02em] uppercase mb-5">
                {a.name}
              </h3>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase text-gold-light group-hover:translate-x-1 transition-transform">
                Ver ficha <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
