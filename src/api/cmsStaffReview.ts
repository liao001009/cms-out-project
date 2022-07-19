import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsStaffReview } from '@/types/cmsStaffReview'

const commonApi = Api.get<ICmsStaffReview>('cmsStaffReview', http)

const api = {
  ...commonApi,
  save: Api.build('cmsStaffReview/save', http),
  // 外包人员评审(列表请求)
  listStaffReview: Api.build('cmsStaffReview/listStaffReview', http)
}

export default api
