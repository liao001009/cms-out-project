import { Router } from '@ekp-infra/common'

export default {
  // 模块名
  name: 'cms-out-project',
  // 模块显示名
  label: ':name',
  // 类型：模块
  type: 'module',
  // 路由配置
  routers: Router.build(require.context('./', true, /^\.\/pages\/[^\/]*\/router\.ts$/)).router,
  // 自定义渲染
  render: (props) => props.children
}