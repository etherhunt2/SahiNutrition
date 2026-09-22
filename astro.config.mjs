// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@styles': path.resolve(__dirname, './src/styles'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [path.resolve(__dirname, './src/styles')],
          additionalData: (content, filename) => {
            const normalized = filename.replace(/\\/g, '/');
            if (
              normalized.includes('styles/_variables') ||
              normalized.includes('styles/_mixins') ||
              normalized.includes('styles/_reset') ||
              normalized.includes('styles/sections/_react-components') ||
              normalized.includes('styles/global')
            ) {
              return content;
            }
            return `@use "variables" as *;\n@use "mixins" as *;\n` + content;
          },
        },
      },
    },
  },
});


