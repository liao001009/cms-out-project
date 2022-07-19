import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectInterview } from '@/types/cmsProjectInterview'

const commonApi = Api.get<ICmsProjectInterview>('cmsProjectInterview', http)

const api = {
  ...commonApi,
  save: Api.build('cmsProjectInterview/save', http),
  // 录入面试成绩(列表请求)
  listInterview: Api.build('cmsProjectInterview/listInterview', http)
}

export default api
