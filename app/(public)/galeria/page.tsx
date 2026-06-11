import { createClient } from '@/lib/supabase/server';
import type { GalleryItem } from '@/lib/types';
import { GalleryGridWithLightbox } from '@/components/public/GalleryGridWithLightbox';

export const revalidate = 60;

export const metadata = {
  title: 'Galeria',
  description: 'Galeria de fotos da Unity Soccer: bastidores, jogos, eventos e momentos marcantes.',
};

export default async function GaleriaPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('gallery_items')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  const items = (data as GalleryItem[]) ?? [];

  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]));

  return (
    <>
      <section className="bg-paper pt-40 pb-16">
        <div className="wrap">
          <p className="section-label" data-reveal>Momentos</p>
          <h1 className="section-title" data-reveal data-delay="1">
            Galeria <span className="text-gold">de Fotos</span>
          </h1>
          <p className="text-ink-mid text-lg max-w-2xl" data-reveal data-delay="2">
            Bastidores, jogos, eventos e momentos marcantes do nosso dia a dia.
          </p>
        </div>
      </section>

      <section className="section bg-paper-warm">
        <div className="wrap">
          {items.length === 0 ? (
            <p className="text-ink-mid text-center py-20">Nenhuma foto cadastrada ainda.</p>
          ) : (
            <GalleryGridWithLightbox items={items} categories={categories} />
          )}
        </div>
      </section>
    </>
  );
}
