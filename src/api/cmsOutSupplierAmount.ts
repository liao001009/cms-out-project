import { Api } from '@ekp-infra/common'
import http from '@/utils/http'

const api = {
  // 获取年度份额
  getSupplierAmount: Api.build('cmsOutSupplierAmount/getSupplierAmount', http)
}

export default api
