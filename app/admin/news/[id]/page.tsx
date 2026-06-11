import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NewsForm } from '@/components/admin/NewsForm';
import type { News } from '@/lib/types';

export const metadata = { title: 'Editar Notícia · Admin' };

type Props = { params: { id: string } };

export default async function EditNewsPage({ params }: Props) {
  const supabase = createClient();
  const [{ data: news }, { data: athletes }] = await Promise.all([
    supabase.from('news').select('*').eq('id', params.id).single(),
    supabase.from('athletes').select('id, name').order('name'),
  ]);
  if (!news) notFound();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl uppercase tracking-[0.02em] text-ink mb-2">
        Editar Notícia
      </h1>
      <p className="text-ink-mid text-sm mb-8">Atualize o conteúdo e a publicação.</p>
      <NewsForm news={news as News} athletes={athletes ?? []} />
    </div>
  );
}
