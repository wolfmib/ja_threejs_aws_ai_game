import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',  // Accessible from outside
    port: 8888,
    cors: true,
  },
});
