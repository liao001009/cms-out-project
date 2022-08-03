import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react'
import { Auth, Module } from '@ekp-infra/common'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Loading, Breadcrumb, Button, Message, Modal, Tabs } from '@lui/core'
import XForm from './form'
import api from '@/api/cmsProjectDemand'
import './index.scss'
import { EOperationType, ESysLbpmProcessStatus } from '@/utils/status'
import { getFlowStatus } from '@/desktop/shared/util'
//@ts-ignore
import Status, { EStatusType } from '@elements/status'
import { fmtMsg } from '@ekp-infra/respect'
import apiLbpm from '@/api/cmsLbpm'
import apiSelectInfo from '@/api/cmsProjectSelectInfo'
import Axios from 'axios'
import { cmsProjectInterviewList, cmsProjectWrittenList, projectSelectInfocolumns, staffReviewColumns } from '../../common/common'
import apiTemplate from '@/api/cmsStaffReviewTemplate'
import apiStaffReviewList from '@/api/cmsStaffReview'
import apiProjectInterview from '@/api/cmsProjectInterview'
import apiProjectWritten from '@/api/cmsProjectWritten'
import apiOrder from '@/api/cmsOrderResponse'
import EditTable from '@/desktop/components/cms/EditTable'
const { TabPane } = Tabs

Message.config({ maxCount: 1 })
// 流程页签
const LBPMTabs = Module.getComponent('sys-lbpm', 'LBPMTabs', { loading: <Loading /> })
// 流程机制
const LBPMFormFragment = Module.getComponent('sys-lbpm', 'LBPMFormFragment', { loading: <Loading /> })
// 权限机制
const RightFragment = Module.getComponent('sys-right', 'RightFragment', { loading: <Loading /> })

const CmsListView = Module.getComponent('cms-out-manage', 'CmsListView', { loading: <Loading /> })

const { confirm } = Modal

const baseCls = 'project-demand-content'

