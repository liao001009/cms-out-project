import React, { createElement as h, useCallback, useRef } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Breadcrumb, Button, Message, Modal } from '@lui/core'
import { EBtnType } from '@lui/core/es/components/Button'
import XForm from './form'
import api from '@/api/cmsProjectWritten'
import './index.scss'
import { IProps } from '@/types/common'
import { ESysLbpmProcessStatus } from '@/utils/status'

Message.config({ maxCount: 1 })

const bacls = 'cmsProjectWritten-content'

const Content: React.FC<IProps & IContentViewProps> = props => {
  const { data, history, routerPrefix, mode } = props
  
  
  // 机制组件引用
  const formComponentRef = useRef<any>()

  // 校验
  const _validate = async (isDraft: boolean) => {
    // 表单校验
    if (formComponentRef.current && !isDraft) {
      const formErrors = await formComponentRef.current.validate()
      if (formErrors?.length > 0 && !isDraft) {
        return false
      }
    }
    return true
  }

  // 提交数据封装
  const _formatValue = async (isDraft: boolean, fdStatus: string) => {
    let values = {
      ...data,
    }
    // 表单机制数据
    if (formComponentRef.current) {
      const formValues = await formComponentRef.current.getValue() || {}
      const cmsProjectWrittenDe = formValues?.cmsProjectWrittenDe?.values ||[]
      const newDetail = cmsProjectWrittenDe.map(item=>{
        const newItem = {
          ...item, 
          fdSupplier: {fdId: item.fdSupplier},
        }
        return newItem
      })
      values = {
        ...values,
        ...formValues,
        fdStatus: fdStatus,
        fdIsInterview: formValues?.fdIsInterview?.[0],
        fdNoticeInterviewer: formValues?.fdNoticeInterviewer?.[0],
        fdNoticeSupplier: formValues?.fdNoticeSupplier?.[0],
        cmsProjectWrittenDe: newDetail
      }
      if (formValues.mechanisms) {
        delete values.mechanisms
      }
    }
    return values
  }

  // 提交前事件
  const _beforeSave = async (isDraft: boolean) => {
    // 提交前表单预处理
    if (formComponentRef.current) {
      const beforeFormErrors = await formComponentRef.current.beforeSubmit({ isDraft })
      if (beforeFormErrors) {
        return false
      }
    }
   
    return true
  }

  // 提交/暂存通用逻辑
  const handleSave = async (isDraft: boolean, fdStatus: string) => {
    // 校验文档
    if (await _validate(isDraft) === false) {
      return
    } 
    // 拼装提交数据
    const values = await _formatValue(isDraft, fdStatus)
    // 文档提交前事件
    if (await _beforeSave(isDraft) === false) {
      return
    }
    const getDataApi = mode === 'add' ? api.add : api.save
    // 编辑提交
    getDataApi(values as any).then(res => {
      if (res.success) {
        Message.success(fdStatus=== ESysLbpmProcessStatus.DRAFT ? '暂存成功': '提交成功', 1, () => {
          history.goBack()
        })
      } else {
        Message.error(fdStatus=== ESysLbpmProcessStatus.DRAFT ? '暂存失败': '提交失败', 1)
      }
    }).catch(() => {
      Message.error(fdStatus=== ESysLbpmProcessStatus.DRAFT ? '暂存失败': '提交失败', 1)
    })
  }

  // 删除
  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除此记录?',
      icon: h(Icon, { name: 'delete', color: '#F25643' }),
      okType: 'danger' as EBtnType,
      okText: '删除',
      onOk: () => {
        api
          .delete({ fdId: data.fdId })
          .then((res) => {
            if (res.success) {
              Message.success('删除成功')
              history.goto(routerPrefix)
            } else {
              Message.error(res.data.exMsg || '删除失败')
            }
          })
          .catch((error) => {
            const errorMes = error.response.data && error.response.data.data.exMsg
            Message.error(errorMes || '删除失败')
          })
      }
    })
  }

  // 关闭
  const handleClose = useCallback(() => {
    history.goBack()
  }, [])
  
  return (
    <div className={bacls}>
      <div className='lui-approve-template'>
        {/* 操作区 */}
        <div className='lui-approve-template-header'>
          <Breadcrumb>
            <Breadcrumb.Item>项目管理</Breadcrumb.Item>
            <Breadcrumb.Item>编辑</Breadcrumb.Item>
          </Breadcrumb>
          <div className='buttons'>
            <Button type='primary' onClick={() => handleSave(true, ESysLbpmProcessStatus.DRAFT)}>暂存</Button>
            <Button type='primary' onClick={() => handleSave(true, ESysLbpmProcessStatus.COMPLETED)}>提交</Button>
            <Button type='default' onClick={handleDelete}>删除</Button>
            <Button type='default' onClick={handleClose}>关闭</Button>
          </div>
        </div>
        {/* 内容区 */}
        <div className='lui-approve-template-content'>
          <div className='left'>
            {/* 表单信息 */}
            <div className='form'>
              <XForm formRef={formComponentRef} {...props}  value={data || {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content