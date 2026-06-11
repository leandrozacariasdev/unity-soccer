'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save, Plus, X, Upload, Loader2 } from 'lucide-react';
import { athleteSchema, type AthleteInput } from '@/lib/validations';
import type { Athlete, CareerEntry, Highlight } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

type Props = {
  athlete?: Athlete;
};

const POSITIONS = ['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meio Campo', 'Extremo', 'Atacante'];

export function AthleteForm({ athlete }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'photo' | 'cover' | null>(null);
  const [career, setCareer] = useState<CareerEntry[]>(athlete?.career ?? []);
  const [highlights, setHighlights] = useState<Highlight[]>(athlete?.highlights ?? []);
  const [statsPairs, setStatsPairs] = useState<Array<[string, string]>>(
    athlete?.stats
      ? (Object.entries(athlete.stats) as Array<[string, string]>)
      : []
  );
  const [socialPairs, setSocialPairs] = useState<Array<[string, string]>>(
    athlete?.social ? Object.entries(athlete.social) : []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AthleteInput>({
    resolver: zodResolver(athleteSchema) as never,
    defaultValues: athlete
      ? {
          slug: athlete.slug,
          name: athlete.name,
          position: athlete.position ?? '',
          birth_date: athlete.birth_date ?? '',
          nationality: athlete.nationality ?? '',
          current_club: athlete.current_club ?? '',
          shirt_number: athlete.shirt_number ?? undefined,
          height_cm: athlete.height_cm ?? undefined,
          preferred_foot: athlete.preferred_foot ?? '',
          bio: athlete.bio ?? '',
          full_bio: athlete.full_bio ?? '',
          photo_url: athlete.photo_url ?? '',
          cover_url: athlete.cover_url ?? '',
          is_active: athlete.is_active,
          display_order: athlete.display_order,
          highlights: athlete.highlights ?? [],
          career: athlete.career ?? [],
          stats: athlete.stats ?? {},
          social: athlete.social ?? {},
        }
      : {
          is_active: true,
          display_order: 0,
          highlights: [],
          career: [],
          stats: {},
          social: {},
        },
  });

  const photoUrl = watch('photo_url');
  const coverUrl = watch('cover_url');
  const name = watch('name');

  // Auto-gera slug
  function handleNameChange(v: string) {
    setValue('name', v);
    if (!athlete) {
      setValue('slug', slugify(v));
    }
  }

  async function uploadFile(file: File, kind: 'photo' | 'cover') {
    setUploading(kind);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from('athletes')
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: url } = supabase.storage.from('athletes').getPublicUrl(path);
      setValue(kind === 'photo' ? 'photo_url' : 'cover_url', url.publicUrl);
      toast.success('Imagem enviada');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar');
    } finally {
      setUploading(null);
    }
  }

  async function onSubmit(data: AthleteInput) {
    setSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        ...data,
        highlights,
        career,
        stats: Object.fromEntries(statsPairs.filter(([k]) => k)),
        social: Object.fromEntries(socialPairs.filter(([k]) => k)),
      };

      if (athlete) {
        const { error } = await supabase
          .from('athletes')
          .update(payload)
          .eq('id', athlete.id);
        if (error) throw error;
        toast.success('Atleta atualizado!');
      } else {
        const { error } = await supabase.from('athletes').insert(payload);
        if (error) throw error;
        toast.success('Atleta criado!');
      }
      router.push('/admin/athletes');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Dados básicos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nome *" error={errors.name?.message}>
                <input
                  className="input"
                  value={name ?? ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </Field>
              <Field label="Slug (URL) *" error={errors.slug?.message}>
                <input className="input" {...register('slug')} />
              </Field>
              <Field label="Posição">
                <select className="input" {...register('position')}>
                  <option value="">— Selecione —</option>
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Nacionalidade">
                <input className="input" {...register('nationality')} />
              </Field>
              <Field label="Data de nascimento">
                <input type="date" className="input" {...register('birth_date')} />
              </Field>
              <Field label="Clube atual">
                <input className="input" {...register('current_club')} />
              </Field>
              <Field label="Número da camisa">
                <input type="number" className="input" {...register('shirt_number', { valueAsNumber: true })} />
              </Field>
              <Field label="Altura (cm)">
                <input type="number" className="input" {...register('height_cm', { valueAsNumber: true })} />
              </Field>
              <Field label="Pé dominante">
                <select className="input" {...register('preferred_foot')}>
                  <option value="">—</option>
                  <option value="Destro">Destro</option>
                  <option value="Canhoto">Canhoto</option>
                  <option value="Ambidestro">Ambidestro</option>
                </select>
              </Field>
              <Field label="Ordem de exibição">
                <input type="number" className="input" {...register('display_order', { valueAsNumber: true })} />
              </Field>
            </div>
          </Section>

          <Section title="Biografia">
            <Field label="Bio curta (para cards)">
              <textarea rows={3} className="input" {...register('bio')} />
            </Field>
            <Field label="Biografia completa (página individual)">
              <textarea rows={8} className="input" {...register('full_bio')} />
              <p className="text-xs text-ink-mid mt-1">Use linhas em branco para separar parágrafos.</p>
            </Field>
          </Section>

          <Section title="Estatísticas (chave/valor)">
            <div className="space-y-2">
              {statsPairs.map((pair, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Chave (ex: Jogos)"
                    value={pair[0]}
                    onChange={(e) => {
                      const next = [...statsPairs];
                      next[i] = [e.target.value, pair[1]];
                      setStatsPairs(next);
                    }}
                  />
                  <input
                    className="input flex-1"
                    placeholder="Valor (ex: 120)"
                    value={pair[1]}
                    onChange={(e) => {
                      const next = [...statsPairs];
                      next[i] = [pair[0], e.target.value];
                      setStatsPairs(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setStatsPairs(statsPairs.filter((_, idx) => idx !== i))}
                    className="p-2 text-ink-mid hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setStatsPairs([...statsPairs, ['', '']])}
                className="text-sm text-gold hover:text-gold-light flex items-center gap-1"
              >
                <Plus size={14} /> Adicionar estatística
              </button>
            </div>
          </Section>

          <Section title="Carreira (por temporada)">
            <div className="space-y-3">
              {career.map((c, i) => (
                <div key={i} className="grid grid-cols-2 md:grid-cols-6 gap-2 p-3 bg-paper-warm rounded-sm">
                  <input
                    className="input md:col-span-1"
                    placeholder="Temporada (ex: 2025)"
                    value={c.season}
                    onChange={(e) => {
                      const next = [...career];
                      next[i] = { ...c, season: e.target.value };
                      setCareer(next);
                    }}
                  />
                  <input
                    className="input md:col-span-2"
                    placeholder="Clube"
                    value={c.club}
                    onChange={(e) => {
                      const next = [...career];
                      next[i] = { ...c, club: e.target.value };
                      setCareer(next);
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Jogos"
                    type="number"
                    value={c.apps ?? ''}
                    onChange={(e) => {
                      const next = [...career];
                      next[i] = { ...c, apps: e.target.value ? Number(e.target.value) : undefined };
                      setCareer(next);
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Gols"
                    type="number"
                    value={c.goals ?? ''}
                    onChange={(e) => {
                      const next = [...career];
                      next[i] = { ...c, goals: e.target.value ? Number(e.target.value) : undefined };
                      setCareer(next);
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Assist."
                    type="number"
                    value={c.assists ?? ''}
                    onChange={(e) => {
                      const next = [...career];
                      next[i] = { ...c, assists: e.target.value ? Number(e.target.value) : undefined };
                      setCareer(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setCareer(career.filter((_, idx) => idx !== i))}
                    className="p-2 text-ink-mid hover:text-red-500 col-span-2 md:col-span-6 justify-self-end"
                  >
                    <X size={16} /> Remover temporada
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCareer([...career, { season: '', club: '' }])}
                className="text-sm text-gold hover:text-gold-light flex items-center gap-1"
              >
                <Plus size={14} /> Adicionar temporada
              </button>
            </div>
          </Section>

          <Section title="Highlights (vídeos/links)">
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Título"
                    value={h.title}
                    onChange={(e) => {
                      const next = [...highlights];
                      next[i] = { ...h, title: e.target.value };
                      setHighlights(next);
                    }}
                  />
                  <input
                    className="input flex-[2]"
                    placeholder="URL (YouTube, Vimeo...)"
                    value={h.url}
                    onChange={(e) => {
                      const next = [...highlights];
                      next[i] = { ...h, url: e.target.value };
                      setHighlights(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
                    className="p-2 text-ink-mid hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setHighlights([...highlights, { title: '', url: '' }])}
                className="text-sm text-gold hover:text-gold-light flex items-center gap-1"
              >
                <Plus size={14} /> Adicionar highlight
              </button>
            </div>
          </Section>

          <Section title="Redes sociais">
            <div className="space-y-2">
              {socialPairs.map((pair, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Rede (ex: instagram)"
                    value={pair[0]}
                    onChange={(e) => {
                      const next = [...socialPairs];
                      next[i] = [e.target.value, pair[1]];
                      setSocialPairs(next);
                    }}
                  />
                  <input
                    className="input flex-[2]"
                    placeholder="URL"
                    value={pair[1]}
                    onChange={(e) => {
                      const next = [...socialPairs];
                      next[i] = [pair[0], e.target.value];
                      setSocialPairs(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setSocialPairs(socialPairs.filter((_, idx) => idx !== i))}
                    className="p-2 text-ink-mid hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSocialPairs([...socialPairs, ['', '']])}
                className="text-sm text-gold hover:text-gold-light flex items-center gap-1"
              >
                <Plus size={14} /> Adicionar rede social
              </button>
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Foto principal">
            {photoUrl ? (
              <div className="relative aspect-[3/4] mb-3 bg-ink-soft rounded-sm overflow-hidden">
                <Image src={photoUrl} alt="" fill sizes="300px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => setValue('photo_url', '')}
                  className="absolute top-2 right-2 p-1.5 bg-ink/80 text-paper rounded-full hover:bg-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="aspect-[3/4] bg-paper-warm border-2 border-dashed border-border rounded-sm flex items-center justify-center text-ink-mid text-sm mb-3">
                Sem foto
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="photo-upload"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, 'photo');
              }}
            />
            <label
              htmlFor="photo-upload"
              className="btn btn-ink w-full justify-center cursor-pointer"
            >
              {uploading === 'photo' ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading === 'photo' ? 'Enviando...' : 'Enviar foto'}
            </label>
          </Section>

          <Section title="Imagem de capa">
            {coverUrl ? (
              <div className="relative aspect-[16/9] mb-3 bg-ink-soft rounded-sm overflow-hidden">
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
              <div className="aspect-[16/9] bg-paper-warm border-2 border-dashed border-border rounded-sm flex items-center justify-center text-ink-mid text-sm mb-3">
                Sem capa
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="cover-upload"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, 'cover');
              }}
            />
            <label
              htmlFor="cover-upload"
              className="btn btn-ink w-full justify-center cursor-pointer"
            >
              {uploading === 'cover' ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading === 'cover' ? 'Enviando...' : 'Enviar capa'}
            </label>
          </Section>

          <Section title="Visibilidade">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" {...register('is_active')} />
              <span className="text-sm">Atleta ativo (visível no site)</span>
            </label>
          </Section>
        </div>
      </div>

      <div className="sticky bottom-0 bg-paper-warm -mx-6 md:-mx-10 px-6 md:px-10 py-4 border-t border-border flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-ink-mid hover:text-ink"
        >
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="btn btn-gold">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Salvando...' : 'Salvar Atleta'}
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          background: var(--paper);
          border: 1px solid var(--border);
          border-radius: 3px;
          transition: border-color 200ms, box-shadow 200ms;
          min-height: 40px;
        }
        .input:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(184, 64, 112, 0.1);
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-paper border border-border rounded-sm p-6">
      <h2 className="font-display text-lg uppercase tracking-[0.04em] text-ink mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
