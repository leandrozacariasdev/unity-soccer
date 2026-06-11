import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AthleteForm } from '@/components/admin/AthleteForm';
import type { Athlete } from '@/lib/types';

export const metadata = { title: 'Editar Atleta · Admin' };

type Props = { params: { id: string } };

export default async function EditAthletePage({ params }: Props) {
  const supabase = createClient();
  const { data } = await supabase
    .from('athletes')
    .select('*')
    .eq('id', params.id)
    .single();
  if (!data) notFound();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl uppercase tracking-[0.02em] text-ink mb-2">
        Editar: {data.name}
      </h1>
      <p className="text-ink-mid text-sm mb-8">Atualize as informações do atleta.</p>
      <AthleteForm athlete={data as Athlete} />
    </div>
  );
}
