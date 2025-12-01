// @ts-check
import { defineConfig } from 'astro/config';

import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [keystatic()],
  devToolbar: {
    enabled: false
  }
});
