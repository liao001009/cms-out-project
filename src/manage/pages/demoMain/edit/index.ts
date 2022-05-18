import api from '@/api/demoMain'
import Content from './content'

export default {
  // 类型：模块
  type: 'page',
  // 页面标题
  title: '样例实例',
  // 路由
  router: '/edit/:id',
  // 模块内容区
  children: {
    // 内容类型: 详情
    type: 'content-detail',
    // 数据请求
    dataUrl: ({ query }) => api.get({ ...query }),
    // 内容渲染组件
    render: Content
  }
  // 权限控制
  // auth: {  authURL: '/demoMain/update'  }
}
