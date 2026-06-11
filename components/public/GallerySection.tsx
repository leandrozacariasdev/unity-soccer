import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { GalleryItem } from '@/lib/types';

export async function GallerySection({ limit = 6 }: { limit?: number }) {
  let items: GalleryItem[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit);
    items = (data as GalleryItem[]) ?? [];
  } catch {
    items = [];
  }

  if (items.length === 0) return null;

  return (
    <section className="section bg-paper-warm" id="galeria" aria-labelledby="gallery-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-6">
          <div>
            <p className="section-label" data-reveal>Momentos</p>
            <h2 id="gallery-title" className="section-title" data-reveal data-delay="1">
              Galeria <span className="text-gold">de Fotos</span>
            </h2>
          </div>
          <Link
            href="/galeria"
            className="text-sm font-semibold tracking-[0.08em] uppercase text-gold hover:text-gold-light transition-colors"
          >
            Ver galeria completa <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 auto-rows-[200px] md:auto-rows-[280px]">
          {items.slice(0, 6).map((item, i) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden bg-cover bg-center cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                i === 0 ? 'col-span-2 row-span-2' : i === 3 ? 'col-span-2' : ''
              }`}
              style={{ backgroundImage: `url(${item.image_url})` }}
              data-reveal
              data-delay={((i % 3) + 1) as 1 | 2 | 3}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                {item.title && (
                  <div>
                    <div className="font-display text-[1.25rem] tracking-[0.02em] uppercase text-paper">
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="text-xs text-paper/60 mt-1">{item.description}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
