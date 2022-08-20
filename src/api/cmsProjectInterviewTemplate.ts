import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectInterviewTemplate } from '@/types/cmsProjectInterviewTemplate'

const commonApi = Api.get<ICmsProjectInterviewTemplate>('cmsProjectInterviewTemplate', http)

const api = {
  ...commonApi,
  // 模板发布
  publish: Api.build('/cmsProjectInterviewTemplate/publish', http)
}

export default api
