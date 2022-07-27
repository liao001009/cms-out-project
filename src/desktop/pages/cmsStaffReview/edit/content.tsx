import React, { createElement as h, useRef, useMemo, useState, useEffect } from 'react'
import { Auth, Module } from '@ekp-infra/common'
import { IContentViewProps } from '@ekp-runtime/render-module'
import Icon from '@lui/icons'
import { Loading, Breadcrumb, Button, Message, Modal } from '@lui/core'
import { EBtnType } from '@lui/core/es/components/Button'
import { ESysLbpmProcessStatus, getFlowStatus } from '@/desktop/shared/util'
import XForm from './form'
import api from '@/api/cmsStaffReview'
import './index.scss'
import { EOperationType } from '@/utils/status'

Message.config({ maxCount: 1 })
// 流程页签
const LBPMTabs = Module.getComponent('sys-lbpm', 'LBPMTabs', { loading: <Loading /> })
// 流程机制
const LBPMFormFragment = Module.getComponent('sys-lbpm', 'LBPMFormFragment', { loading: <Loading /> })
// 权限机制
const RightFragment = Module.getComponent('sys-right', 'RightFragment', { loading: <Loading /> })
// 打印机制
// const PrintRuntime = Module.getComponent('sys-mech-print', 'PrintRuntimeFRagment', { loading: <React.Fragment></React.Fragment> })
const baseCls = 'project-review-content'
const Content: React.FC<IContentViewProps> = props => {
  const { data, history, routerPrefix, match } = props
  const params = match?.params
  // 文档id
  // const id = match.params['id']
  // 机制组件引用
  const formComponentRef = useRef<any>()
  const lbpmComponentRef = useRef<any>()
  const rightComponentRef = useRef<any>()
  const [flowData, setFlowData] = useState<any>({}) // 流程数据
  const [roleArr, setRoleArr] = useState<any>([])   // 流程角色
  useEffect(() => {
    mk.on('SYS_LBPM_AUDIT_FORM_INIT_DATA', (val) => {
      val?.roles && setRoleArr(val.roles)
    })
  }, [])
  const hasDraftBtn = useMemo(() => {
    const status = data?.fdProcessStatus || getFlowStatus(flowData)
    /* 新建文档和草稿有暂存按钮 */
    return status === ESysLbpmProcessStatus.DRAFT || status === ESysLbpmProcessStatus.REJECT || status === ESysLbpmProcessStatus.WITHDRAW
  }, [data?.fdProcessStatus, flowData])
  // 校验
  const _validate = async (isDraft: boolean) => {
    // 表单校验
    if (formComponentRef.current && !isDraft) {
      const formErrors = await formComponentRef.current.validate()
      if (formErrors?.length > 0 && !isDraft) {
        return false
      }
    }
    // 流程校验
    if (lbpmComponentRef.current) {
      const lbpmErrors = await lbpmComponentRef.current.getErrors()
      if (lbpmErrors?.length > 0 && !isDraft) {
        return false
      }
    }
    return true
  }

  // 提交数据封装
  const _formatValue = async (isDraft: boolean) => {
    let values = {
      ...data,
      // 操作状态
      docOperation: isDraft ? '10' : '20',
      //  机制数据
      mechanisms: {
        ...data.mechanisms || {},
        // sys-xform、lbpmProcess、sys-right、……
      } as { [key: string]: any }
    }
    // 表单机制数据
    if (formComponentRef.current) {
      const formValues = await formComponentRef.current.getValue() || {}
      values = {
        ...values,
        ...formValues
      }
    }
    // 流程机制数据
    if (lbpmComponentRef.current) {
      values.mechanisms['lbpmProcess'] = await lbpmComponentRef.current.getValue(isDraft)
    }
    // 权限机制数据
    if (rightComponentRef.current) {
      values.mechanisms['sys-right'] = await rightComponentRef.current?.getValue(isDraft)
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
    // 提交前流程预处理
    if (lbpmComponentRef.current && isDraft) {
      await lbpmComponentRef.current.checkSaveStatus?.()
    }
    return true
  }

  // 提交/暂存通用逻辑
  const handleSave = async (isDraft: boolean) => {
    // 校验文档
    if (await _validate(isDraft) === false) {
      return
    }
    // 拼装提交数据
    const values = await _formatValue(isDraft)
    // 文档提交前事件
    if (await _beforeSave(isDraft) === false) {
      return
    }
    console.log('values5559v', values)
    const saveApi = isDraft ?
      api.save
      : (values.fdProcessStatus === ESysLbpmProcessStatus.WITHDRAW
        || values.fdProcessStatus === ESysLbpmProcessStatus.DRAFT
        ? api.update : api.save)
    // 编辑暂存
    saveApi({
      ...values,
      cmsStaffReviewDetail: values?.cmsStaffReviewDetail?.values || undefined
    }).then(res => {
      if (res.success) {
        Message.success(isDraft ? '暂存成功' : '提交成功', 1, () => {
          history.goBack()
        })
      } else {
        Message.error(isDraft ? '暂存失败' : '提交失败', 1)
      }
    }).catch(() => {
      Message.error(isDraft ? '暂存失败' : '提交失败', 1)
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
  // 提交按钮
  const _btn_submit = useMemo(() => {
    const submitBtn = <Button type='primary' onClick={() => handleSave(false)}>提交</Button>
    if (roleArr && roleArr.length) {
      return submitBtn
    } else {
      return null
    }
  }, [data, flowData, params])

  // 暂存按钮
  const _btn_draft = useMemo(() => {
    if (
      !flowData ||
      lbpmComponentRef.current?.checkOperationTypeExist?.(flowData?.identity, EOperationType.drafter_cancelDraftCooperate)
    ) return null
    const draftBtn = <Button type='primary' onClick={() => handleSave(true)}>暂存</Button>
    //  新建文档和草稿有暂存按钮, 当流程布局是底部卡片时，顶部不显示暂存按钮
    return hasDraftBtn ? draftBtn : null
  }, [hasDraftBtn, data, flowData, params])

  // 删除按钮
  const _btn_delete = useMemo(() => {
    const status = getFlowStatus(flowData)
    const deleteBtn = <Button type='default' onClick={handleDelete}>删除</Button>
    return (
      // 如果有回复协同的操作，则要校验权限
      status === ESysLbpmProcessStatus.DRAFT && !lbpmComponentRef.current.checkOperationTypeExist(flowData.identity, EOperationType.handler_replyDraftCooperate)
        ? deleteBtn
        : <Auth.Auth
          authURL='/cmsStaffReview/delete'
          authModuleName='cms-out-manage'
          params={{
            vo: { fdId: params['id'] }
          }}>
          {deleteBtn}
        </Auth.Auth>
    )
  }, [flowData, params])
  return (
    <div className={`${baseCls}`}>
      <div className='lui-approve-template'>
        {/* 操作区 */}
        <div className='lui-approve-template-header'>
          <Breadcrumb>
            <Breadcrumb.Item>项目管理</Breadcrumb.Item>
            <Breadcrumb.Item>编辑</Breadcrumb.Item>
          </Breadcrumb>
          <div className='buttons'>
            {_btn_submit}
            {_btn_draft}
            {_btn_delete}
          </div>
        </div>
        {/* 内容区 */}
        <div className='lui-approve-template-content'>
          <div className='left'>
            {/* 表单信息 */}
            <div className='form'>
              <XForm formRef={formComponentRef} value={data || {}} />
            </div>
            {/* 机制页签 */}
            <div className='tabs'>
              <LBPMTabs
                fdId={data?.fdTemplate?.fdId}
                processId={data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId}
                getFormValue={() => formComponentRef.current && formComponentRef.current.getValue()}
                extra={[
                  {
                    key: 'right',
                    name: '权限管理',
                    children: (
                      <RightFragment
                        wrapperRef={rightComponentRef}
                        hasFlow={true}
                        mechanism={data?.mechanisms && data?.mechanisms['sys-right']}
                        getFormValue={() => formComponentRef.current && formComponentRef.current.getValue()} />
                    )
                  }
                ]} />
            </div>
          </div>
          <div className='right'>
            {/* 审批操作 */}
            <div className='lui-approve-template-main'>
              <LBPMFormFragment
                auditType={data.fdProcessStatus === '20' ? 'baseInfo' : 'audit'}
                onChange={(v) => setFlowData(v)}
                mode='edit'
                approveLayout='right'
                wrappedComponentRef={lbpmComponentRef}
                moduleCode='cms-out-manage-review'
                mechanism={{
                  formId: data?.fdTemplate?.fdId,
                  processTemplateId: data?.mechanisms && data.mechanisms['lbpmProcess']?.fdTemplateId,
                  processId: data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
                }}
                getFormValue={() => formComponentRef.current && formComponentRef.current.getValue()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content