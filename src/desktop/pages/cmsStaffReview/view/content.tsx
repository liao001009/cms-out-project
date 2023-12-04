/* eslint-disable */
import api from '@/api/cmsStaffReview'
import { Auth, Module } from '@ekp-infra/common'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Button, Message, Modal } from '@lui/core'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import XForm from './form'
import { useEditBtn, useDraftBtn } from '@/desktop/shared/mkHooks'

import { ESysLbpmProcessStatus } from '@/utils/status'
//@ts-ignore
import Status, { EStatusType } from '@elements/status'
import { useMkSendData, useMater } from '@/utils/mkHooks'
import { fmtMsg } from '@ekp-infra/respect'
import Icon from '@lui/icons'
import { cmsHandleBack } from '@/utils/routerUtil'

Message.config({ maxCount: 1 })
const LbpmFormWithLayout = Module.getComponent('sys-lbpm', 'LbpmFormWithLayout', { loading: <React.Fragment></React.Fragment> })

const { confirm } = Modal
const baseCls = 'project-review-content'
const Content: React.FC<IContentViewProps> = props => {
  const { data, history, match } = props
  /** 定级 */
  const { materialVis, setMaterialVis } = useMater(data)
  const { params } = match
  // 模板id
  const templateId = useMemo(() => {
    return data?.fdTemplate?.fdId
  }, [data])


  // 机制组件引用
  const formComponentRef = useRef<any>()
  const lbpmComponentRef = useRef<any>()
  const rightComponentRef = useRef<any>()

  // 校验
  const _validate = async (isDraft: boolean) => {
    // 表单校验
    if (formComponentRef.current) {
      const formErrors = await formComponentRef.current.validate()
      if (formErrors?.length > 0 && !isDraft) {
        return false
      }
      // 流程校验
      if (lbpmComponentRef.current) {
        const lbpmErrors = await lbpmComponentRef.current.getErrors()
        if (lbpmErrors?.length > 0 && !isDraft) {
          return false
        }
      }
    }
    return true
  }

  // 提交数据封装
  const _formatValue = async (isDraft: boolean) => {
    let values = {
      ...data,
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
    const res = lbpmComponentRef.current.getOperationType()
    if (res !== 'handler_pass') {
      setMaterialVis(false)
    }
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
    if (!values.fdSubject) {
      Message.error('请填写主题')
      return
    }
    values = {
      ...values,
      cmsStaffReviewDetail: values.cmsStaffReviewDetail.values || undefined
    }
    // 将前面赋值为{}的定级给为undefined
    values.cmsStaffReviewDetail = values.cmsStaffReviewDetail.map(i => {
      if (i.fdConclusion !== '1') {
        i.fdConfirmLevel = undefined
      }
      return i
    })
    const saveApi = isDraft ? api.save : api.update

    // 编辑暂存
    saveApi(values).then(res => {
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
    // }
  }


  const handleEdit = () => {
    if (!materialVis) return

    const authParams = {
      vo: { fdId: params['id'] }
    }
    return {
      name: '编辑',
      action: () => { history.goto(`/cmsStaffReview/edit/${data.fdId}`) },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsStaffReview/edit',
        params: authParams,
      }
    }
  }
  const handleDelete = useCallback(() => {
    confirm({
      content: '确认删除此记录？',
      cancelText: '取消',
      okText: '确定',
      onOk () {
        api.delete({ fdId: data.fdId }).then(res => {
          if (res.success) {
            Message.success('删除成功')
            cmsHandleBack(history, '/cmsProjectDemand/listDemand')
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
  const handleDel = () => {

    const authParams = {
      vo: { fdId: params['id'] }
    }
    return {
      name: '删除',
      action: () => { handleDelete() },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsStaffReview/delete',
        params: authParams,
      }
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

  //暂存
  const handleDraft = () => {
    if (data.fdProcessStatus === ESysLbpmProcessStatus.COMPLETED) return
    if (!materialVis) return

    return {
      name: '暂存',
      action: () => {
        handleSave(true)
      },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsStaffReview/save',
      }
    }
  }

  const drft = useDraftBtn(data, 'cmsStaffReview', handleSave)
  const edit = useEditBtn(data, 'cmsStaffReview', params, history)
  const getCustomizeOperations = () => {
    const customizeOperations = [
      // handleEdit(),
      drft,
      handleDel(),
      // handleDraft(),
      edit,
      handleClose()
    ].filter(t => !!t)
    return customizeOperations
  }

  const renderInnerContent = () => {
    const entityName = 'com.landray.cms.out.manage.core.entity.project.CmsStaffReview'
    const processTemplateId = data?.mechanisms && data.mechanisms['lbpmProcess']?.fdTemplateId
    const processId = data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
    const lbpmFormProps = {
      auditType: data.fdProcessStatus === '30' ? 'baseInfo' : 'audit',
      approveLayout: 'rightButton',
      wrappedComponentRef: lbpmComponentRef,
      mechanism: {
        formId: templateId,
        processTemplateId: processTemplateId,
        processId: processId
      },
      formValue: {},
      getFormValue: () => formComponentRef?.current?.getValue?.(),
      moduleCode: 'cms-out-manage-review',
      entityName,
      processId: processId,
      onSubmit: () => { handleSave(false) },
      submitting: false,
      // extraOperations: extraOperations,
      // onValuesChange: handleLbpmChange,
      // submitAuth: getSubmitBtnAuth(),
      XFormComplete: true,
      customizeOperations: getCustomizeOperations(),
    }
    const { emitValue } = useMkSendData('SYS_XFORM_AUDIT_COMPLICATE_TYPE')
    useEffect(() => {
      // 告诉auditForm,非复杂表单
      emitValue({ moduleCode: 'cms-out-manage-review', value: false })
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
              项目管理&gt; 外包人员评审 &gt; 查看
            </div>
          </div>
        )}
        auditFormType='fragment'
        slot={{
          form: (
            <div>
              <div className='form'><XForm formRef={formComponentRef} value={data || {}} materialVis={materialVis} /></div>
            </div>
          )
        }}
        {...lbpmFormProps}
      />
    )
  }
  return (
    <Auth.Auth
      authURL='/cmsStaffReview/get'
      authModuleName='cms-out-manage'
      params={{ vo: { fdId: params['id'] } }}
      unauthorizedPage={
        <Status type={EStatusType._403} title='抱歉，您暂无权限访问当前页面' />
      }
    >
      <div className={`${baseCls}`}>
        {renderInnerContent()}
      </div>
    </Auth.Auth>
  )
}

export default Content
