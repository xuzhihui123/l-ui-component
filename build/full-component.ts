import { target } from "./utils/build-info"
import { nodeResolve } from "@rollup/plugin-node-resolve" // 处理文件路径
import commonjs from "@rollup/plugin-commonjs" // 将 CommonJS 模块转换为 ES6
// import vue from "rollup-plugin-vue" // 处理vue文件
import vue from "@vitejs/plugin-vue"

import vueJsx from "@vitejs/plugin-vue-jsx" // 处理jsx
import esbuild, { minify as minifyPlugin } from "rollup-plugin-esbuild" // esbuild替代rollup-plugin-typescript2来打包ts,轻量快速
import json from "@rollup/plugin-json" // 处理json
import { parallel } from "gulp"
import path from "path"
import { outDir, luiRoot } from "./utils/path"
import { rollup, OutputOptions } from "rollup"
import { buildConfig } from "./utils/config"
import { pathRewriter, withTaskName } from "./utils"
import { externalFn, formatBundleFilename, writeBundles } from "./utils/rollup"

const buildFull = async (minify: boolean) => {
  const config = {
    input: path.resolve(luiRoot, "index.ts"), // 打包入口
    plugins: [
      nodeResolve({
        // 必须配置extensions不然esbuild无法检测内部monorepo引入的文件
        extensions: [".mjs", ".js", ".json", ".ts"]
      }),
      commonjs(),
      vue({
        isProduction: false
      }),
      vueJsx(),
      json(),
      esbuild({
        sourceMap: minify,
        target
      })
    ],
    external: externalFn(["vue"])
  }

  if (minify) config.plugins.push(minifyPlugin({ sourceMap: true }))

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
    plugins: [
      nodeResolve({
        extensions: [".mjs", ".js", ".json", ".ts"]
      }),
      vue({
        isProduction: false
      }),
      vueJsx(),
      json(),
      esbuild({
        sourceMap: minify,
        target
      })
    ],
    external: externalFn(["vue", "@l-ui"])
  }

  if (minify) config.plugins.push(minifyPlugin({ sourceMap: true }))

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
