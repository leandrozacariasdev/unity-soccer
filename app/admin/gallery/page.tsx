import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { GalleryUploader } from '@/components/admin/GalleryUploader';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const metadata = { title: 'Galeria · Admin' };

export default async function AdminGalleryPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('gallery_items')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  const items = data ?? [];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl uppercase tracking-[0.02em] text-ink mb-2">Galeria</h1>
        <p className="text-ink-mid text-sm">Gerencie as fotos da galeria pública.</p>
      </div>

      <GalleryUploader />

      {items.length === 0 ? (
        <div className="bg-paper border border-border rounded-sm p-12 text-center mt-8">
          <p className="text-ink-mid">Nenhuma imagem na galeria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {items.map((item) => (
            <div key={item.id} className="bg-paper border border-border rounded-sm overflow-hidden group">
              <div className="relative aspect-square bg-ink-soft">
                <Image src={item.image_url} alt={item.title || ''} fill sizes="300px" className="object-cover" />
                {item.is_featured && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase bg-gold text-paper rounded-sm">
                    Destaque
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold text-ink truncate">{item.title || '(sem título)'}</div>
                {item.category && (
                  <div className="text-xs text-ink-mid mt-0.5 capitalize">{item.category}</div>
                )}
                <div className="flex justify-end mt-2">
                  <DeleteButton id={item.id} table="gallery_items" confirmText="Excluir imagem?" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
