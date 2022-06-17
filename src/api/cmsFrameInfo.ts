import { Api } from '@ekp-infra/common'
import { basedataHttp } from '@/utils/http'
import { ICmsFrameInfo } from '@/types/cmsFrameInfo'

const commonApi = Api.get<ICmsFrameInfo>('cmsFrameInfo', basedataHttp)

const api = {
  ...commonApi,
  save: Api.build('cmsFrameInfo/save', basedataHttp),
  // 框架信息(列表请求)
  listFrameInfo: Api.build('cmsFrameInfo/listFrameInfo', basedataHttp)
}

export default api
