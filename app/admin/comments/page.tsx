import { createClient } from '@/lib/supabase/server';
import { ModerationButtons } from '@/components/admin/ModerationButtons';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const metadata = { title: 'Comentários · Admin' };

export default async function CommentsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('news_comments')
    .select('*, news:news_id(title, slug)')
    .order('created_at', { ascending: false });
  const comments = (data ?? []) as Array<{
    id: string;
    author_name: string;
    author_email: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    news: { title: string; slug: string } | null;
  }>;

  const counts = {
    pending: comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    rejected: comments.filter((c) => c.status === 'rejected').length,
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl uppercase tracking-[0.02em] text-ink mb-2">Comentários</h1>
        <p className="text-ink-mid text-sm">Modere os comentários das notícias.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-orange-50 border border-orange-200 rounded-sm p-4">
          <div className="text-xs text-orange-700 uppercase font-semibold tracking-[0.04em]">Pendentes</div>
          <div className="font-display text-3xl text-orange-900 mt-1">{counts.pending}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-sm p-4">
          <div className="text-xs text-green-700 uppercase font-semibold tracking-[0.04em]">Aprovados</div>
          <div className="font-display text-3xl text-green-900 mt-1">{counts.approved}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-sm p-4">
          <div className="text-xs text-red-700 uppercase font-semibold tracking-[0.04em]">Rejeitados</div>
          <div className="font-display text-3xl text-red-900 mt-1">{counts.rejected}</div>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="bg-paper border border-border rounded-sm p-12 text-center text-ink-mid">
          Nenhum comentário ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className={`bg-paper border rounded-sm p-5 ${
                c.status === 'pending'
                  ? 'border-orange-300'
                  : c.status === 'approved'
                    ? 'border-green-200'
                    : 'border-red-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-semibold text-ink">{c.author_name}</div>
                  <div className="text-xs text-ink-mid">
                    {c.author_email} · {formatDate(c.created_at)}
                  </div>
                  {c.news && (
                    <div className="text-xs text-smoke mt-1">
                      em:{' '}
                      <Link
                        href={`/noticias/${c.news.slug}`}
                        target="_blank"
                        className="text-gold hover:underline"
                      >
                        {c.news.title}
                      </Link>
                    </div>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 text-[0.6875rem] font-semibold uppercase rounded-sm ${
                    c.status === 'pending'
                      ? 'bg-orange-100 text-orange-700'
                      : c.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {c.status === 'pending' ? 'Pendente' : c.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                </span>
              </div>
              <p className="text-sm text-ink-mid leading-[1.7] mb-4 whitespace-pre-wrap">{c.content}</p>
              <div className="flex items-center justify-between">
                <ModerationButtons id={c.id} status={c.status} />
                <DeleteButton id={c.id} table="news_comments" confirmText="Excluir comentário?" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
