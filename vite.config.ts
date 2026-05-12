import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** Bumped every production build; compared to `version.json` on the server to prompt reload after deploy. */
const deployBuildId = String(Date.now());

// Check if som-ui exists as a sibling (for local dev)
const somUiLocalPath = resolve(__dirname, '../som-ui/src');
const hasLocalSomUi = fs.existsSync(somUiLocalPath);

export default defineConfig({
  define: {
    __DEPLOY_BUILD_ID__: JSON.stringify(deployBuildId),
  },
  plugins: [
    react(),
    {
      name: 'write-deploy-version',
      closeBundle() {
        const outFile = resolve(__dirname, 'dist', 'version.json');
        fs.writeFileSync(outFile, JSON.stringify({ buildId: deployBuildId }), 'utf8');
      },
    },
  ],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@som/ui': hasLocalSomUi ? somUiLocalPath : '@som/ui',
      // Deduplicate React to prevent Symbol mismatch
      'react': resolve(__dirname, './node_modules/react'),
      'react-dom': resolve(__dirname, './node_modules/react-dom'),
      // Deduplicate MUI & Emotion to ensure single ThemeProvider context
      '@mui/material': resolve(__dirname, './node_modules/@mui/material'),
      '@mui/icons-material': resolve(__dirname, './node_modules/@mui/icons-material'),
      '@emotion/react': resolve(__dirname, './node_modules/@emotion/react'),
      '@emotion/styled': resolve(__dirname, './node_modules/@emotion/styled'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    sourcemap: false,
    minify: true,
    cssMinify: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'jotai'],
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'mui-icons': ['@mui/icons-material'],
        },
      },
    },
  },
  server: {
    port: 5176,
    strictPort: true,
    host: '127.0.0.1',
    open: 'http://127.0.0.1:5176/',
  },
});
