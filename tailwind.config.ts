import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0d0b',
        card: '#121712',
        border: '#1f2e24',
        primary: '#22c55e',
        primaryDark: '#16a34a',
        lav: '#132419',
        muted: '#8fa89b',
      },
      boxShadow: {
        glow: '0 0 18px rgba(34,197,94,.28)',
      },
      borderRadius: {
        xl2: '16px',
      },
    },
  },
  plugins: [],
};
export default config;
