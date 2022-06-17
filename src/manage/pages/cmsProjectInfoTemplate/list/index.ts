import api from '@/api/cmsProjectInfoTemplate'
import Content from './content'
import { Type } from '@ekp-infra/common'

export default {
  // 类型：模块
  type: 'page',
  // 页面标题
  title: 'cms-out-project:cmsProjectInfoTemplate.name',
  // 路由
  router: '/list',
  // 模块内容区
  children: {
    // 内容类型: 列表
    type: 'content-list',
    // 数据请求
    dataUrl: ({ query }) =>
      api.list({
        sorts: { fdCreateTime: Type.ESortType.DESC },
        columns: ['fdId', 'fdName', 'fdCode', 'fdCreator', 'fdCreateTime'],
        ...query
      }),
    // 内容渲染组件
    render: Content
  }
}
