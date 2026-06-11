import { createClient } from '@/lib/supabase/server';
import { NewsForm } from '@/components/admin/NewsForm';

export const metadata = { title: 'Nova Notícia · Admin' };

export default async function NewNewsPage() {
  const supabase = createClient();
  const { data: athletes } = await supabase
    .from('athletes')
    .select('id, name')
    .order('name');

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl uppercase tracking-[0.02em] text-ink mb-2">Nova Notícia</h1>
      <p className="text-ink-mid text-sm mb-8">Crie uma nova notícia para o site.</p>
      <NewsForm athletes={athletes ?? []} />
    </div>
  );
}
