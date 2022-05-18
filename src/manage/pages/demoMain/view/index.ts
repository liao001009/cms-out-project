import api from '@/api/demoMain'
import Content from '@/manage/pages/demoMain/edit/content'
import './index.scss'

export default {
  // 类型：模块
  type: 'page',
  // 页面标题
  title: '样例实例',
  // 路由
  router: '/view/:id',
  // 模块内容区
  children: {
    // 内容类型: 详情
    type: 'content-detail',
    // 数据请求
    dataUrl: ({ query }) => api.get({ ...query }),
    // 内容渲染组件
    render: Content,
    // 传递到Content的属性
    props: { mode: 'readOnly' }
  }
  // 权限控制
  // auth: {  authURL: '/demoMain/view'  }
}
