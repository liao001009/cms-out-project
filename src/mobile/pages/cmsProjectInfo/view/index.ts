import { createElement as h } from 'react'
import Content from './content'
import api from '@/api/cmsProjectInfo'

export default {
  // 类型：页面
  type: 'page',
  // 页面标题
  title: '查看页面',
  // 路由
  router: '/view/:id',
  // 临时解决方案，等runtime完善fullscreen逻辑后移除
  render: (props) => h('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto',
      'zIndex': 99,
      backgroundColor: '#fff'
    }
  }, props.children),
  // 页面是否全屏，默认false
  fullscreen: true,
  // 模块内容区
  children: {
    // 类型: 列表内容
    type: 'content-detail',
    // 内容渲染组件
    render: Content,
    dataUrl: ({ param }) =>
      api.get({ fdId: param.id, mechanisms: { load: '*' } })
  }
}
