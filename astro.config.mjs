// @ts-check
import { defineConfig } from 'astro/config';

import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [keystatic()],
  adapter: vercel(),
  devToolbar: {
    enabled: false
  }
});
