import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectDemandTemplate } from '@/types/cmsProjectDemandTemplate'

const commonApi = Api.get<ICmsProjectDemandTemplate>('cmsProjectDemandTemplate', http)

const api = {
  ...commonApi,
  // 模板发布
  publish: Api.build('/cmsProjectDemandTemplate/publish', http)
}

export default api
