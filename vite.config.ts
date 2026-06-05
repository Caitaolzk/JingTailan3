import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@cloudbase/js-sdk': path.resolve(__dirname, 'node_modules/@cloudbase/js-sdk/dist/index.esm.js'),
      },
      mainFields: ['module', 'main'],
    },
    optimizeDeps: {
      include: [
        '@cloudbase/js-sdk',
        '@cloudbase/app',
        '@cloudbase/auth',
        '@cloudbase/database',
        '@cloudbase/functions',
        '@cloudbase/storage',
        '@cloudbase/realtime',
        '@cloudbase/analytics',
        '@cloudbase/model',
        '@cloudbase/ai',
        '@cloudbase/cloudrun',
        '@cloudbase/mysql',
        '@cloudbase/apis',
        '@cloudbase/utilities',
        '@cloudbase/adapter-interface',
        '@cloudbase/types'
      ],
      esbuildOptions: {
        target: 'es2020',
      },
    },
    build: {
      target: 'es2020',
      commonjsOptions: {
        transformMixedEsModules: true,
        include: [/node_modules/],
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
