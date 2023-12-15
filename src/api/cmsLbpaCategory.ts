import { Api } from '@ekp-infra/common'
import { cmsLbpaHttp } from '@/utils/http'

const api = {
  // 获取当前登陆人所在一级部门
  getUserTopCategory: Api.build('/cmsLbpaCategory/getUserTopCategory', cmsLbpaHttp),
}

export default api

