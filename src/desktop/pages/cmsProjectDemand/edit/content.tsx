import api from '@/api/cmsProjectDemand'
import { Module } from '@ekp-infra/common'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Button, Message, Modal } from '@lui/core'
import { EBtnType } from '@lui/core/es/components/Button'
import Icon from '@lui/icons'
import React, { createElement as h, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import XForm from './form'
// import './index.scss'
import { ESysLbpmProcessStatus, getFlowStatus } from '@/desktop/shared/util'
import { useMkSendData } from '@/utils/mkHooks'
import { EOperationType } from '@/utils/status'
import { fmtMsg } from '@ekp-infra/respect'
import { cmsHandleBack } from '@/utils/routerUtil'

Message.config({ maxCount: 1 })
const LbpmFormWithLayout = Module.getComponent('sys-lbpm', 'LbpmFormWithLayout', { loading: <React.Fragment></React.Fragment> })

const baseCls = 'project-demand-content'

const Content: React.FC<IContentViewProps> = props => {
  const { data, match, history, routerPrefix } = props
  // 文档id
  const params = match?.params

  // 机制组件引用
  const formComponentRef = useRef<any>()
  const lbpmComponentRef = useRef<any>()
  const rightComponentRef = useRef<any>()
  const [flowData, setFlowData] = useState<any>({}) // 流程数据
  const [submitting, setSubmitting] = useState<boolean>(true)
  // const [roleArr, setRoleArr] = useState<any>([])   // 流程角色
  // useEffect(() => {
  //   mk.on('SYS_LBPM_AUDIT_FORM_INIT_DATA', (val) => {
  //     val?.roles && setRoleArr(val.roles)
  //   })
  // }, [])
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
    if (!values.fdSubject) {
      Message.error('请填写主题')
      return
    }
    const saveApi = isDraft ?
      api.save
      : (values.fdProcessStatus === ESysLbpmProcessStatus.WITHDRAW
        || values.fdProcessStatus === ESysLbpmProcessStatus.DRAFT || values.fdProcessStatus === ESysLbpmProcessStatus.REJECT
        ? api.update : api.save)
    // 编辑暂存
    saveApi({
      ...values,
      fdFrame: values.fdFrame,
      cmsProjectDemandWork: Array.isArray(values.cmsProjectDemandWork) ? values.cmsProjectDemandWork : values.cmsProjectDemandWork.values,
      cmsProjectDemandDetail: Array.isArray(values.cmsProjectDemandDetail) ? values.cmsProjectDemandDetail : values.cmsProjectDemandDetail.values,
      cmsProjectDemandSupp: Array.isArray(values.cmsProjectDemandSupp) ? values.cmsProjectDemandSupp : values.cmsProjectDemandSupp.values
    }).then(res => {
      if (res.success) {
        Message.success(isDraft ? '暂存成功' : '提交成功', 1, () => {
          cmsHandleBack(history, '/cmsProjectDemand/listDemand')
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
      cancelText: '取消',
      onOk: () => {
        api
          .delete({ fdId: data.fdId })
          .then((res) => {
            if (res.success) {
              Message.success('删除成功')
              history.goto(routerPrefix)
            }
          }).catch(error => {
            Message.error(error.response.data.msg || '删除失败')
          })
      }
    })
  }


  const handleDel = () => {
    const status = getFlowStatus(flowData)
    if (status !== ESysLbpmProcessStatus.DRAFT && lbpmComponentRef.current?.checkOperationTypeExist(flowData?.identity, EOperationType.handler_replyDraftCooperate)) return
    const authParams = {
      vo: { fdId: params['id'] }
    }
    return {
      name: '删除',
      action: () => { handleDelete() },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsProjectDemand/delete',
        params: authParams,
      }
    }
  }

  //暂存
  const handleDraft = () => {
    if (
      !flowData ||
      lbpmComponentRef.current?.checkOperationTypeExist?.(flowData?.identity, EOperationType.drafter_cancelDraftCooperate) ||
      !hasDraftBtn
    ) return null
    return {
      name: '暂存',
      action: () => { handleSave(true) }
    }
  }

  // 关闭
  const handleClose = () => {
    return {
      name: '关闭',
      action: () => { handleBack() }
    }
  }
  // 返回
  const handleBack = useCallback(() => {
    cmsHandleBack(history, '/cmsProjectDemand/listDemand')
  }, [])

  const getCustomizeOperations = () => {
    const customizeOperations = [
      handleDraft(),
      handleDel(),
      handleClose()
    ].filter(t => !!t)
    return customizeOperations
  }

  const renderInnerContent = () => {
    const entityName = 'com.landray.cms.out.manage.core.entity.project.CmsProjectDemand'
    const processTemplateId = data?.mechanisms && data.mechanisms['lbpmProcess']?.fdTemplateId
    const processId = data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
    const lbpmFormProps = {
      auditType: data.fdProcessStatus === '20' ? 'baseInfo' : 'audit',
      approveLayout: 'rightButton',
      wrappedComponentRef: lbpmComponentRef,
      mechanism: {
        formId: data?.fdTemplate?.fdId,
        processTemplateId: processTemplateId,
        processId: processId
      },
      formValue: {},
      getFormValue: () => formComponentRef?.current?.getValue?.(),
      moduleCode: 'cms-out-manage-demand',
      entityName,
      onChange: (value) => {
        setFlowData(value)
      },
      processId: processId,
      onSubmit: () => { handleSave(false) },
      submitting: submitting,
      // extraOperations: extraOperations,
      // onValuesChange: handleLbpmChange,
      // submitAuth: getSubmitBtnAuth(),
      XFormComplete: true,
      customizeOperations: getCustomizeOperations(),
    }
    const { emitValue } = useMkSendData('SYS_XFORM_AUDIT_COMPLICATE_TYPE')
    useEffect(() => {
      // 告诉auditForm,非复杂表单
      emitValue({ moduleCode: 'cms-out-manage-demand', value: false })
      setSubmitting(false)
    }, [])

    return (
      <LbpmFormWithLayout
        headerLeft={(
          <div className={`${baseCls}-header`}>
            <div className={`${baseCls}-header-backContainer`}>
              <Button className='text-theme bgc-theme-5 hover-bgc-theme-10' onClick={handleBack}>
                <Icon name='left' />
                {fmtMsg(':button.back', '返回')}
              </Button>
              项目管理&gt; 项目需求&gt; 编辑
            </div>
          </div>
        )}
        auditFormType='fragment'
        slot={{
          form: (
            <div className='form'><XForm formRef={formComponentRef} value={data || {}} /></div>
          )
        }}
        {...lbpmFormProps}
      />
    )
  }

  return (
    <div className={`${baseCls}`}>
      {renderInnerContent()}
    </div>
  )
}

export default Content
