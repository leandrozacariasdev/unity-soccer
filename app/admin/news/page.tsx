import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Notícias · Admin' };

const CATEGORY_LABELS: Record<string, string> = {
  transferencia: 'Transferência',
  contrato: 'Contrato',
  premiacao: 'Premiação',
  evento: 'Evento',
  elenco: 'Elenco',
  parceria: 'Parceria',
  geral: 'Geral',
};

export default async function AdminNewsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });
  const news = data ?? [];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-[0.02em] text-ink mb-2">Notícias</h1>
          <p className="text-ink-mid text-sm">Crie e publique notícias para o site.</p>
        </div>
        <Link href="/admin/news/new" className="btn btn-gold">
          <Plus size={16} /> Nova Notícia
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="bg-paper border border-border rounded-sm p-12 text-center">
          <p className="text-ink-mid mb-4">Nenhuma notícia criada.</p>
          <Link href="/admin/news/new" className="btn btn-ink">
            <Plus size={16} /> Criar primeira notícia
          </Link>
        </div>
      ) : (
        <div className="bg-paper border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-warm">
              <tr>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-[0.04em] text-ink-mid">Notícia</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-[0.04em] text-ink-mid hidden md:table-cell">Categoria</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-[0.04em] text-ink-mid hidden lg:table-cell">Data</th>
                <th className="text-center p-4 text-xs font-semibold uppercase tracking-[0.04em] text-ink-mid">Status</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-[0.04em] text-ink-mid">Ações</th>
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n.id} className="border-t border-border hover:bg-paper-warm/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {n.cover_url ? (
                        <div className="relative w-16 h-10 rounded-sm overflow-hidden bg-ink-soft flex-shrink-0">
                          <Image src={n.cover_url} alt="" fill sizes="64px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded-sm bg-ink-soft flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-ink line-clamp-1">{n.title}</div>
                        <div className="text-xs text-ink-mid">/{n.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-ink-mid hidden md:table-cell">
                    <span className="px-2 py-1 bg-paper-warm rounded-sm text-xs capitalize">
                      {CATEGORY_LABELS[n.category] || n.category}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-ink-mid hidden lg:table-cell">
                    {formatDate(n.published_at || n.created_at)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {n.is_published ? (
                        <span className="inline-block px-2 py-0.5 text-[0.6875rem] font-semibold uppercase bg-green-100 text-green-700 rounded-sm">
                          Publicada
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[0.6875rem] font-semibold uppercase bg-gray-200 text-gray-600 rounded-sm">
                          Rascunho
                        </span>
                      )}
                      {n.is_featured && (
                        <span className="inline-block px-2 py-0.5 text-[0.6875rem] font-semibold uppercase bg-gold/20 text-gold rounded-sm">
                          Destaque
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/news/${n.id}`}
                        className="px-3 py-1.5 text-xs font-semibold text-gold hover:text-gold-light"
                      >
                        Editar
                      </Link>
                      <DeleteButton id={n.id} table="news" confirmText={`Excluir "${n.title}"?`} />
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
