import { series } from "gulp"
import chalk from "chalk"
import consola from "consola"
import { luiRoot, outDir } from "./utils/path"
import { resolve } from "path"
import fs from "fs"

import pkgJson from "l-ui/package.json"

function getVsersion(versionArr) {
  let major, minor, patch
  if (versionArr[2] >= 99) {
    patch = 0
    minor = versionArr[1] + 1
    major = versionArr[0]
  } else {
    patch = versionArr[2] + 1
    minor = versionArr[1]
    major = versionArr[0]
  }
  if (versionArr[1] >= 99) {
    patch = 0
    minor = 0
    major = versionArr[0] + 1
  }
  return `${major}.${minor}.${patch}`
}

// 升级版本version 写入pkg
async function writePkgJSon() {
  consola.success(chalk.yellow(`组件库打包完成！！！`))
  consola.success(chalk.yellow(`组件库版本写入...`))
  const versionArr = pkgJson.version.split(".").map((i) => Number(i))
  pkgJson.version = getVsersion(versionArr)
  const resultPkgStr = JSON.stringify(pkgJson)
  fs.writeFileSync(resolve(luiRoot, "package.json"), resultPkgStr)
  pkgJson.main = "lib/index.js"
  pkgJson["module"] = "es/index.js"
  fs.writeFileSync(resolve(outDir, "package.json"), JSON.stringify(pkgJson))
  consola.success(chalk.yellow(`组件库版本写入完成...`))
}

export const publishComponent = series(writePkgJSon)
