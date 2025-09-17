import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Plugin to start backend server
function backendServer() {
  let server;
  
  return {
    name: 'backend-server',
    configureServer() {
      // Start the backend server
      server = spawn('nodemon', ['src/server.js'], {
        stdio: 'inherit',
        shell: true
      });
      
      server.on('error', (err) => {
        console.error('Backend server error:', err);
      });
    },
    buildEnd() {
      if (server) {
        server.kill();
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' && backendServer(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
