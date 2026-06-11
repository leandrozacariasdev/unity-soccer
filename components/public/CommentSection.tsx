'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { commentSchema, type CommentInput } from '@/lib/validations';
import type { Comment } from '@/lib/types';
import { formatDate } from '@/lib/utils';

type Props = {
  newsId: string;
  initialComments: Comment[];
};

export function CommentSection({ newsId, initialComments }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<CommentInput, 'news_id'>>({
    resolver: zodResolver(commentSchema.omit({ news_id: true })),
  });

  async function onSubmit(data: Omit<CommentInput, 'news_id'>) {
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, news_id: newsId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Erro ao enviar comentário');
      }
      toast.success('Comentário enviado! Ele aparecerá após a moderação.');
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar comentário');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section bg-paper-warm">
      <div className="wrap max-w-3xl">
        <h2 className="font-display text-3xl uppercase tracking-[0.02em] text-ink mb-8">
          Comentários ({initialComments.length})
        </h2>

        {initialComments.length > 0 ? (
          <div className="space-y-6 mb-12">
            {initialComments.map((c) => (
              <div key={c.id} className="bg-paper border border-border p-6 rounded-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-ink">{c.author_name}</div>
                  <div className="text-xs text-smoke">{formatDate(c.created_at)}</div>
                </div>
                <p className="text-ink-mid text-sm leading-[1.7]">{c.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-mid mb-8 italic">Nenhum comentário ainda. Seja o primeiro!</p>
        )}

        <div className="bg-paper border border-border p-6 md:p-8 rounded-sm">
          <h3 className="font-display text-2xl uppercase tracking-[0.02em] text-ink mb-6">
            Deixe seu comentário
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">
                  Nome *
                </label>
                <input
                  type="text"
                  className="px-4 py-3 text-sm border border-border rounded-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 min-h-[44px]"
                  {...register('author_name')}
                />
                {errors.author_name && (
                  <span className="text-xs text-red-600">{errors.author_name.message}</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">
                  Email *
                </label>
                <input
                  type="email"
                  className="px-4 py-3 text-sm border border-border rounded-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 min-h-[44px]"
                  {...register('author_email')}
                />
                {errors.author_email && (
                  <span className="text-xs text-red-600">{errors.author_email.message}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">
                Comentário *
              </label>
              <textarea
                rows={4}
                className="px-4 py-3 text-sm border border-border rounded-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 resize-y"
                {...register('content')}
              />
              {errors.content && (
                <span className="text-xs text-red-600">{errors.content.message}</span>
              )}
            </div>
            <button type="submit" disabled={submitting} className="btn btn-ink">
              {submitting ? 'Enviando...' : 'Enviar comentário'}
            </button>
            <p className="text-xs text-smoke mt-3">
              Seu comentário será revisado antes de ser publicado.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
