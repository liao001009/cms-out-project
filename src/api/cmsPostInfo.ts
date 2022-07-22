import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsPostInfo } from '@/types/cmsPostInfo'

const commonApi = Api.get<ICmsPostInfo>('cmsPostInfo', http)

const api = {
  ...commonApi,
  save: Api.build('cmsPostInfo/save', http),
  // 岗位信息(列表请求)
  listPostInfo: Api.build('cmsPostInfo/listPostInfo', http)
}

export default api
