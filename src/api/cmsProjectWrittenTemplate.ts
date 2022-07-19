import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectWrittenTemplate } from '@/types/cmsProjectWrittenTemplate'

const commonApi = Api.get<ICmsProjectWrittenTemplate>('cmsProjectWrittenTemplate', http)

const api = {
  ...commonApi,
  // 模板发布
  publish: Api.build('/cmsProjectWrittenTemplate/publish', http)
}

export default api
