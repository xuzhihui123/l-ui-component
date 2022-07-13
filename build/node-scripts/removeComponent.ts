/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs")
const consola = require("consola")
const chalk = require("chalk")
const path = require("path")

const { comRoot } = require("./util.ts")
const { comRootIndex } = require("./util.ts")
const { run } = require("./util.ts")
const { rmDirDepSync } = require("./util.ts")

const comDirName = process.argv[2]

async function removeComDir() {
  if (!comDirName) return consola.error(`${chalk.red("请输入目录名参数！")}`)
  const comDir = path.join(comRoot, `${comDirName}`)
  if (!fs.existsSync(comDir)) return consola.error(`${chalk.red("组件目录不存在！")}`)
  consola.success(`${chalk.yellow("组件目录删除中.....")}`)
  rmDirDepSync(comDir)
  const comRootIndexContent = fs.readFileSync(comRootIndex, "utf-8").split(/\n/)
  let spliceIndex
  if ((spliceIndex = comRootIndexContent.findIndex((i) => i.includes(comDirName)))) {
    comRootIndexContent.splice(spliceIndex, 1)
  }
  fs.writeFileSync(comRootIndex, comRootIndexContent.join("\n"), "utf-8")
  consola.success(`${chalk.yellow("组件目录删除完成！！！")}`)
  consola.success(`${chalk.yellow("组件目录eslint格式化中...")}`)
  await run("eslint  ./packages/components --fix --ext .ts,.tsx,.vue,.js,.jsx")
  consola.success(`${chalk.yellow("组件目录eslint格式化完成...")}`)
}

removeComDir()
