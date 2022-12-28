// “删除”操作
import { createElement as h } from 'react'
import Icon from '@lui/icons'
import { Modal, Message } from '@lui/core'
import { EBtnType } from '@lui/core/es/components/Button'

/**
 * 删除函数
 * @param api api请求对象
 * @param selectedRows 选中列 
 */
export const $deleteAll = ({ api, selectedRows, refresh }) => {
  // 未选中数据项
  if (!selectedRows || selectedRows.length === 0) {
    Message.info('请选择数据')
    return
  }
  Modal.confirm({
    title: '确认删除此记录?',
    icon: h(Icon, { name: 'delete', color: '#F25643' }),
    okType: 'danger' as EBtnType,
    okText: '删除',
    cancelText: '取消',
    onOk: () => {
      api
        .deleteAll({ fdIds: selectedRows.map((selectedRow) => (selectedRow.fdId ? selectedRow.fdId : selectedRow)) })
        .then((res) => {
          if (res.success) {
            Message.success('删除成功')
            refresh?.()
          } else {
            Message.error(res.msg || '删除失败')
          }
        })
        .catch((error) => {
          const errorMes = error.response.msg && error.response.data.data.exMsg
          Message.error(errorMes || '删除失败')
        })
    }
  })
}
