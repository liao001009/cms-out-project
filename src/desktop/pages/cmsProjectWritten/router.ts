import ListWrittenCmpt from './list-Written'
import AddCmpt from './add'
import ViewCmpt from './view'
import EditCmpt from './edit'

export default {
  /** 路由前缀 */
  router: '/cmsProjectWritten',
  /** 页面配置，第一个为首页 */
  pages: [ListWrittenCmpt, AddCmpt, ViewCmpt, EditCmpt]
}
