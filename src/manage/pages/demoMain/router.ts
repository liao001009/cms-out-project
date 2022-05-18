import List from './list'
import Add from './add'
import Edit from './edit'
import View from './view'

export default {
  /** 路由前缀 */
  router: '/demoMain',
  /** 页面配置，第一个为首页 */
  pages: [
    // 列表
    List,
    // 新建
    Add,
    // 编辑
    Edit,
    // 详情
    View
  ]
}
