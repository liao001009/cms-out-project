// 简单列表(弹层实现)
// TODO 弹窗形式配置化
import React, { createElement as h, useCallback } from 'react'
import { ContentView } from '@ekp-runtime/render-module'
import { Popup } from '@mui/core'
import api from '@/api/cmsProjectInfoTemplate'
import Content from './content'

export interface IProps {
  // 是否显示弹层
  visible: boolean
  // 回调
  callback: Function
}

const Component: React.FC<IProps> = (props) => {
  const { callback } = props

  const handleCancel = useCallback((event) => {
    event.stopPropagation()
    callback()
  }, [])

  return h(
    Popup,
    {
      position: 'right',
      bodyStyle: { width: '90vw' },
      onMaskClick: handleCancel,
      ...props
    },
    h(ContentView, {
      content: {
        // 类型：列表
        type: 'content-list' as any,
        // 数据请求
        dataUrl: ({ query }) => api.list({ ...query }),
        // 渲染内容
        render: Content,
        // 附加属性
        props: { callback }
      }
    })
  )
}

export default Component
