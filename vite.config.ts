import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  loadEnv(mode, process.cwd(), '');

  const isProduction = mode === 'production';

  return {
    base: isProduction ? '/' : '/',
    publicDir: 'public',
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
      },
      // Enable client-side routing in development
      historyApiFallback: true,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    define: {
      'process.env': process.env,
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  };
});