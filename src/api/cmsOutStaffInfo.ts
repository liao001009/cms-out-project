import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsOutStaffInfo } from '@/types/cmsOutStaffInfo'

const commonApi = Api.get<ICmsOutStaffInfo>('cmsOutStaffInfo', http)

const api = {
  ...commonApi,
  save: Api.build('cmsOutStaffInfo/save', http),
  // 外包人员信息(列表请求)
  listStaffInfo: Api.build('cmsOutStaffInfo/listStaffInfo', http),
  // 供应商内嵌列表(列表请求)
  listInnerStaffInfo: Api.build('cmsOutStaffInfo/listInnerStaffInfo', http),
  list: Api.build('cmsOutStaffInfo/list', http)
}

export default api
