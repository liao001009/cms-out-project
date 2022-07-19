import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectSelectInfoTemplate } from '@/types/cmsProjectSelectInfoTemplate'

const commonApi = Api.get<ICmsProjectSelectInfoTemplate>('cmsProjectSelectInfoTemplate', http)

const api = {
  ...commonApi,
  // 模板发布
  publish: Api.build('/cmsProjectSelectInfoTemplate/publish', http)
}

export default api
