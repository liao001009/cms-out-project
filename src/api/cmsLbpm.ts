import { Api } from '@ekp-infra/common'
import { sysLbpmHttp } from '@/utils/http'

const api = {
  // 角色权限校验
  getCurrentNodeInfo: Api.build('/card/getCurrentNodeInfo', sysLbpmHttp),
}

export default api
