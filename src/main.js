import './assets/main.css'

import { createManager } from '@vue-youtube/core'
import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './plugins/fontawesome'

import App from './App.vue'
import router from './router'

const app = createApp(App).use(createManager())

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

app.mount('#app')
