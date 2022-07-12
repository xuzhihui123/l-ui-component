/**
 * 安装依赖 pnpm install rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-typescript2 rollup-plugin-vue -D -w
 */
import { nodeResolve } from "@rollup/plugin-node-resolve" // 处理文件路径
import commonjs from "@rollup/plugin-commonjs" // 将 CommonJS 模块转换为 ES6
import vue from "rollup-plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
// import { terser } from "rollup-plugin-terser"; // 暂时不用压缩


import typescript from "rollup-plugin-typescript2"
import { parallel } from "gulp"
import path from "path"
import { outDir, luiRoot } from "./utils/path"
import { rollup, OutputOptions } from "rollup"
import fs from "fs/promises"
import { buildConfig } from "./utils/config"
import { pathRewriter } from "./utils"
import { externalFn } from "./utils/rollup"

const buildFull = async () => {
  // rollup 打包的配置信息
  const config = {
    input: path.resolve(luiRoot, "index.ts"), // 打包入口
    plugins: [nodeResolve(), typescript(), commonjs(),vue(), vueJsx()],
    external: externalFn(['vue','lodash'])
  }

  // esm umd
  const buildConfig = [
    {
      format: "umd", // 打包的格式
      file: path.resolve(outDir, "index.js"),
      name: "lUi", // 全局变量名字
      exports: "named", // 导出的名字 用命名的方式导出 libaryTarget:"" name:""
      globals: {
        // 表示使用的vue是全局的
        vue: "Vue"
      },
      sourcemap: true
    },
    {
      format: "esm",
      file: path.resolve(outDir, "index.esm.js"),
      sourcemap: true
    }
  ]

  const bundle = await rollup(config)

  return Promise.all(
    buildConfig.map((option) => {
      bundle.write(option as OutputOptions)
    })
  )
}

async function buildEntry() {
  // 读取l-ui目录下的所有内容，包括目录和文件
  const entryFiles = await fs.readdir(luiRoot, { withFileTypes: true })

  // 过滤掉 不是文件的内容和package.json文件  index.ts 作为打包入口
  const entryPoints = entryFiles
    .filter((f) => f.isFile())
    .filter((f) => !["package.json"].includes(f.name))
    .map((f) => path.resolve(luiRoot, f.name))

  const config = {
    input: entryPoints,
    plugins: [nodeResolve(), typescript(),vue(), vueJsx()],
    external: externalFn(['vue','@l-ui','lodash'])
  }
  const bundle = await rollup(config)
  return Promise.all(
    Object.values(buildConfig)
      .map((config) => ({
        format: config.format,
        dir: config.output.path,
        paths: pathRewriter(config.output.name),
        sourcemap: true
      }))
      .map((option) => bundle.write(option as OutputOptions))
  )
}

// gulp适合流程控制和代码的转义  没有打包的功能
export const buildFullComponent = parallel(buildFull, buildEntry)
