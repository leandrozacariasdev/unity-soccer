'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { LogIn, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
type Input = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Input) {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword(data);
      if (error) {
        toast.error('Email ou senha incorretos');
        return;
      }
      toast.success('Login realizado com sucesso!');
      const redirect = search.get('redirect') || '/admin/dashboard';
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-ink-soft border border-border-inv rounded-sm p-8">
      <h1 className="font-display text-3xl uppercase tracking-[0.04em] text-paper mb-2">
        Área Administrativa
      </h1>
      <p className="text-paper/50 text-sm mb-8">Faça login para gerenciar o site.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-xs font-semibold tracking-[0.08em] uppercase text-paper/60">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            className="px-4 py-3 text-sm bg-ink border border-border-inv text-paper rounded-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 min-h-[44px]"
            {...register('email')}
          />
          {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-xs font-semibold tracking-[0.08em] uppercase text-paper/60">
            Senha
          </label>
          <input
            type="password"
            autoComplete="current-password"
            className="px-4 py-3 text-sm bg-ink border border-border-inv text-paper rounded-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 min-h-[44px]"
            {...register('password')}
          />
          {errors.password && <span className="text-xs text-red-400">{errors.password.message}</span>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-gold w-full justify-center"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
