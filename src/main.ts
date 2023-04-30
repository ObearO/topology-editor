import { createApp } from 'vue'
import { store } from '@/stores'
import router from './router'
import App from './App.vue'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

import './assets/main.css'

const app = createApp(App)

app.use(store)

app.use(router)

app.mount('#app')
