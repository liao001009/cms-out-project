import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectInfoTemplate } from '@/types/cmsProjectInfoTemplate'

const commonApi = Api.get<ICmsProjectInfoTemplate>('cmsProjectInfoTemplate', http)

const api = {
  ...commonApi,
  // 模板发布
  publish: Api.build('/cmsProjectInfoTemplate/publish', http)
}

export default api
