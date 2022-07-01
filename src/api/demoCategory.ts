import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { IDemoCategroy } from '@/types/demoCategory'

const commonApi = Api.get<IDemoCategroy>('demoCategory', http)

const api = {
  ...commonApi,
  // 获取树型数据
  getTreeData: Api.build('demoCategory/tree', http)
}

export default api
