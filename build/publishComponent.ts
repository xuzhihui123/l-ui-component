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
  if(process.env.IS_PUBLISH){
   consola.success(
      chalk.yellow(`组件库发布中。。。。`)
   )
   let versionArr = pkgJson.version.split('.')
   versionArr.splice(2,1,String(Number(versionArr[2])+1))
   pkgJson.version = versionArr.join('.')
   let resultPkgStr = JSON.stringify(pkgJson)
   fs.writeFileSync(resolve(luiRoot,'package.json'),resultPkgStr)
   consola.success(
      chalk.yellow(`组件库发布完成。。。。`)
   )
  }
  await run(`cp ${luiRoot}/package.json ${outDir}/package.json`);
}




export const publishComponent = series(
   writePkgJSon
)