// 简单编辑(弹层实现)
// TODO 弹窗形式配置化
import React, { createElement as h, useRef, useCallback } from 'react'
import { ContentView } from '@ekp-runtime/render-module'
import { Modal } from '@lui/core'
import Content from './content'

export interface IProps {
  // 是否显示弹层
  visible: boolean
  // 回调
  callback: Function
  // 模板id
  templateId?: string
  // 编辑模式
  mode?: 'add' | 'update'
}

const Component: React.FC<IProps> = (props) => {
  const { callback, templateId, mode } = props
  const wrappedComponentRef = useRef<any>()

  const handleOk = useCallback(() => {
    wrappedComponentRef.current?.handleOk(callback)
  }, [])

  const handleCancel = useCallback(() => callback(), [])

  return h(
    Modal,
    {
      title: props.mode === 'add' ? '新建模板' : '更新模板',
      onOk: handleOk,
      onCancel: handleCancel,
      ...props
    },
    h(ContentView, {
      content: {
        // 类型：详情
        type: 'content-detail' as any,
        // 渲染内容
        render: Content,
        // 附加属性
        props: { wrappedComponentRef, mode, templateId }
      }
    })
  )
}

export default Component
