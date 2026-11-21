import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const canonical = 'https://cafecomletras.com.br';
if(process.env.CANONICAL_ORIGIN&&process.env.CANONICAL_ORIGIN!==canonical)throw new Error('O domínio canônico deve ser revisto conjuntamente com metadados e redirecionamentos.');
const url = new URL(canonical);
if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('CANONICAL_ORIGIN deve ser uma origem HTTPS.');
export default defineConfig({
  site: url.origin,
  output: 'static',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap({ filter: page => !new URL(page).pathname.startsWith('/m/') && !page.includes('/indisponivel/') && !page.includes('/celular/') && !page.includes('/evento/') })],
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4321 },
});
