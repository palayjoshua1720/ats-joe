import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useThemeStore } from '@/stores/theme'
import { registerServiceWorker } from './utils/serviceWorker'
import './assets/main.css'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Vue3Toastify, { autoClose: 3000 })

// Initialize theme before mounting
const themeStore = useThemeStore()
themeStore.initializeTheme()

app.mount('#app')

// Only register service worker in production
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker()
} 