import { NextResponse } from 'next/server';
import { commentSchema } from '@/lib/validations';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = commentSchema.parse(body);

    const supabase = createClient();
    const { error } = await supabase.from('news_comments').insert({
      news_id: data.news_id,
      author_name: data.author_name,
      author_email: data.author_email,
      content: data.content,
      status: 'pending',
    });

    if (error) {
      console.error('Comment insert error:', error);
      return NextResponse.json({ error: 'Erro ao enviar comentário' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Comment API error:', err);
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}
