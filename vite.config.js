import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/fresh_delivery/',
  plugins: [react()],
  // server:{
  //   proxy: {
  //     '/capi.php': 'https://tw.rter.info/' // 遠端伺服器的地址
  //   }
  // },
})
