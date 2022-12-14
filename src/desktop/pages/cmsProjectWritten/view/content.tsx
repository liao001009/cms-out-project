import React, { useRef, useCallback } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Breadcrumb, Button, Message, Modal } from '@lui/core'
import XForm from './form'
import api from '@/api/cmsProjectWritten'
import './index.scss'
import { cmsHandleBack } from '@/utils/routerUtil'
import { Auth } from '@ekp-infra/common'
Message.config({ maxCount: 1 })

const { confirm } = Modal

const baseCls = 'cmsProjectWritten-content normal'

const Content: React.FC<IContentViewProps> = props => {
  const { data, history, match } = props
  const params = match?.params || ''
  // 机制组件引用
  const formComponentRef = useRef<any>()


  // 关闭
  const handleClose = useCallback(() => {
    cmsHandleBack(history, '/cmsProjectWritten/listWritten')
  }, [])


  const handleEdit = useCallback(() => {
    history.goto(`/cmsProjectWritten/edit/${data.fdId}`)
  }, [history])

  const handleDel = useCallback(() => {
    confirm({
      content: '确认删除此记录？',
      cancelText: '取消',
      okText: '确定',
      onOk () {
        api.delete({ fdId: data.fdId }).then(res => {
          if (res.success) {
            Message.success('删除成功')
            cmsHandleBack(history, '/cmsProjectWritten/listWritten')
          }
        }).catch(error => {
          Message.error(error.response.data.msg || '删除失败')
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
            <Breadcrumb.Item>录入笔试成绩</Breadcrumb.Item>
            <Breadcrumb.Item>查看</Breadcrumb.Item>
          </Breadcrumb>
          <div className='buttons'>
            <Auth.Auth
              authURL='/cmsProjectWritten/edit'
              authModuleName='cms-out-manage'
              params={{ vo: { fdId: params['id'] } }}
              unauthorizedPage={null}
            >
              <Button type='primary' onClick={handleEdit}>编辑</Button>

            </Auth.Auth>
            <Auth.Auth
              authURL='/cmsProjectWritten/delete'
              authModuleName='cms-out-manage'
              params={{ vo: { fdId: params['id'] } }}
              unauthorizedPage={null}
            >
              <Button type='default' onClick={handleDel}>删除</Button>

            </Auth.Auth>
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
