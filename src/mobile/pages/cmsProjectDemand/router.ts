import ListDemandCmpt from './list-Demand'
import AddCmpt from './add'
import ViewCmpt from './view'
import EditCmpt from './edit'

export default {
  /** 路由前缀 */
  router: '/cmsProjectDemand',
  /** 页面配置，第一个为首页 */
  pages: [ListDemandCmpt, AddCmpt, ViewCmpt, EditCmpt]
}
