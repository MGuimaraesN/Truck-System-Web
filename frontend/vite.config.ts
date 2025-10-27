import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necessário para expor o servidor dentro do Docker
    port: 4200, // A porta que definimos
    watch: {
      usePolling: true // Essencial para o hot-reload funcionar via Docker
    },

    // CORREÇÃO HMR: Informa o cliente como se conectar ao websocket
    hmr: {
      clientPort: 4200,
    },

    proxy: {
      // Redireciona qualquer chamada /api para o nosso serviço de backend
      '/api': {
        target: 'http://api-node:5200', // Aponta para o NOME DO SERVIÇO Docker
        changeOrigin: true,

        // CORREÇÃO 404: A linha 'rewrite' foi REMOVIDA.
        // O backend espera o caminho completo /api/auth/login
      }
    }
  },
})
