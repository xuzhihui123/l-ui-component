// vitepress-theme-demoblock是vitepress的一个主题插件，可以去github查看
// 组件注册就和我们平时开发vue项目一样
import theme from 'vitepress/dist/client/theme-default'
import 'vitepress-theme-demoblock/theme/styles/index.css'
// Demo组件和DemoBlock是两个vue组件，等会我们要在md文件中使用他来展示组件
import Demo from "vitepress-theme-demoblock/components/Demo.vue";
import DemoBlock from "vitepress-theme-demoblock/components/DemoBlock.vue";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// import LUi from "l-ui"
// import "@l-ui/theme-chalk/src/index.scss"

// 打包后引入 我们的组件并且注册
import LUi from "../../../dist/index.esm.js"
import "../../../dist/theme-chalk/css/index.css"

export default {
  ...theme,
  enhanceApp({ app }) {
    app.use(ElementPlus).use(LUi)
    app.component("Demo", Demo);
    app.component("DemoBlock", DemoBlock);
  }
}
