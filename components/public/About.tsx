import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function About() {
  return (
    <section className="section bg-paper" id="sobre" aria-labelledby="about-title">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <p className="section-label" data-reveal>Quem Somos</p>
            <h2 id="about-title" className="section-title" data-reveal data-delay="1">
              Unity Soccer
              <br />
              <span className="text-gold" style={{ fontSize: '80%' }}>
                Gestão de Alto Rendimento
              </span>
            </h2>
            <p className="text-ink-mid text-[1.0625rem] mb-4" data-reveal data-delay="2">
              Há mais de 10 anos no mercado, a Unity Soccer é referência em gestão de carreiras
              de atletas de futebol. Representamos jogadores em todas as fases da carreira, de
              jovens promessas a atletas consagrados no cenário nacional e internacional.
            </p>
            <p className="text-ink-mid text-[1.0625rem] mb-8" data-reveal data-delay="3">
              Nossa equipe é composta por agentes licenciados pela FIFA, advogados
              especializados em direito desportivo, consultores financeiros e profissionais de
              marketing, garantindo suporte integral para cada atleta.
            </p>
            <Link href="/#contato" className="btn btn-ink" data-reveal data-delay="4">
              Entre em Contato
              <ArrowRight size={16} />
            </Link>

            <div
              className="grid grid-cols-1 sm:grid-cols-3 mt-12 border-t border-l border-border"
              data-reveal
              data-delay="5"
            >
              {[
                { n: '50', s: '+', l: 'Atletas Representados' },
                { n: '10', s: '+', l: 'Anos de Mercado' },
                { n: '15', s: '', l: 'Países com Presença' },
              ].map((stat) => (
                <div
                  key={stat.l}
                  className="p-5 sm:p-7 border-r border-b border-border"
                >
                  <div className="font-display text-[2.5rem] sm:text-[3.5rem] leading-none tracking-[0.02em] text-ink">
                    {stat.n}
                    <sup className="text-lg sm:text-xl">{stat.s}</sup>
                  </div>
                  <div className="text-[0.75rem] sm:text-[0.8125rem] text-smoke tracking-[0.04em] uppercase mt-1.5">
                    {stat.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative bg-ink rounded-sm overflow-hidden aspect-[4/5] hidden lg:flex items-center justify-center p-4"
            data-reveal="right"
            aria-hidden
          >
            <svg
              className="w-full max-w-[280px]"
              viewBox="0 0 420 520"
              fill="none"
              stroke="#D05A8A"
              strokeWidth="4"
              style={{ filter: 'drop-shadow(0 0 8px rgba(208,90,138,0.4))' }}
            >
              <rect x="10" y="10" width="400" height="500" rx="2" />
              <line x1="10" y1="260" x2="410" y2="260" />
              <circle cx="210" cy="260" r="50" />
              <circle cx="210" cy="260" r="4" fill="#D05A8A" />
              <rect x="130" y="10" width="160" height="80" />
              <rect x="130" y="430" width="160" height="80" />
              <rect x="170" y="10" width="80" height="40" />
              <rect x="170" y="470" width="80" height="40" />
              <path d="M 10 35 A 25 25 0 0 0 35 10" />
              <path d="M 410 35 A 25 25 0 0 1 385 10" />
              <path d="M 10 485 A 25 25 0 0 1 35 510" />
              <path d="M 410 485 A 25 25 0 0 0 385 510" />
            </svg>
            <div className="absolute bottom-8 left-8 right-8 font-display text-base tracking-[0.1em] uppercase text-paper/55">
              Excelência · Ética · Visão
            </div>
            <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
