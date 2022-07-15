import { createApp } from "vue"
import App from "./app.vue"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

import LUi from "l-ui"
import "@l-ui/theme-chalk/src/index.scss"

// import LUi from "../dist/index.esm.js"
// import "../dist/theme-chalk/css/index.css"

const app = createApp(App)
app.use(ElementPlus).use(LUi)
app.mount("#app")
