import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..','..')


export const outDir = resolve(__dirname,'../../dist')


// l-ui 入口 index.ts
export const luiRoot = resolve(__dirname,'../../packages/l-ui')

// 组件目录
export const compRoot = resolve(projRoot,'packages/components')