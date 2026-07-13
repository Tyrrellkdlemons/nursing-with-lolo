import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    // VM threads are stable on Windows while keeping the suite isolated from
    // the browser-preview and document-generation processes used during QA.
    pool: 'vmThreads',
    maxWorkers: 1,
    fileParallelism: false,
  },
});
