const path = require("path")
const { spawn } = require("child_process")
const fs = require("fs")

const comRoot = path.resolve(__dirname, "..", "..", "packages/components")
const comRootIndex = path.resolve(comRoot, "index.ts")

const run = async (command) => {
  return new Promise((resolve) => {
    // 将命令分割 例如：rm -rf 分割为['rm', '-rf'],进行解构[cmd,...args]
    const [cmd, ...args] = command.split(" ")
    const app = spawn(cmd, args, {
      cwd: path.resolve(__dirname, "..", ".."),
      stdio: "inherit",
      shell: true // 默认情况下 linux才支持 rm -rf  windows安装git bash 或者按照rimraf
    })
    // 在进程已结束并且子进程的标准输入输出流已关闭之后，则触发 'close' 事件
    app.on("close", resolve) //
  })
}

const rmDirDepSync = function (p) {
  // 获取根文件夹的 Stats 对象
  const statObj = fs.statSync(p)

  // 检查该文件夹的是否是文件夹
  if (statObj.isDirectory()) {
    // 查看文件夹内部
    let dirs = fs.readdirSync(p)

    // 将内部的文件和文件夹拼接成正确的路径
    dirs = dirs.map((dir) => path.join(p, dir))

    // 循环递归处理 dirs 内的每一个文件或文件夹
    for (let i = 0; i < dirs.length; i++) {
      rmDirDepSync(dirs[i])
    }

    // 等待都处理完后删除该文件夹
    fs.rmdirSync(p)
  } else {
    // 若是文件则直接删除
    fs.unlinkSync(p)
  }
}

module.exports = {
  comRoot,
  comRootIndex,
  run,
  rmDirDepSync
}
