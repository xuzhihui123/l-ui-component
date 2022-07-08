import { createApp } from "vue"
import App from './app.vue'
import lUi from "l-ui";
import "@l-ui/theme-chalk/src/index.scss"


const app = createApp(App);
app.use(lUi)
app.mount('#app')