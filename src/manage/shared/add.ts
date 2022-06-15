// “新建”操作
import { useState, useCallback } from 'react'

export const useAdd = () => {
  const [visible, setVisible] = useState<boolean>(false)
  let refresh = () => { return }
  // 发起新建
  const $add = useCallback(({ api, refresh: _refresh, history }) => {
    setVisible(true)
    refresh = _refresh // 缓存refresh函数
  }, [])
  // 新建结束
  const $addClose = useCallback((success) => {
    // 新建成功则刷新页面
    success && refresh()
    setVisible(false)
  }, [])
  return {
    $add,
    $addClose,
    $addVisible: visible,
  }
}
