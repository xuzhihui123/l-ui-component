import { createApp } from "vue"
import App from './app.vue'
// import lUi from "l-ui";
// import "@l-ui/theme-chalk/src/index.scss"
import lUi from '../dist/index.esm.js'
import '../dist/theme-chalk/css/index.css'

const app = createApp(App);
app.use(lUi)
app.mount('#app')