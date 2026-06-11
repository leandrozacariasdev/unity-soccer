import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const metadata = { title: 'Configurações · Admin' };

export default async function SettingsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('*');
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    const v = row.value;
    map[row.key] = typeof v === 'string' ? v.replace(/^"|"$/g, '') : '';
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl uppercase tracking-[0.02em] text-ink mb-2">Configurações</h1>
      <p className="text-ink-mid text-sm mb-8">Informações de contato e redes sociais exibidas no site.</p>
      <SettingsForm initial={map} />
    </div>
  );
}
