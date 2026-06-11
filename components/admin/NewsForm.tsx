'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save, Upload, X, Loader2, ExternalLink } from 'lucide-react';
import { newsSchema, type NewsInput } from '@/lib/validations';
import type { News } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { NewsEditor } from '@/components/admin/NewsEditor';

type Props = { news?: News; athletes: Array<{ id: string; name: string }> };

const CATEGORIES = [
  { value: 'geral', label: 'Geral' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'premiacao', label: 'Premiação' },
  { value: 'evento', label: 'Evento' },
  { value: 'elenco', label: 'Elenco' },
  { value: 'parceria', label: 'Parceria' },
];

export function NewsForm({ news, athletes }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState(news?.content ?? '<p></p>');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsInput>({
    resolver: zodResolver(newsSchema) as never,
    defaultValues: news
      ? {
          slug: news.slug,
          title: news.title,
          excerpt: news.excerpt ?? '',
          content: news.content,
          cover_url: news.cover_url ?? '',
          cover_caption: news.cover_caption ?? '',
          author: news.author,
          category: news.category,
          related_athlete_id: news.related_athlete_id ?? '',
          is_published: news.is_published,
          is_featured: news.is_featured,
          published_at: news.published_at ? news.published_at.slice(0, 16) : '',
          meta_title: news.meta_title ?? '',
          meta_description: news.meta_description ?? '',
        }
      : {
          author: 'Unity Soccer',
          category: 'geral',
          is_published: false,
          is_featured: false,
        },
  });

  const title = watch('title');
  const coverUrl = watch('cover_url');

  function handleTitleChange(v: string) {
    setValue('title', v);
    if (!news) {
      setValue('slug', slugify(v));
    }
  }

  async function uploadCover(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('news').upload(path, file);
      if (error) throw error;
      const { data: url } = supabase.storage.from('news').getPublicUrl(path);
      setValue('cover_url', url.publicUrl);
      toast.success('Capa enviada');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar');
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: NewsInput) {
    setSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        ...data,
        content,
        published_at: data.is_published
          ? (data.published_at ? new Date(data.published_at).toISOString() : new Date().toISOString())
          : null,
        related_athlete_id: data.related_athlete_id || null,
      };

      if (news) {
        const { error } = await supabase
          .from('news')
          .update(payload)
          .eq('id', news.id);
        if (error) throw error;
        toast.success('Notícia atualizada!');
      } else {
        const { error } = await supabase.from('news').insert(payload);
        if (error) throw error;
        toast.success('Notícia criada!');
      }
      router.push('/admin/news');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-paper border border-border rounded-sm p-6">
          <input
            type="text"
            placeholder="Título da notícia"
            value={title ?? ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-3xl font-display uppercase tracking-[0.02em] border-none outline-none bg-transparent placeholder:text-ink-mid/40 mb-4"
          />
          {errors.title && <p className="text-xs text-red-600 mb-2">{errors.title.message}</p>}
          <input
            type="text"
            placeholder="URL (slug)"
            {...register('slug')}
            className="w-full text-sm border-b border-border pb-2 outline-none focus:border-gold"
          />
          {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
        </div>

        <div className="bg-paper border border-border rounded-sm p-6">
          <label className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid mb-2 block">
            Resumo
          </label>
          <textarea
            rows={3}
            placeholder="Resumo exibido na listagem e meta description"
            className="w-full text-sm border border-border rounded-sm p-3 outline-none focus:border-gold resize-y"
            {...register('excerpt')}
          />
        </div>

        <div className="bg-paper border border-border rounded-sm p-6">
          <label className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid mb-3 block">
            Conteúdo *
          </label>
          <NewsEditor content={content} onChange={setContent} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-paper border border-border rounded-sm p-6 space-y-4">
          <h3 className="font-display text-base uppercase tracking-[0.04em] text-ink mb-2">Publicação</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" {...register('is_published')} />
            <span className="text-sm">Publicada</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" {...register('is_featured')} />
            <span className="text-sm">Em destaque na home</span>
          </label>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-mid block mb-1.5">
              Data de publicação
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-gold"
              {...register('published_at')}
            />
          </div>
        </div>

        <div className="bg-paper border border-border rounded-sm p-6 space-y-4">
          <h3 className="font-display text-base uppercase tracking-[0.04em] text-ink mb-2">Capa</h3>
          {coverUrl ? (
            <div className="relative aspect-video bg-ink-soft rounded-sm overflow-hidden">
              <Image src={coverUrl} alt="" fill sizes="300px" className="object-cover" />
              <button
                type="button"
                onClick={() => setValue('cover_url', '')}
                className="absolute top-2 right-2 p-1.5 bg-ink/80 text-paper rounded-full hover:bg-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="aspect-video bg-paper-warm border-2 border-dashed border-border rounded-sm flex items-center justify-center text-ink-mid text-sm">
              Sem capa
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="cover-news"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadCover(f);
            }}
          />
          <label
            htmlFor="cover-news"
            className="btn btn-ink w-full justify-center cursor-pointer"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Enviando...' : 'Enviar capa'}
          </label>
          <input
            type="text"
            placeholder="Legenda da imagem (opcional)"
            className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-gold"
            {...register('cover_caption')}
          />
        </div>

        <div className="bg-paper border border-border rounded-sm p-6 space-y-4">
          <h3 className="font-display text-base uppercase tracking-[0.04em] text-ink mb-2">Detalhes</h3>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-mid block mb-1.5">
              Categoria
            </label>
            <select
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-gold"
              {...register('category')}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-mid block mb-1.5">
              Atleta relacionado
            </label>
            <select
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-gold"
              {...register('related_athlete_id')}
            >
              <option value="">— Nenhum —</option>
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-mid block mb-1.5">
              Autor
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-gold"
              {...register('author')}
            />
          </div>
        </div>

        <div className="bg-paper border border-border rounded-sm p-6 space-y-4">
          <h3 className="font-display text-base uppercase tracking-[0.04em] text-ink mb-2">SEO</h3>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-mid block mb-1.5">
              Meta título
            </label>
            <input
              type="text"
              placeholder="Se vazio, usa o título"
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-gold"
              {...register('meta_title')}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-mid block mb-1.5">
              Meta descrição
            </label>
            <textarea
              rows={2}
              placeholder="Se vazio, usa o resumo"
              className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-gold resize-y"
              {...register('meta_description')}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 sticky bottom-0 bg-paper-warm -mx-6 md:-mx-10 px-6 md:px-10 py-4 border-t border-border flex items-center justify-end gap-3">
        {news && news.is_published && (
          <Link
            href={`/noticias/${news.slug}`}
            target="_blank"
            className="text-sm text-ink-mid hover:text-ink flex items-center gap-1.5 mr-auto"
          >
            <ExternalLink size={14} /> Ver no site
          </Link>
        )}
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-ink-mid hover:text-ink"
        >
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="btn btn-gold">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
