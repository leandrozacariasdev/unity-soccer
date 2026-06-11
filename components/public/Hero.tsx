'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!bgRef.current) return;
      const y = window.scrollY;
      bgRef.current.style.transform = `translateY(${y * 0.4}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      className="relative h-[100dvh] bg-black overflow-hidden flex md:items-center"
      aria-label="Início"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-no-repeat md:bg-cover hero-bg-mobile"
        style={{
          backgroundImage: "url('/images/player_3.jpg')",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hero-overlay-mobile"
      />
      <div className="relative z-10 wrap w-full pt-28 md:pt-28 flex flex-col justify-end md:justify-center h-full md:h-auto pb-5 md:pb-0">

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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex justify-center pointer-events-none hidden md:block" aria-hidden>
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
