import React, { createElement as h, Fragment, useCallback, useRef } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Breadcrumb, Button, Message, Modal } from '@lui/core'
import { EBtnType } from '@lui/core/es/components/Button'
import XForm from './form'
import api from '@/api/cmsProjectInfo'
import './index.scss'
import { IProps } from '@/types/common'


const bacls = 'projectInfo-content'

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
  const _formatValue = async () => {
    let values = {
      ...data,
    }
    // 表单机制数据
    if (formComponentRef.current) {
      const formValues = await formComponentRef.current.getValue() || {}
      if (formValues.fdFrame) {
        values = {
          ...values,
          ...formValues,
          fdFrame: {
            fdId: formValues.fdFrame
          }
        }
      } else {
        values = {
          ...values,
          ...formValues
        }
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

  // 提交/保存通用逻辑
  const handleSave = async (isDraft: boolean) => {
    // 校验文档
    if (await _validate(isDraft) === false) {
      return
    }
    // 拼装提交数据
    const values = await _formatValue()
    // 文档提交前事件
    if (await _beforeSave(isDraft) === false) {
      return
    }
    const getDataApi = mode === 'add' ? api.add : api.save
    // 编辑提交
    getDataApi(values as any).then(res => {
      if (res.success) {
        Message.success(isDraft ? '保存成功' : '提交成功', 1, () => {
          history.goBack()
        })
      } else {
        Message.error(isDraft ? '保存失败' : '提交失败', 1)
      }
    }).catch(() => {
      Message.error(isDraft ? '保存失败' : '提交失败', 1)
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
            <Breadcrumb.Item>框架外包项目管理</Breadcrumb.Item>
            <Breadcrumb.Item>{mode === 'add' ? '添加' : '编辑'}</Breadcrumb.Item>
          </Breadcrumb>
          <div className='buttons'>
            {
              mode === 'add' ? (
                <Fragment>
                  <Button type='primary' onClick={() => handleSave(false)}>提交</Button>
                  <Button type='default' onClick={handleClose}>关闭</Button>
                </Fragment>
              ) : (
                <Fragment>
                  <Button type='primary' onClick={() => handleSave(true)}>保存</Button>
                  <Button type='default' onClick={handleDelete}>删除</Button>
                </Fragment>
              )
            }
          </div>
        </div>
        {/* 内容区 */}
        <div className='lui-approve-template-content'>
          {/* 表单信息 */}
          <div className='form'>
            <XForm formRef={formComponentRef} value={data || {}} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content