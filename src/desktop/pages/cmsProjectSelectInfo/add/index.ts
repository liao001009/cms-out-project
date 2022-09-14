import { createElement as h } from 'react'
import api from '@/api/cmsProjectSelectInfo'
import Content from './content'

export default {
  // 类型：模块
  type: 'page',
  // 页面标题
  title: '新建',
  // 路由
  router: '/add/:templateId/:fdId',
  // 页面是否全屏，默认false
  fullscreen: true,
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
  // 模块内容区
  children: {
    // 内容类型: 列表
    type: 'content-list',
    // 内容渲染组件
    render: Content,
    // 请求
    dataUrl: async ({ param }) =>
      // const res = await apiTemplate.list({
      //   sorts: { 
      //     fdCreateTime:  ESortType.DESC
      //   },
      //   columns: ['fdId', 'fdName', 'fdCode', 'fdCreator', 'fdCreateTime']
      // })
      api.init({
        'fdProjectDemand': {
          'fdId': param.fdId
        },
        fdTemplate: { fdId: param.templateId },
        mechanisms: { load: '*' }
      })
  }
}