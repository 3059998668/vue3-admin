import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/main.scss' // 先装scss预处理器在导入
import pinia from '@/stores/index' // pinia 独立维护

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
