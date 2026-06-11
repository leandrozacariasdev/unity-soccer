'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Power, PowerOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function ToggleAthleteActive({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('athletes')
      .update({ is_active: !isActive })
      .eq('id', id);
    setLoading(false);
    if (error) {
      toast.error('Erro ao atualizar');
      return;
    }
    toast.success(isActive ? 'Atleta desativado' : 'Atleta ativado');
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-sm transition-colors ${
        isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : isActive ? <Power size={12} /> : <PowerOff size={12} />}
      {isActive ? 'Ativo' : 'Inativo'}
    </button>
  );
}
