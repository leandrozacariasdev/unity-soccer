import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ContactForm } from './ContactForm';

type SettingsMap = Record<string, string>;

async function getSettings(): Promise<SettingsMap> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('site_settings').select('key,value');
    const map: SettingsMap = {};
    for (const row of data ?? []) {
      const v = row.value;
      map[row.key] = typeof v === 'string' ? v.replace(/^"|"$/g, '') : '';
    }
    return map;
  } catch {
    return {};
  }
}

export async function Contact() {
  const settings = await getSettings();
  const whatsapp = settings.whatsapp;
  const whatsappDisplay = settings.whatsapp_display || settings.contact_phone;
  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : '#';

  return (
    <section className="section bg-paper-warm" id="contato" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div data-reveal="left">
            <p className="section-label">Fale Conosco</p>
            <h2 id="contact-title" className="section-title">
              Vamos <span className="text-gold">Conversar.</span>
            </h2>
            <p className="text-base text-ink-mid mb-10">
              Tem interesse em nossos serviços ou quer representar um atleta? Entre em contato
              pelos canais abaixo.
            </p>

            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-ink rounded flex items-center justify-center text-gold">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-xs font-semibold tracking-[0.08em] uppercase text-smoke mb-0.5">
                  Email
                </div>
                {settings.contact_email && (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-[0.9375rem] text-ink hover:text-gold transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                )}
              </div>
            </div>

            {whatsapp && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 mb-6 hover:opacity-70 transition-opacity"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-ink rounded flex items-center justify-center text-gold">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-[0.08em] uppercase text-smoke mb-0.5">
                    WhatsApp
                  </div>
                  <div className="text-[0.9375rem] text-ink">{whatsappDisplay}</div>
                </div>
              </a>
            )}

            {settings.address && (
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-ink rounded flex items-center justify-center text-gold">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-[0.08em] uppercase text-smoke mb-0.5">
                    Endereço
                  </div>
                  <div className="text-[0.9375rem] text-ink">{settings.address}</div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-paper border border-border p-10 rounded-sm" data-reveal="right">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
