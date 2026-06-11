import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Linkedin } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

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

export async function Footer() {
  const settings = await getSettings();
  const year = new Date().getFullYear();

  const socials = [
    { key: 'social_instagram', icon: Instagram, label: 'Instagram' },
    { key: 'social_facebook', icon: Facebook, label: 'Facebook' },
    { key: 'social_youtube', icon: Youtube, label: 'YouTube' },
    { key: 'social_linkedin', icon: Linkedin, label: 'LinkedIn' },
  ].filter((s) => settings[s.key]);

  return (
    <footer className="bg-ink-soft text-paper/65">
      <div className="wrap">
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-border-inv">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center mb-5">
              <Image
                src="/images/logo.jpeg"
                alt="Unity Soccer"
                width={200}
                height={80}
                className="h-20 w-auto invert"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-[28ch]">
              {settings.site_description ||
                'Agência especializada em gestão de carreira de atletas de futebol. Representamos talentos com excelência, ética e visão estratégica.'}
            </p>
          </div>

          <div>
            <h5 className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-paper mb-5">
              Navegação
            </h5>
            <ul className="flex flex-col gap-3">
              {[
                ['A Empresa', '/#sobre'],
                ['Atletas', '/#atletas'],
                ['Galeria', '/#galeria'],
                ['Notícias', '/#noticias'],
                ['Contato', '/#contato'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-paper/60 hover:text-paper transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-paper mb-5">
              Serviços
            </h5>
            <ul className="flex flex-col gap-3">
              {['Gestão de Carreira', 'Consultoria Financeira', 'Marketing e Imagem', 'Assessoria Jurídica'].map(
                (s) => (
                  <li key={s}>
                    <Link
                      href="/#servicos"
                      className="text-sm text-paper/60 hover:text-paper transition-colors"
                    >
                      {s}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h5 className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-paper mb-5">
              Redes Sociais
            </h5>
            <div className="flex gap-2.5">
              {socials.map(({ key, icon: Icon, label }) => (
                <a
                  key={key}
                  href={settings[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-border-inv rounded flex items-center justify-center text-paper/40 hover:border-gold hover:text-gold hover:bg-gold/5 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="py-6 flex flex-wrap items-center justify-between gap-3 text-[0.8125rem]">
          <span>&copy; {year} Unity Soccer. Todos os direitos reservados.</span>
          {settings.contact_email && (
            <span>
              Gestão de carreira de alto nível |{' '}
              <a
                href={`mailto:${settings.contact_email}`}
                className="text-gold-light underline hover:text-gold"
              >
                {settings.contact_email}
              </a>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
