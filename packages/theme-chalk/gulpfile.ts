/**
 * 打包样式
 * 安装相关依赖
 * pnpm install gulp-sass @types/gulp-sass @types/sass gulp-autoprefixer @types/gulp-autoprefixer @types/gulp-clean-css gulp-clean-css -w -D
 * gulp-autoprefixer:添加样式前缀  gulp-clean-css：压缩css
 */
import gulpSass from "gulp-sass"
import dartSass from "sass"
import autoprefixer from "gulp-autoprefixer"
import cleanCss from "gulp-clean-css"
import path from "path"
import chalk from "chalk"
import consola from "consola"
import fs from "fs"
import { resolve, basename } from "path"
import { sync } from "fast-glob" // 同步查找文件

/**
 * gulp是类似一个管道的方式执行，从入口开始到出口，中间一步步执行
 */
import { series, src, dest } from "gulp"
/**
 * 对sass文件做处理
 */
function compile() {
  const sass = gulpSass(dartSass)
  // 从src下的scss文件开始=>编译成css=>添加前缀=>压缩=>最终输出到当前目录下dist下的css目录
  return src(path.resolve(__dirname, "./src/*.scss"))
    .pipe(sass.sync())
    .pipe(autoprefixer())
    .pipe(
      cleanCss({}, (details) => {
        consola.success(
          `css文件打包 ${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(dest("./dist/css"))
}

/**
 * 处理font文件
 */
function copyfont() {
  // 从src下单fonts文件夹下的所有文件开始=>压缩=>最终输出到当前目录下dist下的font目录
  return src(path.resolve(__dirname, "./src/fonts/**")).pipe(dest("./dist/fonts"))
}

/**
 *   改变 打包后的css的fonts引入路径
 */
async function changeFontsSrcDir() {
  consola.success(`${chalk.yellow("css fonts路径修改中...")}`)
  const cssFileIncludeChange = /(icon|index)/
  const files = sync("*", {
    cwd: resolve(__dirname, "dist/css"),
    onlyFiles: true
  })
  files.map((f) => {
    const path = resolve(__dirname, `dist/css/${f}`)
    if (cssFileIncludeChange.test(basename(path))) {
      const content = fs.readFileSync(path, "utf-8")
      const reusltContent = content.replace(/url\(fonts/g, "url(../fonts")
      fs.writeFileSync(path, reusltContent, "utf-8")
    }
  })
  consola.success(`${chalk.yellow("css fonts路径修改完成！！！")}`)
}

/**
 * 把打包好的css输出到根目录的dist
 */
function copyfullstyle() {
  const rootDistPath = path.resolve(__dirname, "../../dist/theme-chalk")
  return src(path.resolve(__dirname, "./dist/**")).pipe(dest(rootDistPath))
}

export default series(compile, copyfont, changeFontsSrcDir, copyfullstyle)
