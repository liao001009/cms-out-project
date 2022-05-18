import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { IDemoMain } from '@/types/demoMain'

const commonApi = Api.get<IDemoMain>('demoMain', http)

const api = {
  ...commonApi,
  // 发布
  // publish: (fdId: string) => http.post('/demoMain/publish', { fdId })
  // publish: Api.build('demoMain/publish', http)
}

export default api
