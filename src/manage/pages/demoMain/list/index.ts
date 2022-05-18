import api from '@/api/demoMain'
import Content from './content'

export default {
  // 类型：页面
  type: 'page',
  // 页面标题
  title: '样例模型',
  // 路由
  router: '/list',
  // 页面导航
  renderBreadcrumb: [
    {
      label: 'demo:name'
    },
    {
      label: 'demo:menu.demoMain',
      path: '/demoMain/list'
    }
  ],
  // 模块内容区
  children: {
    // 类型: 列表内容
    type: 'content-list',
    // 数据请求
    dataUrl: ({ query }) => api.list({ ...query }),
    // 内容渲染组件
    render: Content
  }
  // 权限控制
  // auth: {  authURL: '/demoMain/list'  }
}
