import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
// import { ICmsOutStaffInfo } from '@/types/cmsOutStaffInfo'
const commonApi = Api.get('cmsLevelInfo', http)

const api = {
  ...commonApi,
  save: Api.build('cmsLevelInfo/save', http),
  // 外包人员信息(列表请求)
  list: Api.build('cmsLevelInfo/listLevelInfo', http),
}

export default api
