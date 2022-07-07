
const path = require('path')
const consola = require('consola')
const chalk = require('chalk')
const fs = require('fs')


let comDirName  = process.argv[2]

let comRoot = path.resolve(__dirname,'..','packages/components')
let comRootIndex = path.resolve(comRoot,'index.ts')



function createComIndexContent(name){
    return `
    import { withInstall } from "@l-ui/utils/with-install"
    import Com from "./src/${name}.vue";

    const ${getComName(name)} = withInstall(Com);

    export{
      ${getComName(name)}
    }
    export default ${getComName(name)};
    `
}


function createComTemplate(name){
  return  `
  <template>
        <div></div>
  </template>
  
  <script lang="ts">
  import {defineComponent } from "vue";
  export default defineComponent({
    name: "${name}",
    setup() {
  
    },
  });
  </script>
  `
}

function getComName(name){
    let result  = 'L'
    for(let i=0;i<name.length;i++){
      if(i===0){
        result += name[i].toUpperCase()
      }else{
        result += name[i]
      }
    }
    return result
}


 function createComDir() {
   if(!comDirName) return consola.error(`${chalk.red('请输入目录名参数！')}`)
   let comDir = path.join(comRoot,`${comDirName}`)
   if(fs.existsSync(comDir)) return  consola.error(`${chalk.red('组件目录已经存在！')}`)
    consola.success(`${chalk.yellow('创建组件目录中.....')}`)
    fs.mkdirSync(comDir)
    fs.mkdirSync(path.resolve(comDir,'src'))
    fs.writeFileSync(path.resolve(comDir,'src',`${comDirName}.vue`),createComTemplate(getComName(comDirName)),'utf-8')
    fs.writeFileSync(path.resolve(comDir,'index.ts'),createComIndexContent(comDirName),'utf-8')
    let indexContent = fs.readFileSync(comRootIndex,'utf-8')
    fs.writeFileSync(comRootIndex,`\nexport * from './${comDirName}'`,{flag:'a'})
    consola.success(`${chalk.yellow('创建组件目录完成.....')}`)
 }

 createComDir()





