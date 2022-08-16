import { getSearchParam } from '@/utils/query'
// 返回
export const cmsHandleBack = (history, listUrl) => {
  const mechAuthToken = getSearchParam(location.href, 'mechAuthToken')
  // 判断是否待办打开
  if (mechAuthToken) {
    window.close()
    return
  }
  history.length > 1 ? history.goBack() : history.goto(listUrl)
}
