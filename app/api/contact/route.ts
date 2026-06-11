import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { createAdminClient } from '@/lib/supabase/admin';
import { resend } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const supabase = createAdminClient();

    // 1) Salvar no banco
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    });

    if (dbError) {
      console.error('DB error:', dbError);
      return NextResponse.json(
        { error: 'Erro ao salvar mensagem' },
        { status: 500 },
      );
    }

    // 2) Buscar email de destino
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'form_recipient_email')
      .single();

    const recipient =
      typeof settingsData?.value === 'string'
        ? settingsData.value.replace(/^"|"$/g, '')
        : 'contato@unitysoccer.com.br';

    // 3) Enviar email via Resend (se configurado)
    if (resend) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@unitysoccer.com.br',
          to: recipient,
          replyTo: data.email,
          subject: data.subject
            ? `[Contato] ${data.subject}`
            : `Novo contato de ${data.name}`,
          html: `
            <h2>Novo contato recebido pelo site</h2>
            <p><strong>Nome:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${escapeHtml(data.email)}</a></p>
            ${data.phone ? `<p><strong>Telefone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
            ${data.subject ? `<p><strong>Assunto:</strong> ${escapeHtml(data.subject)}</p>` : ''}
            <hr />
            <h3>Mensagem:</h3>
            <p style="white-space: pre-wrap">${escapeHtml(data.message)}</p>
          `,
        });
      } catch (emailErr) {
        console.error('Email error:', emailErr);
        // Não falha a request se email falhar — dados já foram salvos
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && 'issues' in err) {
      return NextResponse.json(
        { error: 'Dados inválidos', issues: (err as unknown as { issues: unknown }).issues },
        { status: 400 },
      );
    }
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
