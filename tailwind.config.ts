import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0A',
          soft: '#1A1A1A',
          mid: '#3A3A3A',
        },
        paper: {
          DEFAULT: '#FAFAF8',
          warm: '#F2F0EB',
        },
        gold: {
          DEFAULT: '#B84070',
          light: '#D05A8A',
          dark: '#8F3358',
        },
        smoke: '#6B6B6B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '1200px',
      },
      transitionTimingFunction: {
        'ease-out-soft': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
