// “新建”操作
import { useState, useCallback } from 'react'
import { useHistory } from 'react-router'

export const useAdd = (callbackUrl: string) => {
  const [visible, setVisible] = useState<boolean>(false)
  // 发起新建
  const $add = useCallback(({ api, selectedRows, history }) => {
    setVisible(true)
  }, [])
  // 确定选择模板
  const history = useHistory()
  const $addClose = useCallback((selectedRow) => {
    if (selectedRow) {
      const url = callbackUrl.replace('!{selectedRow}', selectedRow.fdId || selectedRow)
      history.goto(url)
    }
    setVisible(false)
  }, [])
  return {
    $add,
    $addClose,
    $addVisible: visible,
  }
}
