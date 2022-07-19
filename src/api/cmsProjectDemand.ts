import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectDemand } from '@/types/cmsProjectDemand'

const commonApi = Api.get<ICmsProjectDemand>('cmsProjectDemand', http)

const api = {
  ...commonApi,
  save: Api.build('cmsProjectDemand/save', http),
  // 项目需求列表(列表请求)
  listDemand: Api.build('cmsProjectDemand/listDemand', http)
}

export default api
