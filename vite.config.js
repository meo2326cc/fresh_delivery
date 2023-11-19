import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy: {
      '/capi.php': 'https://tw.rter.info/' // 遠端伺服器的地址
    }
  },
})
