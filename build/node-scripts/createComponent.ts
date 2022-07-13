/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const consola = require("consola")
const chalk = require("chalk")
const fs = require("fs")

const comDirName = process.argv[2]

const { comRoot } = require("./util.ts")
const { comRootIndex } = require("./util.ts")
const { run } = require("./util.ts")

function createComIndexContent(name) {
  return `
    import { withInstall } from "@l-ui/utils/with-install"
    import Com from "./src/${name}.vue";

    const ${getComName(name)} = withInstall("${getComName(name)}",Com);

    export{
      ${getComName(name)}
    }
    export default ${getComName(name)};
    `
}

function createComTemplate(name) {
  return `
  <template>
        <div></div>
  </template>
  
  <script lang="ts">
  import {defineComponent } from "vue";
  export default defineComponent({
    name: "${name}"
  });
  </script>
  `
}

function getComName(name) {
  let result = "L"
  for (let i = 0; i < name.length; i++) {
    if (i === 0) {
      result += name[i].toUpperCase()
    } else {
      result += name[i]
    }
  }
  return result
}

async function createComDir() {
  if (!comDirName) return consola.error(`${chalk.red("请输入目录名参数！")}`)
  const comDir = path.join(comRoot, `${comDirName}`)
  if (fs.existsSync(comDir)) return consola.error(`${chalk.red("组件目录已经存在！")}`)
  consola.success(`${chalk.yellow("创建组件目录中.....")}`)
  fs.mkdirSync(comDir)
  fs.mkdirSync(path.resolve(comDir, "src"))
  fs.writeFileSync(path.resolve(comDir, "src", `${comDirName}.vue`), createComTemplate(getComName(comDirName)), "utf-8")
  fs.writeFileSync(path.resolve(comDir, "index.ts"), createComIndexContent(comDirName), "utf-8")
  fs.writeFileSync(comRootIndex, `\nexport * from './${comDirName}'`, { flag: "a" })
  consola.success(`${chalk.yellow("创建组件目录完成！！！")}`)
  consola.success(`${chalk.yellow("组件目录eslint格式化中...")}`)
  await run("eslint  ./packages/components --fix --ext .ts,.tsx,.vue,.js,.jsx")
  consola.success(`${chalk.yellow("组件目录eslint格式化完成...")}`)
}

createComDir()
