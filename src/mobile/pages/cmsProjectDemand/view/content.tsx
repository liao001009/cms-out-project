import React, { useState, useRef, useCallback } from 'react'
import { Module } from '@ekp-infra/common'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Loading, Anchor, Toast, Modal } from '@mui/core'
import api from '@/api/cmsProjectDemand'
import XForm from './form'
import './index.scss'

// 流程审批组件
const LBPMFormFragment = Module.getComponent('sys-lbpm', 'AuditFormFragment', { loading: <Loading /> })
// 流程记录组件
const LBPMApprovalRecord = Module.getComponent('sys-lbpm', 'AuditNotes', { loading: <Loading /> })
// 流程图组件
const LBPMChart = Module.getComponent('sys-lbpm', 'AuditChartModal', { loading: <Loading /> })

const Content: React.FC<IContentViewProps> = props => {
  const { status, data, history } = props
  // 机制组件引用
  const formComponentRef = useRef<any>()
  const lbpmComponentRef = useRef<any>()
  const [lbpmChartVisible, setlbpmChartVisible] = useState<boolean>(false)

  // 校验
  const _validate = async (isDraft: boolean) => {
    // 表单校验
    if (formComponentRef.current && !isDraft) {
      const errors = await formComponentRef.current.validate()
      if (errors?.length > 0) {
        return false
      }
    }
    // 流程校验
    if (lbpmComponentRef.current) {
      const lbpmValue = lbpmComponentRef.current ? await lbpmComponentRef.current.getValue(isDraft) : null
      if (lbpmValue?.errorFields?.length) {
        return false
      }
    }
    return true
  }

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
    return values
  }

  // 提交前事件
  const _beforeSave = async (isDraft: boolean, value) => {
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

  const handleEdit = useCallback(() => {
    history.goto(`/hrAudit/edit/${data.fdId}`)
  }, [history])

  const handleDel = useCallback(() => {
    Modal.confirm({
      content: '确认删除此记录？',
      onAction: (action, index) => {
        if (index > 0) { return }
        api.delete({ fdId: data.fdId }).then(res => {
          if (res.success) {
            Toast.show({
              content: '删除成功',
              duration: 1, icon: 'success',
              afterClose: () => history.goBack()
            })
          }
        })
      }
    })
  }, [])

  // 提交/暂存通用逻辑
  const handleSave = async ({ code }) => {
    const isDraft = code === 'saveDraft'
    // 校验文档
    if (await _validate(isDraft) === false) {
      return
    }
    // 拼装提交数据
    const values = await _formatValue(isDraft)
    // 文档提交前事件
    if (await _beforeSave(isDraft, values) === false) {
      return
    }
    // 提交
    api.update(values as any).then(res => {
      if (res.success) {
        Toast.show({
          content: isDraft ? '暂存成功' : '提交成功',
          duration: 1, icon: 'success',
          afterClose: () => history.goBack()
        })
      } else {
        Toast.show({
          content: isDraft ? '暂存失败' : '提交失败',
          duration: 1,
          icon: 'fail'
        })
      }
    }).catch(() => {
      Toast.show({
        content: isDraft ? '暂存失败' : '提交失败',
        duration: 1,
        icon: 'fail'
      })
    })
    return
  }

  return status === 'loading' ? <Loading /> : (
    <div className='mui-approve-template'>
      <div className='mui-approve-template-content'>
        <Anchor>
          <Anchor.Panel index='base' title='审批详情'>
            {/* 表单信息 */}
            <div className='title'>审批详情</div>
            <div className='inner'>
              <XForm formRef={formComponentRef} value={data || {}} />
            </div>
          </Anchor.Panel>
          <Anchor.Panel index='approve' title='审批信息'>
            {/* 审批信息 */}
            <div className='title'>审批信息</div>
            <div className='inner'>
              <LBPMApprovalRecord
                lbpmLayout='right'
                processId={data?.mechanisms?.lbpmProcess?.processId || data?.mechanisms?.lbpmProcess?.fdProcessId}
                fdId={data?.fdId}
                getFormValue={() => formComponentRef.current?.getValue()} />
            </div>
          </Anchor.Panel>
        </Anchor>
      </div>
      <div className='mui-approve-template-main'>
        {/* 审批操作 */}
        <LBPMFormFragment
          wrapperRef={lbpmComponentRef}
          lbpmLayout='right'
          fdId={data?.fdId}
          mechanism={data.mechanisms && data.mechanisms['lbpmProcess']}
          doOperation={handleSave}
          customizeOperations={[
            { name: '编辑', action: handleEdit },
            { name: '删除', action: handleDel },
            { name: '流程图', icon: 'flow-chart', action: () => setlbpmChartVisible(true) }
          ]}
          getFormValue={() => formComponentRef.current?.getValue()} />
      </div>
      {/* 流程图弹窗 */}
      <LBPMChart
        mechanism={data?.mechanisms && data.mechanisms['lbpmProcess']}
        getFormValue={() => formComponentRef.current?.getValue()}
        visible={lbpmChartVisible}
        onClose={() => setlbpmChartVisible(false)} />
    </div>
  )
}

export default Content