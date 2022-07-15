
function getGuideSidebar() {
  return [
    {
      text: '基础组件',
      children: [
        {
          text: '组件测试',
          link: '/guide/button'
        }
      ]
    }
  ]
}


export default {
  "/guide/": getGuideSidebar(),
}