const Content: React.FC<IContentViewProps> = props => {
  const { data, match, history } = props
  const params = match?.params as any

  // 模板id
  const templateId = useMemo(() => {
    return data?.fdTemplate?.fdId
  }, [data])
  // 机制组件引用
  const formComponentRef = useRef<any>()
  const lbpmComponentRef = useRef<any>()
  const rightComponentRef = useRef<any>()

  const [flowData, setFlowData] = useState<any>({}) // 流程数据
  const [roleArr, setRoleArr] = useState<any>([])   // 流程角色
  const [materialVis, setMaterialVis] = useState<boolean>(true)
  // const [orderTabsVisible, setOrderVisible] = useState<boolean>(false)
  /**外包人员评审模板 */
  const [templateData, setTemplateData] = useState<any>({})
  /**订单响应详情列表 */
  const [orderDetailList, setOrderDetailList] = useState<any>({})
  const getOrderDetail = async () => {
    try {
      const res = await apiOrder.listOrderDetail({
        conditions: {
          'fdMain.fdProjectDemand.fdId': {
            '$eq': params.id
          }
        }
      })
      setOrderDetailList(res.data)
      console.log('res5559res', res.data)
    } catch (error) {

    }
  }
  /** 获取资料上传节点 */
  const getCurrentNode = async () => {
    try {
      const nodeInfosData = await apiLbpm.getCurrentNodeInfo({
        processInstanceId: data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
      })
      const url = mk.getSysConfig('apiUrlPrefix') + '/cms-out-manage/cmsOutManageCommon/loadNodeExtendPropertiesOnProcess'
      const processData = await Axios.post(url, {
        fdId: data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
      })
      if (nodeInfosData.data.currentNodeCards.length || processData.data.length) {
        const newArr = processData.data.filter(item => {
          return nodeInfosData.data.currentNodeCards.find(item2 => item.nodeId === item2.fdNodeId && item2.fdCurrentHandlers.some(item3 => item3.id === mk.getSysConfig('currentUser').fdId))
        })
        setMaterialVis(newArr.length ? newArr[0].extendProperty.supplierApprove === 'false' ? false : true : false)
      } else {
        setMaterialVis(false)
      }
    } catch (error) {
      console.error('errortest2', error)
      setMaterialVis(false)
    }
  }
  useEffect(() => {
    getCurrentNode()
    mk.on('SYS_LBPM_AUDIT_FORM_INIT_DATA', (val) => {
      val?.roles && setRoleArr(val.roles)
    })
    loadTemplateData()
    getOrderDetail()
  }, [])

  const loadTemplateData = async () => {
    try {
      const res = await apiTemplate.list({
        //@ts-ignore
        sorts: { fdCreateTime: 'desc' },
        columns: ['fdId', 'fdName', 'fdCode', 'fdCreator', 'fdCreateTime'],
      })
      setTemplateData(res?.data?.content[0])
    } catch (error) {
      console.error(error)
    }
  }
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
    // 提交
    api.update({
      ...values,
      fdFrame: values.fdFrame,
      cmsProjectDemandWork: values.cmsProjectDemandWork && values.cmsProjectDemandWork.values || undefined,
      cmsProjectDemandDetail: values.cmsProjectDemandDetail && values.cmsProjectDemandDetail.values || undefined,
      cmsProjectDemandSupp: values.cmsProjectDemandSupp && values.cmsProjectDemandSupp.values || undefined,
      cmsProjectDemandOrder: values.cmsProjectDemandOrder && values.cmsProjectDemandOrder.values || undefined,
    }).then(res => {
      if (res.success) {
        Message.success(isDraft ? '暂存成功' : '提交成功', 1, () => {
          if (window.opener) {
            window.close()
            return
          }
          history.goBack()
        })
      } else {
        Message.error(isDraft ? '暂存失败' : '提交失败', 1)
      }
    }).catch(() => {
      Message.error(isDraft ? '暂存失败' : '提交失败', 1)
    })
  }

  // 关闭
  const handleClose = useCallback(() => {
    if (window.opener) {
      window.close()
      return
    }
    history.goBack()
  }, [])


  const handleEdit = useCallback(() => {
    history.goto(`/cmsProjectDemand/edit/${data.fdId}`)
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

  const handleOrder = useCallback(() => {
    history.goto(`/cmsOrderResponse/add/${data.fdId}`)
  }, [history])


  const handleEnterWritten = useCallback(() => {
    history.goto(`/cmsProjectWritten/add/${data.fdId}`)
  }, [history])

  const handleEnterInterview = useCallback(() => {
    history.goto(`/cmsProjectInterview/add/${data.fdId}`)
  }, [history])

  const handleEnterSelectInfo = useCallback(() => {
    history.goto(`/cmsProjectSelectInfo/add/${data.fdId}`)
  }, [history])

  const handleEnterStaffReview = useCallback(() => {
    history.goto(`/cmsStaffReview/add/${templateData.fdId}/${data.fdId}`)
  }, [history, templateData])
  // 提交按钮
  const _btn_submit = useMemo(() => {
    const submitBtn = <Button type='primary' onClick={() => handleSave(false)}>提交</Button>
    if (roleArr && roleArr.length) {
      return submitBtn
    } else {
      return null
    }
  }, [data, flowData, params])



  // 编辑按钮
  const _btn_edit = useMemo(() => {
    const status = data.fdProcessStatus || getFlowStatus(flowData)
    if (status === ESysLbpmProcessStatus.ABANDONED || status === ESysLbpmProcessStatus.COMPLETED) return null
    const editBtn = <Button onClick={handleEdit}>编辑</Button>
    const authEditBtn = <Auth.Auth
      authURL='/cmsProjectDemand/edit'
      authModuleName='cms-out-manage'
      params={{
        vo: { fdId: params['id'] }
      }}
    >
      {editBtn}
    </Auth.Auth>
    return (
      status === ESysLbpmProcessStatus.DRAFT || status === ESysLbpmProcessStatus.REJECT || status === ESysLbpmProcessStatus.WITHDRAW)
      ? authEditBtn
      // 流程流转中并且有编辑权限，可编辑表单
      : (status === ESysLbpmProcessStatus.ACTIVATED
        && authEditBtn
      )
  }, [params, data])

  // 删除按钮
  const _btn_delete = useMemo(() => {
    const status = getFlowStatus(flowData)
    const deleteBtn = <Button type='default' onClick={handleDel}>删除</Button>
    return (
      // 如果有回复协同的操作，则要校验权限
      status === ESysLbpmProcessStatus.DRAFT && !lbpmComponentRef.current.checkOperationTypeExist(flowData.identity, EOperationType.handler_replyDraftCooperate)
        ? deleteBtn
        : <Auth.Auth authURL='/cmsProjectDemand/delete'
          authModuleName='cms-out-manage'
          params={{
            vo: { fdId: params['id'] }
          }}>
          {deleteBtn}
        </Auth.Auth>
    )
  }, [flowData, params])
  const staffReviewParams = {
    conditions: {
      'fdProjectDemand.fdId': {
        '$eq': data.fdId
      }
    },
    sorts: { fdCreateTime: 'desc' }
  }
  const staffReviewRoute = '/cmsStaffReview/view'

  const handleChangePage = async (v) => {
    try {
      const res = await apiOrder.listOrderDetail({
        conditions: {
          'fdMain.fdProjectDemand.fdId': {
            '$eq': params.id
          }
        },
        ...v
      })
      setOrderDetailList(res.data)
    } catch (error) {

    }
  }
  const handleSaveOrder = async (v) => {
    console.log('v5559v', v)
    const params = {
      fdId: v.fdMain.fdId,
      cmsOrderDetail: [
        {
          fdId: v.fdId,
          fdRemarks: v?.fdRemarks || '',
          fdIsQualified: v?.fdIsQualified
        }
      ]
    }
    try {
      //@ts-ignore
      const res = await apiOrder.updateDetail(params)
      console.log('resv5559v', res)
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <Auth.Auth
      authURL='/cmsProjectDemand/get'
      authModuleName='cms-out-manage'
      params={{ vo: { fdId: params['id'] } }}
      unauthorizedPage={
        <Status type={EStatusType._403} title='抱歉，您暂无权限访问当前页面' />
      }
    >
      <div className={baseCls}>
        <div className='lui-approve-template'>
          {/* 操作区 */}
          <div className='lui-approve-template-header'>
            <Breadcrumb>
              <Breadcrumb.Item>项目管理</Breadcrumb.Item>
              <Breadcrumb.Item>查看</Breadcrumb.Item>
            </Breadcrumb>
            <div className='buttons'>
              {_btn_submit}
              {_btn_edit}
              {_btn_delete}
              <Button type='default' onClick={handleEnterSelectInfo}>{fmtMsg(':menu.!{mctpwprd794p}', '发布中选信息')}</Button>
              <Button type='default' onClick={handleEnterWritten}>{fmtMsg(':cmsProjectWritten.form.!{l5hz6ugsxfxlg2nyfs7}', '录入笔试成绩')}</Button>
              <Button type='default' onClick={handleEnterInterview}>{fmtMsg(':cmsProjectInterview.form.!{l5hz6ugsxfxlg2nyfs7}', '录入面试成绩')}</Button>
              <Button type='default' onClick={handleEnterStaffReview}>{fmtMsg(':cmsProjectInterview.form.!{l5j0eriwqaq645oi9c}', '外包人员评审')}</Button>
              <Button type='default' onClick={handleOrder}>订单响应</Button>
              <Button type='default' onClick={handleClose}>关闭</Button>
            </div >
          </div >
          {/* 内容区 */}
          <div className='lui-approve-template-content' >
            <div className='left'>
              {/* 表单信息 */}
              <div className='form'>
                <XForm formRef={formComponentRef} value={data || {}} materialVis={materialVis} />
              </div>
              <div className='lui-btns-tabs'>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="笔试" key="1">
                    <CmsListView
                      apiRequest={apiProjectWritten.listWritten}
                      columns={cmsProjectWrittenList}
                      params={staffReviewParams}
                      onRowUrl={'/cmsProjectWritten/view/'}
                    />
                  </TabPane>
                  <TabPane tab="面试" key="2">
                    <CmsListView
                      apiRequest={apiProjectInterview.listInterview}
                      columns={cmsProjectInterviewList}
                      params={staffReviewParams}
                      onRowUrl={'/cmsProjectInterview/view/'}
                    />
                  </TabPane>
                  <TabPane tab="外包人员评审" key="3" >
                    <CmsListView
                      apiRequest={apiStaffReviewList.listStaffReview}
                      columns={staffReviewColumns}
                      params={staffReviewParams}
                      onRowUrl={staffReviewRoute}
                    />
                  </TabPane>
                  <TabPane tab="中选信息" key="4">
                    <CmsListView
                      history={history}
                      params={staffReviewParams}
                      apiRequest={apiSelectInfo.listSelectInfo}
                      columns={projectSelectInfocolumns}
                      onRowUrl={'/cmsProjectSelectInfo/view/'}
                    />
                  </TabPane>
                  <TabPane tab="订单响应" key="5">
                    <EditTable
                      data={orderDetailList}
                      onChange={(v) => handleSaveOrder(v)}
                      changePage={(v) => { handleChangePage(v) }}
                    />
                  </TabPane>
                </Tabs>
              </div>
              {/* 机制页签 */}
              <div className='tabs'>
                <LBPMTabs
                  fdId={templateId}
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
                  auditType={data.fdProcessStatus === '30' ? 'baseInfo' : 'audit'}
                  mode='view'
                  approveLayout='right'
                  wrappedComponentRef={lbpmComponentRef}
                  moduleCode='cms-out-manage-demand'
                  onChange={(v) => setFlowData(v)}
                  mechanism={{
                    formId: templateId,
                    processTemplateId: data?.mechanisms && data.mechanisms['lbpmProcess']?.fdTemplateId,
                    processId: data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
                  }}
                  getFormValue={() => formComponentRef.current && formComponentRef.current.getValue()} />
              </div>
            </div>
          </div>
        </div >
      </div >
    </Auth.Auth >
  )
}

export default Content