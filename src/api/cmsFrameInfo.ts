import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsFrameInfo } from '@/types/cmsFrameInfo'

const commonApi = Api.get<ICmsFrameInfo>('cmsFrameInfo', http)

const api = {
  ...commonApi,
  save: Api.build('cmsFrameInfo/save', http),
  list: Api.build('cmsFrameInfo/list', http),
  // 框架信息(列表请求)
  listFrameInfo: Api.build('cmsFrameInfo/listFrameInfo', http)
}

export default api
