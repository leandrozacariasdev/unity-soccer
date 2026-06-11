'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MailOpen, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function ToggleReadButton({ id, isRead }: { id: string; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('contact_submissions')
      .update({ is_read: !isRead })
      .eq('id', id);
    setLoading(false);
    if (error) {
      toast.error('Erro ao atualizar');
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="p-2 text-ink-mid hover:text-gold"
      aria-label={isRead ? 'Marcar como não lida' : 'Marcar como lida'}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isRead ? (
        <MailOpen size={16} />
      ) : (
        <Mail size={16} />
      )}
    </button>
  );
}
