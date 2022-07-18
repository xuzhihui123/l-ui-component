[![OSCS Status](https://www.oscs1024.com/platform/badge/xuzhihui123/l-ui-component.svg?size=small)](https://www.oscs1024.com/project/xuzhihui123/l-ui-component?ref=badge_small)

# vue3内部组件库文档
> 组件库通过pnpm自带monorepo构建，vue组件根据rollup打包，scss通过gulp转译。

- vue3组件库文档
  1. [项目结构](#1、项目结构)
  2. [开发注意点](#2、开发注意点)

## 1、项目结构

​    |-- .eslintignore

​    |-- .eslintrc.js

​    |-- .gitignore

​    |-- .npmrc

​    |-- .pnpm-debug.log

​    |-- .prettierignore

​    |-- .prettierrc

​    |-- README.md

​    |-- package.json

​    |-- pnpm-lock.yaml

​    |-- pnpm-workspace.yaml

​    |-- tsconfig.json

​    |-- build # 打包脚本

​    |-- docs # 组件库文档，后续组件写入，文档也陆续补充

​    |-- packages # 

​    |   |-- components

​    |   |-- l-ui

​    |   |-- theme-chalk

​    |   |-- utils

​    |-- play

​    |   |-- app.vue

​    |   |-- index.html

​    |   |-- main.ts

​    |   |-- package.json

​    |   |-- vite.config.js

​    |-- typings

​        |-- vue-shim.d.ts

## 2、开发注意点