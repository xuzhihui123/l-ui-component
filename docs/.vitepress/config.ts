import  nav from './config/nav';
import sidebar from './config/sidebar';

import type { UserConfig } from 'vitepress'

import {demoBlockPlugin} from 'vitepress-theme-demoblock'


export const config: UserConfig = {
  title: '内部组件库文档',
  description: '集成内部通用组件等',
  themeConfig:{
    nav,
    sidebar,
    editLink:true,
    editLinkText:'在 Github上编辑此页',
  },
  lastUpdated:true,
  markdown: {
    anchor: { permalink: false },
    toc: { includeLevel: [1, 2] },
    config: (md) => {
      md.use(demoBlockPlugin,{
        cssPreprocessor:'scss'
      });
    },
    lineNumbers:true
  }
}
export default config