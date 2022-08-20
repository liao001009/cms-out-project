import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsStaffReviewTemplate } from '@/types/cmsStaffReviewTemplate'

const commonApi = Api.get<ICmsStaffReviewTemplate>('cmsStaffReviewTemplate', http)

const api = {
  ...commonApi,
  // 模板发布
  publish: Api.build('/cmsStaffReviewTemplate/publish', http)
}

export default api
