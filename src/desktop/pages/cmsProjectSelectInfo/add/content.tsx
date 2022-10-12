import api from '@/api/cmsProjectSelectInfo'
import { useMkSendData } from '@/utils/mkHooks'
import { Module } from '@ekp-infra/common'
import { fmtMsg } from '@ekp-infra/respect'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Button, Message, Modal } from '@lui/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import XForm from './form'
import Icon from '@lui/icons'
import { cmsHandleBack } from '@/utils/routerUtil'

// import './index.scss'
Message.config({ maxCount: 1 })
const LbpmFormWithLayout = Module.getComponent('sys-lbpm', 'LbpmFormWithLayout', { loading: <React.Fragment></React.Fragment> })
const baseCls = 'project-selectInfo-content'
const Content: React.FC<IContentViewProps> = props => {
  const { data, match, history } = props
  const fdId = match.params['fdId']
  const templateId = match.params['templateId']
  // 弹窗的显隐
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  // 表单数据
  const [formValue, setFormValue] = useState<any>()
  // 机制组件引用
  const formComponentRef = useRef<any>()
  const lbpmComponentRef = useRef<any>()
  const rightComponentRef = useRef<any>()
  const [submitting, setSubmitting] = useState<boolean>(true)

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
      // 模板id
      fdTemplate: { fdId: data.fdTemplate.fdId },
      // 操作状态，10：草稿、20：提交
      docOperation: isDraft ? '10' : '20',
      //  机制数据
      mechanisms: {
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
    let values = await _formatValue(isDraft)
    // 文档提交前事件
    if (await _beforeSave(isDraft) === false) {
      return
    }
    if (values.fdSelectedSupplier.length === 0 && values.fdFailSupplier.length === 0) {
      return Message.error('落选供应商或中选供应商必须要有数据哦', 1)
    }
    const { cmsProjectStaffList } = values
    values = {
      ...values,
      fdProjectDemand: {
        fdId
      },
      cmsProjectStaffList: Array.isArray(cmsProjectStaffList) ? cmsProjectStaffList : cmsProjectStaffList.values
    }
    setFormValue({
      values,
      isDraft
    })
    const res = await api.findBudgetInfo({
      date: values.fdCreateTime,
      frameId: values.fdFrame.fdId
    })
    // 预算总额 冻结预算金额 占用预算金额
    const { totalAmount, freezeAmount, occupyAmount } = res.data
    const restAmout = totalAmount - freezeAmount - occupyAmount
    if (restAmout <= 0) {
      setModalVisible(true)
    } else {
      setModalVisible(false)
      // 提交
      api.add(values).then(res => {
        if (res.success) {
          Message.success(isDraft ? '暂存成功' : '提交成功', 1, () => {
            cmsHandleBack(history, '/cmsProjectSelectInfo/listSelectInfo')
          })
        } else {
          Message.error(isDraft ? '暂存失败' : '提交失败', 1)
        }
      }).catch(() => {
        Message.error(isDraft ? '暂存失败' : '提交失败', 1)
      })
    }
  }
  // 弹窗确认事件
  const handleOk = () => {
    setModalVisible(false)
    const { values, isDraft } = formValue
    api.add(values).then(res => {
      if (res.success) {
        Message.success(isDraft ? '暂存成功' : '提交成功', 1, () => {
          cmsHandleBack(history, '/cmsProjectSelectInfo/listSelectInfo')
        })
      } else {
        Message.error(isDraft ? '暂存失败' : '提交失败', 1)
      }
    }).catch(() => {
      Message.error(isDraft ? '暂存失败' : '提交失败', 1)
    })
  }
  //暂存
  const handleDraft = () => {
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
    cmsHandleBack(history, '/cmsProjectSelectInfo/listSelectInfo')
  }, [])

  const getCustomizeOperations = () => {
    const customizeOperations = [
      handleDraft(),
      handleClose()
    ].filter(t => !!t)
    return customizeOperations
  }
  const renderInnerContent = () => {
    const entityName = 'com.landray.cms.out.manage.core.entity.project.CmsProjectSelectInfo'
    const processTemplateId = data?.mechanisms && data.mechanisms['lbpmProcess']?.fdTemplateId
    const processId = data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
    const lbpmFormProps = {
      auditType: 'audit',
      approveLayout: 'rightButton',
      wrappedComponentRef: lbpmComponentRef,
      mechanism: {
        formId: templateId,
        processTemplateId: processTemplateId,
        processId: processId
      },
      formValue: {},
      getFormValue: () => formComponentRef?.current?.getValue?.(),
      moduleCode: 'cms-out-manage-selectInfo',
      entityName,
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
      emitValue({ moduleCode: 'cms-out-manage-selectInfo', value: false })
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
              项目管理 &gt; 发布中选信息 &gt; 新建
            </div>
          </div>
        )}
        auditFormType='fragment'
        slot={{
          form: (
            <div className='form'><XForm formRef={formComponentRef} value={data || {}} {...props} /></div>
          )
        }}
        {...lbpmFormProps}
      />
    )
  }
  return (
    <div className={`${baseCls}`}>
      {renderInnerContent()}
      <Modal
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false)
        }}
      >
        <p>预算不足了</p>
      </Modal>
    </div>
  )
}

export default Content
