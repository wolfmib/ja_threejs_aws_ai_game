import { defineConfig } from 'vite';


// Develop
// Run: npx vite --port 8889

/*
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Accessible from outside
    port: 8889,        // Change port to 8889
    cors: true,
    https: false,      // Use HTTP for development
  },
});
*/



/* Production
*/
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Accessible from outside
    port: 8888,
    cors: true,
  },
});

/// */
