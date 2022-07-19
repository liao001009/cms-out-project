import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsSupplierInfo } from '@/types/cmsSupplierInfo'

const commonApi = Api.get<ICmsSupplierInfo>('cmsSupplierInfo', http)

const api = {
  ...commonApi,
  save: Api.build('cmsSupplierInfo/save', http),
  // 供应商信息(列表请求)
  listSupplierInfo: Api.build('cmsSupplierInfo/listSupplierInfo', http)
}

export default api
