import { Api } from '@ekp-infra/common'
import { sysAuthHttp } from '@/utils/http'

const api = {
  // 角色权限校验
  roleCheck: Api.build('/roleCheck', sysAuthHttp),
}

export default api
