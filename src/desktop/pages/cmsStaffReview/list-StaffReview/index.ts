import api from '@/api/cmsStaffReview'
import Content from './content'

export default {
  // 类型：模块
  type: 'page',
  // 页面标题
  title: 'cms-out-project:cmsStaffReview.list.StaffReview',
  // 路由
  router: '/listStaffReview',
  // 模块内容区
  children: {
    // 内容类型: 列表
    type: 'content-list',
    // 数据请求
    dataUrl: ({ query }) => {
      const { sorts } = query
      return api['listStaffReview']({ ...query, sorts: { ...sorts, fdCreateTime: sorts?.fdCreateTime ? sorts.fdCreateTime : 'desc' } })
    },
    // 内容渲染组件
    render: Content
  }
}
