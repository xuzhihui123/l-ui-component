import { series } from "gulp";
import chalk from 'chalk'
import consola from 'consola'
import { run } from "./utils";
import {luiRoot,outDir} from './utils/path'
import { resolve } from 'path'
import fs from 'fs'

import pkgJson from 'l-ui/package.json'



// 升级版本version 写入pkg
async function writePkgJSon() {
   consola.success(
      chalk.yellow(`组件库发布中。。。。`)
   )
   let versionArr = pkgJson.version.split('.')
   versionArr.splice(2,1,String(Number(versionArr[2])+1))
   pkgJson.version = versionArr.join('.')
   let resultPkgStr = JSON.stringify(pkgJson)
   fs.writeFileSync(resolve(luiRoot,'package.json'),resultPkgStr)
   pkgJson.main = 'lib/index.js'
   pkgJson['module']="es/index.js"
   fs.writeFileSync(resolve(outDir,'package.json'),JSON.stringify(pkgJson))
   consola.success(
      chalk.yellow(`组件库发布完成。。。。`)
   )
}




export const publishComponent = series(
   writePkgJSon
)