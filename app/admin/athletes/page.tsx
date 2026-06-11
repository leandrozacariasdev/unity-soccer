import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Power, PowerOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ToggleAthleteActive } from '@/components/admin/ToggleAthleteActive';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const metadata = { title: 'Atletas · Admin' };

export default async function AdminAthletesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('athletes')
    .select('*')
    .order('display_order', { ascending: true });
  const athletes = data ?? [];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-[0.02em] text-ink mb-2">Atletas</h1>
          <p className="text-ink-mid text-sm">Gerencie o perfil dos atletas representados.</p>
        </div>
        <Link href="/admin/athletes/new" className="btn btn-gold">
          <Plus size={16} /> Novo Atleta
        </Link>
      </div>

      {athletes.length === 0 ? (
        <div className="bg-paper border border-border rounded-sm p-12 text-center">
          <p className="text-ink-mid mb-4">Nenhum atleta cadastrado.</p>
          <Link href="/admin/athletes/new" className="btn btn-ink">
            <Plus size={16} /> Cadastrar primeiro atleta
          </Link>
        </div>
      ) : (
        <div className="bg-paper border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-warm">
              <tr>
                <th className="text-left p-4 text-xs font-semibold tracking-[0.04em] uppercase text-ink-mid">Atleta</th>
                <th className="text-left p-4 text-xs font-semibold tracking-[0.04em] uppercase text-ink-mid hidden md:table-cell">Posição</th>
                <th className="text-left p-4 text-xs font-semibold tracking-[0.04em] uppercase text-ink-mid hidden lg:table-cell">Clube</th>
                <th className="text-center p-4 text-xs font-semibold tracking-[0.04em] uppercase text-ink-mid">Status</th>
                <th className="text-right p-4 text-xs font-semibold tracking-[0.04em] uppercase text-ink-mid">Ações</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map((a) => (
                <tr key={a.id} className="border-t border-border hover:bg-paper-warm/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {a.photo_url ? (
                        <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-ink-soft flex-shrink-0">
                          <Image src={a.photo_url} alt={a.name} fill sizes="48px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-sm bg-ink-soft flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-ink">{a.name}</div>
                        <div className="text-xs text-ink-mid">/{a.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-ink-mid hidden md:table-cell">{a.position || '—'}</td>
                  <td className="p-4 text-ink-mid hidden lg:table-cell">{a.current_club || '—'}</td>
                  <td className="p-4 text-center">
                    <ToggleAthleteActive id={a.id} isActive={a.is_active} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/athletes/${a.id}`}
                        className="p-2 text-ink-mid hover:text-gold transition-colors"
                        aria-label="Editar"
                      >
                        <Edit size={16} />
                      </Link>
                      <DeleteButton id={a.id} table="athletes" confirmText={`Excluir ${a.name}?`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
