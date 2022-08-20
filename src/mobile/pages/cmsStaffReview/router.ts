import ListStaffReviewCmpt from './list-StaffReview'
import AddCmpt from './add'
import ViewCmpt from './view'
import EditCmpt from './edit'

export default {
  /** 路由前缀 */
  router: '/cmsStaffReview',
  /** 页面配置，第一个为首页 */
  pages: [ListStaffReviewCmpt, AddCmpt, ViewCmpt, EditCmpt]
}
