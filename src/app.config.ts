export default defineAppConfig({
  pages: [
    'pages/customer/index',
    'pages/script/index',
    'pages/chat/index',
    'pages/task/index',
    'pages/stats/index',
    'pages/product/index',
    'pages/favorite/index',
    'pages/customer-form/index',
    'pages/product-form/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: 'AI销售助手',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f8fafc'
  },
  tabBar: {
    color: '#94a3b8',
    selectedColor: '#2563eb',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/customer/index',
        text: '客户'
      },
      {
        pagePath: 'pages/script/index',
        text: '话术'
      },
      {
        pagePath: 'pages/chat/index',
        text: '对话'
      },
      {
        pagePath: 'pages/task/index',
        text: '任务'
      },
      {
        pagePath: 'pages/stats/index',
        text: '统计'
      }
    ]
  }
})
