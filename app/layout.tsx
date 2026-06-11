import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Unity Soccer | Agência de Gestão de Atletas',
    template: '%s | Unity Soccer',
  },
  description:
    'Unity Soccer é a agência de referência em gestão de carreira de atletas de futebol. Representação, direito desportivo, consultoria financeira e marketing de alto nível.',
  keywords: [
    'agência de atletas',
    'gestão de carreira',
    'agente FIFA',
    'direito desportivo',
    'futebol',
    'transferência de jogadores',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Unity Soccer',
    title: 'Unity Soccer | Agência de Gestão de Atletas',
    description:
      'Gestão de carreira de atletas de futebol com excelência, ética e visão estratégica.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unity Soccer | Agência de Gestão de Atletas',
    description:
      'Gestão de carreira de atletas de futebol com excelência, ética e visão estratégica.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/ico.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
