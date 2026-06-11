'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type Props = {
  id: string;
  table: 'athletes' | 'gallery_items' | 'news' | 'news_comments' | 'contact_submissions';
  confirmText: string;
};

export function DeleteButton({ id, table, confirmText }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(confirmText)) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq('id', id);
    setLoading(false);
    if (error) {
      toast.error('Erro ao excluir');
      return;
    }
    toast.success('Item excluído');
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-ink-mid hover:text-red-500 transition-colors"
      aria-label="Excluir"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
