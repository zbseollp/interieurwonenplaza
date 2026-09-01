// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeRepairMediaUrls from './src/lib/rehype-repair-media-urls.mjs';

export default defineConfig({
  site: 'https://interieurwonenplaza.nl',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [mdx()],
  // Rewrites /media/... and bare-R2 <img> sources in post bodies to the
  // tenant's public R2 URL.
  markdown: { rehypePlugins: [rehypeRepairMediaUrls] },
  vite: { envPrefix: ['PUBLIC_', 'R2_', 'TENANT', 'PAYLOAD_'] },
});
