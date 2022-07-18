/**
 *
 */
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
// import json from '@rollup/plugin-json';
import { target } from "./utils/build-info"

// import vue from "rollup-plugin-vue"
import vue from "@vitejs/plugin-vue"

import vueJsx from "@vitejs/plugin-vue-jsx"
import json from "@rollup/plugin-json" // 处理json

import esbuild from "rollup-plugin-esbuild" // esbuild替代rollup-plugin-typescript2来打包ts,轻量快速

import { series, parallel, src, dest } from "gulp"
import { sync } from "fast-glob" // 同步查找文件
import { compRoot, outDir, projRoot } from "./utils/path"
import path from "path"
import { rollup, OutputOptions } from "rollup"
import { buildConfig } from "./utils/config"
import { pathRewriter } from "./utils"
import { Project, SourceFile } from "ts-morph"
import glob from "fast-glob"
import * as VueCompiler from "@vue/compiler-sfc"
import fs from "fs/promises"
import { externalFn, writeBundles } from "./utils/rollup"

const buildEachComponent = async () => {
  // 打包每个组件
  // 查找components下所有的组件目录 ["icon"]
  const files = sync("*", {
    cwd: compRoot,
    onlyDirectories: true // 只查找文件夹
  })

  // 分别把components文件夹下的组件，放到dist/es/components下 和 dist/lib/components
  const builds = files.map(async (file: string) => {
    // 找到每个组件的入口文件 index.ts
    const input = path.resolve(compRoot, file, "index.ts")
    const config = {
      input,
      plugins: [
        nodeResolve(),
        commonjs(),
        vue({
          isProduction: false
        }),
        vueJsx(),
        json(),
        esbuild({
          target
        })
      ],
      external: externalFn(["vue", "@l-ui"])
    }
    const bundle = await rollup(config)
    const options = Object.values(buildConfig).map((config) => ({
      format: config.format,
      file: path.resolve(config.output.path, `components/${file}/index.js`),
      paths: pathRewriter(config.output.name), // @l-ui => l-ui/es l-ui/lib  处理路径
      exports: config.format === "cjs" ? "named" : undefined,
      sourcemap: true
    }))

    await writeBundles(bundle, options as OutputOptions[])
  })

  return Promise.all(builds)
}

async function genTypes() {
  const project = new Project({
    // 生成.d.ts 我们需要有一个tsconfig
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: true,
      outDir: path.resolve(outDir, "types"),
      baseUrl: projRoot,
      paths: {
        "@l-ui/*": ["packages/*"]
      },
      skipLibCheck: true,
      strict: false
    },
    tsConfigFilePath: path.resolve(projRoot, "tsconfig.json"),
    skipAddingFilesFromTsConfig: true
  })

  const filePaths = await glob("**/*", {
    // ** 任意目录  * 任意文件
    cwd: compRoot,
    onlyFiles: true,
    absolute: true
  })

  const sourceFiles: SourceFile[] = []

  await Promise.all(
    filePaths.map(async function (file) {
      if (file.endsWith(".vue")) {
        const content = await fs.readFile(file, "utf8")
        const sfc = VueCompiler.parse(content)
        const { script } = sfc.descriptor
        if (script) {
          const content = script.content // 拿到脚本  icon.vue.ts  => icon.vue.d.ts
          const sourceFile = project.createSourceFile(file + ".ts", content)
          sourceFiles.push(sourceFile)
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file) // 把所有的ts文件都放在一起 发射成.d.ts文件
        sourceFiles.push(sourceFile)
      }
    })
  )
  await project.emit({
    // 默认是放到内存中的
    emitOnlyDtsFiles: true
  })

  const tasks = sourceFiles.map(async (sourceFile: any) => {
    const emitOutput = sourceFile.getEmitOutput()
    const tasks = emitOutput.getOutputFiles().map(async (outputFile: any) => {
      const filepath = outputFile.getFilePath()
      await fs.mkdir(path.dirname(filepath), {
        recursive: true
      })
      await fs.writeFile(filepath, pathRewriter("es")(outputFile.getText()))
    })
    await Promise.all(tasks)
  })

  await Promise.all(tasks)
}

function copyTypes() {
  const copy = (module) => async () => {
    const output = path.resolve(outDir, module, "components")
    return src(path.resolve(outDir, "types/components/**")).pipe(dest(output))
  }
  return parallel(copy("es"), copy("lib"))
}

async function buildComponentEntry() {
  const config = {
    input: path.resolve(compRoot, "index.ts"),
    plugins: [
      esbuild({
        target
      })
    ],
    external: () => true
  }
  const bundle = await rollup(config)
  return writeBundles(
    bundle,
    Object.values(buildConfig).map((config) => ({
      format: config.format,
      file: path.resolve(config.output.path, "components/index.js"),
      sourcemap: true
    })) as OutputOptions[]
  )
}

export const buildComponent = series(buildEachComponent, buildComponentEntry, genTypes, copyTypes())
