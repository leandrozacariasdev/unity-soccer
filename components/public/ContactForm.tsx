'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { contactSchema, type ContactInput } from '@/lib/validations';

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactInput) {
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Erro ao enviar mensagem');
      }
      toast.success('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 mb-5">
          <label htmlFor="name" className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">
            Nome *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            autoComplete="given-name"
            className="px-4 py-3.5 text-[0.9375rem] text-ink bg-paper border border-border rounded-[3px] focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all min-h-[48px]"
            {...register('name')}
          />
          {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5 mb-5">
          <label htmlFor="email" className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">
            Email *
          </label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            className="px-4 py-3.5 text-[0.9375rem] text-ink bg-paper border border-border rounded-[3px] focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all min-h-[48px]"
            {...register('email')}
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 mb-5">
          <label htmlFor="phone" className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">
            Telefone
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            autoComplete="tel"
            className="px-4 py-3.5 text-[0.9375rem] text-ink bg-paper border border-border rounded-[3px] focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all min-h-[48px]"
            {...register('phone')}
          />
        </div>
        <div className="flex flex-col gap-1.5 mb-5">
          <label htmlFor="subject" className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">
            Assunto
          </label>
          <input
            id="subject"
            type="text"
            placeholder="Como podemos ajudar?"
            className="px-4 py-3.5 text-[0.9375rem] text-ink bg-paper border border-border rounded-[3px] focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all min-h-[48px]"
            {...register('subject')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-5">
        <label htmlFor="message" className="text-xs font-semibold tracking-[0.08em] uppercase text-ink-mid">
          Mensagem *
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Escreva sua mensagem aqui..."
          className="px-4 py-3.5 text-[0.9375rem] text-ink bg-paper border border-border rounded-[3px] focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/10 transition-all min-h-[130px] resize-y"
          {...register('message')}
        />
        {errors.message && <span className="text-xs text-red-600">{errors.message.message}</span>}
      </div>

      <button
        type="submit"
        disabled={sending}
        className="btn btn-ink w-full justify-center disabled:opacity-50"
      >
        <Send size={16} />
        {sending ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </form>
  );
}
