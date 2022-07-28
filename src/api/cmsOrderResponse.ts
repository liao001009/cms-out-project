import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsOrderResponse } from '@/types/cmsOrderResponse'

const commonApi = Api.get<ICmsOrderResponse>('cmsOrderResponse', http)

const api = {
  ...commonApi,
  save: Api.build('cmsOrderResponse/save', http),
  // 订单响应(列表请求)
  listOrder: Api.build('cmsOrderResponse/listOrder', http),
  // 订单响应人员列表
  listStaff: Api.build('cmsOrderResponse/listStaff', http)
}

export default api
