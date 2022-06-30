import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectInfo } from '@/types/cmsProjectInfo'

const commonApi = Api.get<ICmsProjectInfo>('project/cmsProjectInfo', http)

const api = {
  ...commonApi,
  save: Api.build('project/cmsProjectInfo/save', http),
  // 项目库(列表请求)
  listProjectInfo: Api.build('project/cmsProjectInfo/listProjectInfo', http)
}

export default api
