import { createApp } from 'vue'
import App from './App.vue'
import ScrollTrigger from './components/ScrollTrigger.vue'

const app = createApp(App)
app.component('ScrollTrigger', ScrollTrigger)
app.mount('#app')
