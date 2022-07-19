import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectSelectInfo } from '@/types/cmsProjectSelectInfo'

const commonApi = Api.get<ICmsProjectSelectInfo>('cmsProjectSelectInfo', http)

const api = {
  ...commonApi,
  save: Api.build('cmsProjectSelectInfo/save', http),
  // 发布中选信息(列表请求)
  listSelectInfo: Api.build('cmsProjectSelectInfo/listSelectInfo', http)
}

export default api
