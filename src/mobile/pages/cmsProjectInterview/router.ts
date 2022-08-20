import ListInterviewCmpt from './list-Interview'
import AddCmpt from './add'
import ViewCmpt from './view'
import EditCmpt from './edit'

export default {
  /** 路由前缀 */
  router: '/cmsProjectInterview',
  /** 页面配置，第一个为首页 */
  pages: [ListInterviewCmpt, AddCmpt, ViewCmpt, EditCmpt]
}
