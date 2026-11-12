import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://talk.bh',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
  build: { format: 'directory' },
});
