import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/assets/main.scss' // 先装scss预处理器在导入

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
