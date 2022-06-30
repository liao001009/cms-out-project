import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsFrameInfo } from '@/types/cmsFrameInfo'

const commonApi = Api.get<ICmsFrameInfo>('basedata/cmsFrameInfo', http)

const api = {
  ...commonApi,
  save: Api.build('basedata/cmsFrameInfo/save', http),
  // 框架信息(列表请求)
  listFrameInfo: Api.build('basedata/cmsFrameInfo/listFrameInfo', http)
}

export default api
