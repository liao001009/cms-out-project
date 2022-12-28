import { Api } from '@ekp-infra/common'
import http from '@/utils/http'
import { ICmsSelectConfirm } from '@/types/cmsSelectConfirm'

const commonApi = Api.get<ICmsSelectConfirm>('cmsSelectConfirm', http)

const api = {
  ...commonApi,
  save: Api.build('cmsSelectConfirm/save', http),
  // 确认中选信息(列表请求)
  listSelect: Api.build('cmsSelectConfirm/listSelect', http),
  // 通过项目需求获取中选增补名单
  listSuppleDetail: Api.build('cmsSelectConfirm/listSuppleDetail', http)
}

export default api
