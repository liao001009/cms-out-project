// import ListDemandCmpt from './list-Demand'
// import AddCmpt from './add'
import UploadAI from './uploadAI'
import InterviewAI from './interviewAI'
// import EditCmpt from './edit'

export default {
  /** 路由前缀 */
  router: '/cmsInterviewWorkbench',
  /** 页面配置，第一个为首页 */
  pages: [UploadAI, InterviewAI]
}
