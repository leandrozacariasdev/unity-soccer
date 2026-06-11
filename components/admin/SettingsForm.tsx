'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';
import { settingsSchema, type SettingsInput } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema) as never,
    defaultValues: {
      contact_email: initial.contact_email ?? '',
      contact_phone: initial.contact_phone ?? '',
      whatsapp: initial.whatsapp ?? '',
      whatsapp_display: initial.whatsapp_display ?? '',
      address: initial.address ?? '',
      business_hours: initial.business_hours ?? '',
      social_instagram: initial.social_instagram ?? '',
      social_youtube: initial.social_youtube ?? '',
      social_facebook: initial.social_facebook ?? '',
      social_linkedin: initial.social_linkedin ?? '',
      social_twitter: initial.social_twitter ?? '',
      form_recipient_email: initial.form_recipient_email ?? '',
      site_description: initial.site_description ?? '',
    },
  });

  async function onSubmit(data: SettingsInput) {
    setSaving(true);
    try {
      const supabase = createClient();
      const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value: JSON.stringify(value ?? '') });
        if (error) throw error;
      }
      toast.success('Configurações salvas!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Section title="Email & Telefone" desc="Exibidos na página de contato e no rodapé.">
        <Field label="Email de contato" error={errors.contact_email?.message}>
          <input type="email" className="input" {...register('contact_email')} />
        </Field>
        <Field label="Email que recebe o formulário" error={errors.form_recipient_email?.message} hint="Mensagens do formulário de contato serão enviadas para este email.">
          <input type="email" className="input" {...register('form_recipient_email')} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Telefone (exibido)">
            <input className="input" {...register('contact_phone')} />
          </Field>
          <Field label="WhatsApp (apenas números com DDI)" hint="Ex: 5511999998888">
            <input className="input" {...register('whatsapp')} />
          </Field>
        </div>
        <Field label="WhatsApp (texto exibido)" hint="Como aparece para o usuário. Ex: +55 (11) 99999 8888">
          <input className="input" {...register('whatsapp_display')} />
        </Field>
      </Section>

      <Section title="Endereço & Atendimento">
        <Field label="Endereço">
          <input className="input" {...register('address')} />
        </Field>
        <Field label="Horário de atendimento">
          <input className="input" {...register('business_hours')} />
        </Field>
      </Section>

      <Section title="Redes Sociais">
        <Field label="Instagram">
          <input className="input" placeholder="https://instagram.com/..." {...register('social_instagram')} />
        </Field>
        <Field label="YouTube">
          <input className="input" placeholder="https://youtube.com/..." {...register('social_youtube')} />
        </Field>
        <Field label="Facebook">
          <input className="input" placeholder="https://facebook.com/..." {...register('social_facebook')} />
        </Field>
        <Field label="LinkedIn">
          <input className="input" placeholder="https://linkedin.com/..." {...register('social_linkedin')} />
        </Field>
        <Field label="X (Twitter)">
          <input className="input" placeholder="https://x.com/..." {...register('social_twitter')} />
        </Field>
      </Section>

      <Section title="SEO">
        <Field label="Descrição do site" hint="Usada em meta description e no rodapé.">
          <textarea rows={3} className="input" {...register('site_description')} />
        </Field>
      </Section>

      <div className="sticky bottom-0 bg-paper-warm -mx-6 md:-mx-10 px-6 md:px-10 py-4 border-t border-border flex items-center justify-end">
        <button type="submit" disabled={saving} className="btn btn-gold">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Salvando...' : 'Salvar configurações'}
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

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-paper border border-border rounded-sm p-6">
      <h2 className="font-display text-lg uppercase tracking-[0.04em] text-ink mb-1">{title}</h2>
      {desc && <p className="text-sm text-ink-mid mb-4">{desc}</p>}
      <div className="space-y-4 mt-4">{children}</div>
    </div>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">{label}</label>
      {children}
      {hint && <p className="text-xs text-smoke">{hint}</p>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
