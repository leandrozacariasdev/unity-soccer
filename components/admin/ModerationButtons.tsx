'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function ModerationButtons({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(newStatus: 'approved' | 'rejected' | 'pending') {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('news_comments')
      .update({ status: newStatus })
      .eq('id', id);
    setLoading(false);
    if (error) {
      toast.error('Erro ao atualizar');
      return;
    }
    toast.success(`Comentário ${newStatus === 'approved' ? 'aprovado' : 'rejeitado'}`);
    router.refresh();
  }

  if (status === 'approved') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => update('rejected')}
          disabled={loading}
          className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-sm hover:bg-red-200 flex items-center gap-1.5"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
          Rejeitar
        </button>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => update('approved')}
          disabled={loading}
          className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-sm hover:bg-green-200 flex items-center gap-1.5"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          Aprovar
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => update('approved')}
        disabled={loading}
        className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-sm hover:bg-green-200 flex items-center gap-1.5"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
        Aprovar
      </button>
      <button
        onClick={() => update('rejected')}
        disabled={loading}
        className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-sm hover:bg-red-200 flex items-center gap-1.5"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
        Rejeitar
      </button>
    </div>
  );
}
