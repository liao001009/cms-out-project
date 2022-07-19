import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsProjectWritten } from '@/types/cmsProjectWritten'

const commonApi = Api.get<ICmsProjectWritten>('cmsProjectWritten', http)

const api = {
  ...commonApi,
  save: Api.build('cmsProjectWritten/save', http),
  // 录入笔试成绩(列表请求)
  listWritten: Api.build('cmsProjectWritten/listWritten', http)
}

export default api
