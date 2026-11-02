import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { devApi } from './tools/dev-api.mjs';

export default defineConfig({
  plugins: [react(), devApi()],
});
