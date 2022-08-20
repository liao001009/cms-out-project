// 简单列表(弹层实现)
// TODO 弹窗形式配置化
import React, { createElement as h, useRef, useCallback } from 'react'
import { ContentView } from '@ekp-runtime/render-module'
import { Modal } from '@lui/core'
import api from '@/api/cmsProjectInterviewTemplate'
import Content from './content'
import { Type } from '@ekp-infra/common'

export interface IProps {
  // 是否显示弹层
  visible: boolean
  // 回调
  callback: Function
}

const Component: React.FC<IProps> = (props) => {
  const { callback } = props
  const wrappedComponentRef = useRef<any>()

  const handleOk = useCallback(() => {
    wrappedComponentRef.current?.handleOk(callback)
  }, [])

  const handleCancel = useCallback(() => callback(), [])

  return h(
    Modal,
    {
      title: '模板列表',
      onOk: handleOk,
      onCancel: handleCancel,
      width: 1000,
      ...props
    },
    h(ContentView, {
      content: {
        // 类型：列表
        type: 'content-list' as any,
        // 数据请求

        dataUrl: ({ query }) =>
          api.list({
            sorts: { fdCreateTime: Type.ESortType.DESC },
            columns: ['fdId', 'fdName', 'fdCode', 'fdCreator', 'fdCreateTime'],
            ...query
          }),
        // 渲染内容
        render: Content,
        // 附加属性
        props: { wrappedComponentRef }
      }
    })
  )
}

export default Component
