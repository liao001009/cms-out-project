import Content from '@/manage/pages/demoMain/edit/content'
import './index.scss'

export default {
  // 类型：模块
  type: 'page',
  // 页面标题
  title: '样例实例',
  // 路由
  router: '/add',
  // 页面导航
  renderBreadcrumb: [
    {
      label: 'demo:name'
    },
    {
      label: 'demo:menu.demoMain',
      path: '/demoMain/list'
    },
    {
      label: 'demo:operation.add',
      path: '/demoMain/add'
    }
  ],
  // 模块内容区
  children: {
    // 内容类型: 详情
    type: 'content-detail',
    // 内容渲染组件
    render: Content,
    // 传递到Content的属性
    props: { mode: 'add' }
  }
  // 权限控制
  // auth: {  authURL: '/demoMain/init'  }
}
