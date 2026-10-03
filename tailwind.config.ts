import type { Config } from 'tailwindcss';
export default { content: ['./src/**/*.{ts,tsx}'], theme: { extend: {
  colors: { ink: '#0a0a0a', volt: '#1f6bff', chalk: '#f6f7f9' },
  fontFamily: { display: ['var(--font-display)', 'Impact', 'sans-serif'], body: ['var(--font-body)', 'system-ui', 'sans-serif'] } } }, plugins: [] } satisfies Config;
