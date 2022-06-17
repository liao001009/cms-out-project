// “删除”操作
import { createElement as h } from 'react'
import Icon from '@lui/icons'
import { Modal, Message } from '@lui/core'

// 删除函数
export type TDeleteFunc = () => Promise<any>
// 删除回调函数
export type TDeleteCallback = () => void

export const $delete = (func: TDeleteFunc, callback?: TDeleteCallback) => {
  try {
    Modal.confirm({
      title: '当前操作不可恢复，确认删除该分类？',
      className: 'icon-delete',
      icon: h(Icon, { name: 'exclamation-fill', type: 'vector' }),
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        func()
          .then(() => {
            Message.success('删除成功')
            callback && callback()
          })
          .catch((err) => {
            const errData = err.response.data
            Message.error(errData.msg)
          })
      }
    })
  } catch (err) {
    console.error(err.response)
  }
}
