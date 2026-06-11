import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { ToggleReadButton } from '@/components/admin/ToggleReadButton';
import { formatDate, formatDateLong } from '@/lib/utils';

export const metadata = { title: 'Contatos · Admin' };

export default async function ContactsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  const contacts = data ?? [];

  const unread = contacts.filter((c) => !c.is_read).length;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl uppercase tracking-[0.02em] text-ink mb-2">Contatos</h1>
        <p className="text-ink-mid text-sm">
          Mensagens recebidas pelo formulário de contato. {unread > 0 && (
            <span className="text-gold font-semibold">{unread} não lida(s)</span>
          )}
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-paper border border-border rounded-sm p-12 text-center text-ink-mid">
          Nenhuma mensagem recebida.
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className={`bg-paper border rounded-sm p-5 ${
                c.is_read ? 'border-border' : 'border-gold/40 bg-gold/[0.02]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-semibold text-ink flex items-center gap-2">
                    {c.name}
                    {!c.is_read && <span className="w-2 h-2 rounded-full bg-gold" />}
                  </div>
                  <div className="text-sm text-ink-mid">
                    <a href={`mailto:${c.email}`} className="hover:text-gold">{c.email}</a>
                    {c.phone && <> · {c.phone}</>}
                  </div>
                  <div className="text-xs text-smoke mt-1">{formatDateLong(c.created_at)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <ToggleReadButton id={c.id} isRead={c.is_read} />
                  <DeleteButton id={c.id} table="contact_submissions" confirmText="Excluir mensagem?" />
                </div>
              </div>
              {c.subject && (
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-smoke mb-2">
                  Assunto: {c.subject}
                </div>
              )}
              <p className="text-sm text-ink-mid leading-[1.7] whitespace-pre-wrap">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
