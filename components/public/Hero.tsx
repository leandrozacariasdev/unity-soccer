import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section
      className="relative h-[100dvh] bg-black overflow-hidden flex items-center"
      aria-label="Início"
    >
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: "url('/images/player_3.jpg')",
          backgroundPosition: 'right -100px top',
          backgroundSize: 'auto 140%',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative z-10 wrap w-full pt-28">
        <p className="section-label" data-reveal style={{ color: 'var(--gold)' }}>
          Agência de Gestão de Atletas
        </p>
        <h1
          className="font-display uppercase text-paper mb-10 max-w-[14ch] leading-[0.93] tracking-[0.02em]"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }}
          data-reveal
          data-delay="1"
        >
          <span style={{ color: 'var(--gold-light)' }}>Eleve</span>{' '}
          <span className="block">Sua Carreira.</span>
        </h1>
        <div className="max-w-[52ch]">
          <p
            className="text-[1.0625rem] leading-[1.75]"
            style={{ color: 'rgba(250,250,248,0.5)' }}
            data-reveal
            data-delay="2"
          >
            Gestão de carreira com visão estratégica, planejamento financeiro e marketing de alto
            nível dentro e fora dos gramados.
          </p>
          <div
            className="flex flex-wrap gap-3 mt-10"
            data-reveal
            data-delay="3"
          >
            <Link href="/#contato" className="btn btn-gold">
              <Mail size={16} />
              Fale Conosco
            </Link>
            <Link href="/atletas" className="btn btn-ghost">
              Ver Atletas
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 inset-x-0 z-10 flex justify-center pointer-events-none" aria-hidden>
        <div className="w-[26px] h-10 border-2 border-paper/30 rounded-[14px] relative">
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 rounded-sm"
            style={{ background: 'var(--gold)', animation: 'scrollWheel 1.8s ease-in-out infinite' }}
          />
        </div>
      </div>
      <style>{`
        @keyframes scrollWheel {
          0% { transform: translateX(-50%) translateY(0); opacity: 1; }
          100% { transform: translateX(-50%) translateY(14px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
