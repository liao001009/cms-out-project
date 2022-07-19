import api from '@/api/cmsProjectDemand'
import Content from './content'

export default {
  // 类型：模块
  type: 'page',
  // 页面标题
  title: 'cms-out-project:cmsProjectDemand.list.Demand',
  // 路由
  router: '/listDemand',
  // 模块内容区
  children: {
    // 内容类型: 列表
    type: 'content-list',
    // 数据请求
    dataUrl: ({ query }) => api['listDemand'](query),
    // 内容渲染组件
    render: Content
  }
}
