import React, { useRef, useCallback } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Breadcrumb, Button, Message, Modal } from '@lui/core'
import XForm from './form'
import api from '@/api/cmsProjectInterview'
import './index.scss'

Message.config({ maxCount: 1 })

const { confirm } = Modal
const baseCls = 'cmsProjectInterview-content'

const Content: React.FC<IContentViewProps> = props => {
  const { data,  history } = props
  
  // 机制组件引用
  const formComponentRef = useRef<any>()

  // 关闭
  const handleClose = useCallback(() => {
    history.goBack()
  }, [])


  const handleEdit = useCallback(() => {
    history.goto(`/cmsProjectInterview/edit/${data.fdId}`)
  }, [history])

  const handleDel = useCallback(() => {
    confirm({
      content: '确认删除此记录？',
      onOk () {
        api.delete({ fdId: data.fdId }).then(res => {
          console.log('删除结果', res)
          if (res.success) {
            Message.success('删除成功')
            history.goBack()
          }
        })
      },
      onCancel () {
        console.log('Cancel')
      },
    })
  }, [])


  return (
    <div className={baseCls}>
      <div className='lui-approve-template'>
        {/* 操作区 */}
        <div className='lui-approve-template-header'>
          <Breadcrumb>
            <Breadcrumb.Item>项目管理</Breadcrumb.Item>
            <Breadcrumb.Item>查看</Breadcrumb.Item>
          </Breadcrumb>
          <div className='buttons'>
            <Button type='primary' onClick={handleEdit}>编辑</Button>
            <Button type='default' onClick={handleDel}>删除</Button>
            <Button type='default' onClick={handleClose}>关闭</Button>
          </div>
        </div>
        {/* 内容区 */}
        <div className='lui-approve-template-content'>
          <div className='left'>
            {/* 表单信息 */}
            <div className='form'>
              <XForm formRef={formComponentRef} value={data || {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content