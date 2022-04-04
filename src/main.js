import { createApp } from 'vue'
import App from './App.vue'
import ScrollTrigger from './components/ScrollTrigger.vue'
import SmoothScroll from './components/SmoothScroll.vue'
import SmoothEffect from './directives/SmoothEffect'

const app = createApp(App)
app.component('ScrollTrigger', ScrollTrigger)
app.component('SmoothScroll', SmoothScroll)
app.directive('SmoothEffect', SmoothEffect)
app.mount('#app')
