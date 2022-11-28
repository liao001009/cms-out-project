import React, { createElement as h, useCallback, useRef } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Breadcrumb, Button, Message, Modal } from '@lui/core'
import { EBtnType } from '@lui/core/es/components/Button'
import XForm from './form'
import api from '@/api/cmsProjectInterview'
import './index.scss'
import { IProps } from '@/types/common'
import { ESysLbpmProcessStatus } from '@/utils/status'
import { cmsHandleBack } from '@/utils/routerUtil'
import { Auth } from '@ekp-infra/common'
Message.config({ maxCount: 1 })
const bacls = 'cmsProjectInterview-content'

const Content: React.FC<IProps & IContentViewProps> = props => {
  const { data, history, routerPrefix, mode, match } = props
  const params = match?.params || ''
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
      //检查明细表姓名是否重复
      const formValues = await formComponentRef.current.getValue() || {}
      const cmsProjectInterDetail = formValues?.cmsProjectInterDetail?.values || []
      const isRep = isReplace(cmsProjectInterDetail)
      if (isRep) {
        Message.error('姓名不能重复！')
        return !isRep
      }
    }

    return true
  }

  const isReplace = (arr) => {
    const hash = {}
    for (const i in arr) {
      if (!hash[arr[i].fdInterviewName.fdId]) {
        hash[arr[i].fdInterviewName.fdId] = true
      }
    }
    return Object.keys(hash).length < arr.length
  }


  // 提交数据封装
  const _formatValue = async (isDraft: boolean, fdStatus: string) => {
    let values = {
      ...data,
    }
    // 表单机制数据
    if (formComponentRef.current) {
      const formValues = await formComponentRef.current.getValue() || {}
      const cmsProjectInterDetail = formValues?.cmsProjectInterDetail?.values || []
      const newDetail = cmsProjectInterDetail.map(item => {
        const newItem = {
          ...item,
        }
        return newItem
      })
      if (typeof formValues.fdProjectDemand === 'string') {
        formValues.fdProjectDemand = { fdId: formValues.fdProjectDemand }
      }
      values = {
        ...values,
        ...formValues,
        fdStatus: fdStatus,
        cmsProjectInterDetail: newDetail,
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
        Message.success(fdStatus === ESysLbpmProcessStatus.DRAFT ? '暂存成功' : '提交成功', 1, () => {
          cmsHandleBack(history, '/cmsProjectInterview/listInterview')
        })
      } else {
        Message.error(fdStatus === ESysLbpmProcessStatus.DRAFT ? '暂存失败' : '提交失败', 1)
      }
    }).catch(() => {
      Message.error(fdStatus === ESysLbpmProcessStatus.DRAFT ? '暂存失败' : '提交失败', 1)
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
    cmsHandleBack(history, '/cmsProjectInterview/listInterview')
  }, [])

  return (
    <div className={bacls}>
      <div className='lui-approve-template'>
        {/* 操作区 */}
        <div className='lui-approve-template-header'>
          <Breadcrumb>
            <Breadcrumb.Item>项目管理</Breadcrumb.Item>
            <Breadcrumb.Item>录入面试成绩</Breadcrumb.Item>
            <Breadcrumb.Item>{mode === 'add' ? '新增' : '编辑'}</Breadcrumb.Item>
          </Breadcrumb>
          <div className='buttons'>
            <Auth.Auth
              authURL='/cmsProjectInterview/save'
              authModuleName='cms-out-manage'
              unauthorizedPage={null}
            >
              <Button type='primary' onClick={() => handleSave(false, ESysLbpmProcessStatus.COMPLETED)}>提交</Button>

            </Auth.Auth>
            <Auth.Auth
              authURL='/cmsProjectInterview/delete'
              params={{ vo: { fdId: params['id'] } }}
              authModuleName='cms-out-manage'
              unauthorizedPage={null}
            >
              <Button type='default' onClick={handleDelete}>删除</Button>

            </Auth.Auth>
            <Button type='default' onClick={handleClose}>关闭</Button>
          </div>
        </div>
        {/* 内容区 */}
        <div className='lui-approve-template-content'>
          <div className='left'>
            {/* 表单信息 */}
            <div className='form'>
              <XForm formRef={formComponentRef}  {...props} value={data || {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content
