import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { IDemoCategroy } from '@/types/demoCategory'

const commonApi = Api.get<IDemoCategroy>('project/demoCategory', http)

const api = {
  ...commonApi,
  // 获取树型数据
  getTreeData: Api.build('project/demoCategory/tree', http)
}

export default api
