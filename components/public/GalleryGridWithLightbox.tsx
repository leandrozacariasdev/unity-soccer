'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';
import { cn } from '@/lib/utils';

type Props = { items: GalleryItem[]; categories: string[] };

export function GalleryGridWithLightbox({ items, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'all'
    ? items
    : items.filter((i) => i.category === activeCategory);

  function open(idx: number) { setLightboxIndex(idx); }
  function close() { setLightboxIndex(null); }
  function prev() { setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)); }
  function next() { setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length)); }

  return (
    <>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase rounded-sm border transition-colors',
              activeCategory === 'all'
                ? 'bg-ink text-paper border-ink'
                : 'bg-paper text-ink border-border hover:border-ink',
            )}
          >
            Todas ({items.length})
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={cn(
                'px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase rounded-sm border transition-colors capitalize',
                activeCategory === c
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-paper text-ink border-border hover:border-ink',
              )}
            >
              {c} ({items.filter((i) => i.category === c).length})
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[280px]">
        {filtered.map((item, i) => (
          <button
            key={item.id}
            onClick={() => open(i)}
            className={cn(
              'group relative overflow-hidden bg-cover bg-center cursor-pointer transition-all hover:scale-[1.02]',
              i % 7 === 0 ? 'col-span-2 row-span-2' : '',
            )}
            style={{ backgroundImage: `url(${item.image_url})` }}
            aria-label={item.title || 'Imagem da galeria'}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
              {item.title && (
                <div className="text-left">
                  <div className="font-display text-lg uppercase tracking-[0.02em] text-paper">
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-paper/60 mt-1">{item.description}</div>
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 backdrop-blur flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-paper/10 hover:bg-gold text-paper flex items-center justify-center transition-colors z-10"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 w-12 h-12 rounded-full bg-paper/10 hover:bg-gold text-paper flex items-center justify-center transition-colors z-10"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 w-12 h-12 rounded-full bg-paper/10 hover:bg-gold text-paper flex items-center justify-center transition-colors z-10"
            aria-label="Próxima"
          >
            <ChevronRight size={24} />
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightboxIndex].image_url}
              alt={filtered[lightboxIndex].title || ''}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            {filtered[lightboxIndex].title && (
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-ink to-transparent">
                <div className="font-display text-2xl uppercase tracking-[0.02em] text-paper">
                  {filtered[lightboxIndex].title}
                </div>
                {filtered[lightboxIndex].description && (
                  <div className="text-sm text-paper/60 mt-1">
                    {filtered[lightboxIndex].description}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
