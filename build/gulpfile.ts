// 打包方式：串行(series)  并行(parallel)
import { series, parallel } from "gulp"
import { withTaskName, run } from "./utils"

// gulp 不叫打包，做代码转化 vite
/**
 * 1. 打包样式
 * 2. 打包工具方法
 * 3. 打包所有组件
 * 4. 打包每个组件
 * 5. 生成一个组件库
 * 6. 发布组件
 */
export default series(
  withTaskName("clean", async () => run("pnpm run clean")), // 删除dist目录
  parallel(
    withTaskName(
      "buildUtils",
      () => run("pnpm run -C ./packages/utils build") // 打包utils
    ),
    withTaskName(
      "buildThemeChalk",
      () => run("pnpm run -C ./packages/theme-chalk build") // 打包css
    ), // 并行执行packages目录下的build脚本
    withTaskName(
      "buildFullComponent",
      () => run("pnpm run build buildFullComponent") // 打包完整的组件
    ), // 执行build命令时会调用rollup，给rollup传参数buildFullComponent，那么就会执行导出任务叫buildFullComponent
    withTaskName("buildComponent", () => run("pnpm run build buildComponent")),
    withTaskName("genTypes", () => run("pnpm run build genTypes"))
  ),
  withTaskName("publishComponent", () => run(`pnpm run build publishComponent`)) // 打包发布 升级版本
)

// 任务执行器 gulp 任务名 就会执行对应的任务
export * from "./full-component"
export * from "./component"
export * from "./publishComponent"
export * from "./gen-types"
