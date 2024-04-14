import './assets/main.css'

import { createManager } from '@vue-youtube/core'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App).use(createManager())

app.use(router)

app.mount('#app')
