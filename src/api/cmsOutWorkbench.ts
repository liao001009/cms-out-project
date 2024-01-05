import { Api } from '@ekp-infra/common'
import { cmsHttp } from '@/utils/http'

const api = {
  // 获取简历返回数据
  key: Api.build('/cmsOutWorkbench/convent', cmsHttp),
  convents: Api.build('/cmsOutWorkbench/extract', cmsHttp),
}

export default api
