import { nodeResolve } from "@rollup/plugin-node-resolve" // 处理文件路径
import commonjs from "@rollup/plugin-commonjs" // 将 CommonJS 模块转换为 ES6
import vue from "rollup-plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
// import json from '@rollup/plugin-json';
import typescript from "rollup-plugin-typescript2"

import { terser } from "rollup-plugin-terser"

import { parallel } from "gulp"
import path from "path"
import { outDir, luiRoot } from "./utils/path"
import { rollup, OutputOptions } from "rollup"
import { buildConfig } from "./utils/config"
import { pathRewriter, withTaskName } from "./utils"
import { externalFn, formatBundleFilename, writeBundles } from "./utils/rollup"

const buildFull = async (minify: boolean) => {
  // rollup 打包的配置信息
  const config = {
    input: path.resolve(luiRoot, "index.ts"), // 打包入口
    plugins: [nodeResolve(), commonjs(), typescript(), vue(), vueJsx()],
    external: externalFn(["vue"])
  }

  if (minify) config.plugins.push(terser())

  // esm umd
  const buildConfig: OutputOptions[] = [
    {
      format: "umd", // 打包的格式
      file: path.resolve(outDir, formatBundleFilename("index", minify, "js")),
      name: "lUi", // 全局变量名字
      exports: "named", // 导出的名字 用命名的方式导出 libaryTarget:"" name:""
      globals: {
        // 表示使用的vue是全局的
        vue: "Vue"
      },
      sourcemap: minify
    },
    {
      format: "esm",
      file: path.resolve(outDir, formatBundleFilename("index.esm", minify, "js")),
      sourcemap: minify
    }
  ]

  const bundle = await rollup(config)

  await writeBundles(bundle, buildConfig)
}

const buildEntry = async (minify: boolean) => {
  const config = {
    input: path.resolve(luiRoot, "index.ts"),
    plugins: [nodeResolve(), typescript(), vue(), vueJsx()],
    external: externalFn(["vue", "@l-ui"])
  }

  if (minify) config.plugins.push(terser())

  const bundle = await rollup(config)

  await writeBundles(
    bundle,
    Object.values(buildConfig).map((config) => ({
      format: config.format,
      file: path.resolve(config.output.path, formatBundleFilename("index", minify, "js")),
      paths: pathRewriter(config.output.name),
      sourcemap: minify
    })) as OutputOptions[]
  )
}

export const buildFullTask = (minify: boolean) => async () => Promise.all([buildFull(minify), buildEntry(minify)])

// gulp适合流程控制和代码的转义  没有打包的功能
export const buildFullComponent = parallel(
  withTaskName("buildFullMinified", buildFullTask(true)),
  withTaskName("buildFull", buildFullTask(false))
)
