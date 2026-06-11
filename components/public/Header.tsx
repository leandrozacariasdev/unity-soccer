'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '/#sobre', label: 'A Empresa' },
  { href: '/#atletas', label: 'Atletas' },
  { href: '/#galeria', label: 'Galeria' },
  { href: '/#noticias', label: 'Notícias' },
  { href: '/#servicos', label: 'Serviços' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-ink/80 backdrop-blur-md hidden md:block"
    >
      <div className="wrap flex items-center justify-between h-28">
        <Link href="/" aria-label="Unity Soccer" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2.5 text-[0.8125rem] font-medium tracking-[0.08em] uppercase text-paper/60 hover:text-paper hover:bg-paper/5 rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contato"
            className="ml-3 px-5 py-2.5 bg-gold text-paper rounded-md text-[0.8125rem] font-semibold tracking-[0.06em] uppercase hover:bg-gold-light transition-colors"
          >
            Contato
          </Link>
        </nav>

        <button
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="hidden p-2 text-paper"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && pathname === '/' && (
        <nav className="md:hidden bg-ink">
          <ul className="flex flex-col py-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 text-paper/70 hover:text-paper hover:bg-paper/5 transition-colors text-sm tracking-[0.08em] uppercase"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contato"
                onClick={() => setOpen(false)}
                className="block mx-6 my-3 px-5 py-3 bg-gold text-paper text-center rounded-md text-sm font-semibold tracking-[0.06em] uppercase"
              >
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function Logo() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function position() {
      if (!ref.current) return;
      const logo = ref.current.querySelector<HTMLImageElement>('img[data-logo]');
      const ball = ref.current.querySelector<HTMLImageElement>('img[data-ball]');
      if (!logo || !ball) return;
      if (!logo.complete) {
        logo.addEventListener('load', position, { once: true });
        return;
      }
      const logoW = logo.offsetWidth;
      const logoH = logo.offsetHeight;
      if (!logoW || !logoH) return;
      const ballSize = 59;
      ball.style.width = `${ballSize}px`;
      ball.style.height = `${Math.round((ballSize * 77) / 128)}px`;
      const ballH = ball.offsetHeight || Math.round((ballSize * 77) / 128);
      ball.style.left = `${(logoW - ballSize) / 2 - 5}px`;
      ball.style.top = `${logoH * 0.3 - ballH / 2 + 8}px`;
      setReady(true);
    }
    position();
    window.addEventListener('resize', position);
    return () => window.removeEventListener('resize', position);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <img
        data-logo
        src="/images/unity-soccer-white.png"
        alt="Unity Soccer"
        width={200}
        height={80}
        priority
        className="h-20 w-auto"
        style={{ opacity: ready ? 1 : 0 }}
      />
      <img
        data-ball
        src="/images/rotate.gif"
        alt=""
        width={59}
        height={36}
        priority
        className="absolute pointer-events-none"
        style={{ width: 59, height: 36, left: 0, top: 0, opacity: ready ? 1 : 0 }}
      />
    </div>
  );
}
