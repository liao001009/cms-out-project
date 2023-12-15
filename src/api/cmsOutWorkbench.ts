import { Api } from '@ekp-infra/common'
import { cmsHttp } from '@/utils/http'

const api = {
  // 获取简历返回数据
  convent: Api.build('/cmsOutWorkbench/convent', cmsHttp),
}

export default api
