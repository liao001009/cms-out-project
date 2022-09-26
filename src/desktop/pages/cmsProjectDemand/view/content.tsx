import api from '@/api/cmsProjectDemand'
import { getFlowStatus } from '@/desktop/shared/util'
import { EOperationType, ESysLbpmProcessStatus } from '@/utils/status'
import { Auth, Module } from '@ekp-infra/common'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Button, Loading, Message, Modal, Tabs } from '@lui/core'
import React, { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import XForm from './form'
import apiLbpm from '@/api/cmsLbpm'
import apiOrder from '@/api/cmsOrderResponse'
import apiProjectInterview from '@/api/cmsProjectInterview'
import apiSelectInfo from '@/api/cmsProjectSelectInfo'
import apiProjectWritten from '@/api/cmsProjectWritten'
import apiStaffReviewList from '@/api/cmsStaffReview'
import apiTemplate from '@/api/cmsStaffReviewTemplate'
import apiAuth from '@/api/sysAuth'
import apiProjectTemplate from '@/api/cmsProjectSelectInfoTemplate'
import { fmtMsg } from '@ekp-infra/respect'
//@ts-ignore
import Status, { EStatusType } from '@elements/status'
import Icon from '@lui/icons'
import Axios from 'axios'
import {
  cmsProjectInterviewList,
  cmsProjectWrittenList,
  projectSelectInfocolumns,
  staffReviewColumns
} from '../../common/common'
import EditTable from './editTable/EditTable'
import { useMkSendData } from '@/utils/mkHooks'
import { cmsHandleBack } from '@/utils/routerUtil'
import { exportTable, roleAuthCheck } from '@/desktop/shared/util'
import apiSupplier from '@/api/cmsSupplierInfo'
const { TabPane } = Tabs

Message.config({ maxCount: 1 })
const LbpmFormWithLayout = Module.getComponent('sys-lbpm', 'LbpmFormWithLayout', { loading: <React.Fragment></React.Fragment> })
const CmsListView = Module.getComponent('cms-out-manage', 'CmsListView', { loading: <Loading /> })

const { confirm } = Modal

const baseCls = 'project-demand-content'

const Content: React.FC<IContentViewProps> = memo((props) => {
  const { data, match, history } = props
  const params = match?.params as any
  // 模板id
  const templateId = useMemo(() => {
    return data?.fdTemplate?.fdId
  }, [data])
  // 附加按钮显示
  const btnStatus = useMemo(() => {
    return data.fdProcessStatus === '30'
  }, [data])

  // 机制组件引用
  const formComponentRef = useRef<any>()
  const lbpmComponentRef = useRef<any>()
  const rightComponentRef = useRef<any>()

  // 流程数据
  const [flowData, setFlowData] = useState<any>({})
  // 资料上传节点是否显示
  const [materialVis, setMaterialVis] = useState<boolean>(true)
  /**外包人员评审模板 */
  const [staffTemplateData, setStaffTemplateData] = useState<any>({})
  // 发布中选信息模板
  const [projectTemplateData, setProjectTemplateData] = useState<any>({})
  // 订单响应列表数据
  const orderDetailList = useRef<any>()
  // 订单响应提交按钮的显隐
  const [saveBtnVisible, setSaveBtnVisible] = useState<boolean>(btnStatus)
  // 订单响应路由跳转
  const [orderRouterStatus, setOrderRouterStatus] = useState<string>('')
  const [exportDisabled, setExportDisabled] = useState<boolean>(false)
  /**需要导出的订单响应列表数据 */
  const exportOrderData = useRef<any>({})
  // 发布供应商是否显示
  const [fdSuppliesVisible, setFdSuppliesVisible] = useState<boolean>(false)
  // 导出权限
  const [exportRole, setExportRole] = useState<boolean>(false)

  // 当前登录人的id
  const userId = mk.getSysConfig().currentUser.fdId

  // 当前登录人是否是框架管理员
  const editFlag = useMemo(() => {
    return userId === data.fdFrameAdmin.fdId
  }, [data?.fdFrameAdmin?.fdId])

  // 获取是否有导出订单响应列表的权限
  const getExportRole = async () => {
    const role = await roleAuthCheck([{
      status: 'checking',
      key: 'auth0',
      role: 'ROLE_CMSOUTPROJECTDEMAND_ORDERWEXPORT'
    },])
    setExportRole(role)
  }
  // 获取是否有外包人员评审和发布中选信息的权限
  const getAuth = async () => {
    try {
      const res = await apiAuth.roleCheck([
        {
          status: 'checking',
          key: 'auth0',
          role: 'ROLE_CMSOUTPROJECTDEMAND_STAFFREVIEW'
        },
        {
          status: 'checking',
          key: 'auth1',
          role: 'ROLE_CMSOUTPROJECTDEMAND_RELEASE'
        }
      ])
      const { auth0, auth1 } = res.data
      if (auth0) {
        await loadTemplateData({
          sorts: { fdCreateTime: 'desc' },
          columns: ['fdId', 'fdName', 'fdCode', 'fdCreator', 'fdCreateTime'],
        }, apiTemplate.list, setStaffTemplateData)
      }
      if (auth1) {
        await loadTemplateData({
          sorts: {
            fdCreateTime: 'desc'
          },
          columns: ['fdId', 'fdName', 'fdCode', 'fdCreator', 'fdCreateTime']
        }, apiProjectTemplate.list, setProjectTemplateData)
      }
    } catch (error) {
      Message.error(error.response.data.msg || '请求失败')
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
      setMaterialVis(false)
    }
  }
  useEffect(() => {
    getCurrentNode()
    getOrderRouterStatus()
    getSupplierStatus()
    getExportRole()
    getAuth()
  }, [])

  // 判断当前登录人是不是供应商管理员
  const getSupplierStatus = async () => {
    const res = await apiSupplier.list({ conditions: { 'fdAdminElement.fdId': { '$eq': userId } } })
    setFdSuppliesVisible(!!res.data.content.length)
  }
  // 点击订单响应的跳转路由地址
  const getOrderRouterStatus = async () => {
    try {
      const res = await apiOrder.listOrder({ conditions: { 'fdSupplier.fdAdminElement.fdId': { '$eq': userId }, 'fdProjectDemand.fdId': { '$eq': data.fdId } } })
      res.data.content.length && setOrderRouterStatus(res.data.content[0].fdId)
    } catch (error) {
      console.log('error', error)
    }
  }


  // 获取模板
  const loadTemplateData = async (params: any, api: any, func: Function) => {
    try {
      const res = await api(params)
      func(res?.data?.content[0])
    } catch (error) {
      Message.error(error.response.data.msg || '获取模板失败')
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

  // 订单响应点击
  const handleOrderAction = () => {
    if (data.fdResponseTime < new Date().getTime()) {
      Message.error('已超过订单响应时间')
      return
    }
    orderRouterStatus ? history.goto(`/cmsOrderResponse/edit/${orderRouterStatus}`) : history.goto(`/cmsOrderResponse/add/${data.fdId}`)
  }
  // 订单响应按钮
  const handleOrder = useCallback(() => {
    if (!btnStatus) return null
    if (data.fdProcessFlag && data.fdProcessFlag.includes('2')) return null
    return {
      name: '订单响应',
      action: () => { handleOrderAction() },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsOrderResponse/add',
      }
    }
  }, [history, orderRouterStatus, data?.fdProcessFlag, btnStatus])

  const handleEnterWritten = useCallback(() => {
    if (!btnStatus || !data.fdProcessFlag) return null
    if (data.fdProcessFlag && !(data.fdProcessFlag.includes('1') && !data.fdProcessFlag.includes('4'))) return null
    return {
      name: fmtMsg(':cmsProjectWritten.form.!{l5hz6ugsxfxlg2nyfs7}', '录入笔试成绩'),
      action: () => { history.goto(`/cmsProjectWritten/add/${data.fdId}`) },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsProjectWritten/add',
      }
    }
  }, [history, data?.fdProcessFlag, btnStatus])

  const handleEnterInterview = useCallback(() => {
    if (!btnStatus || !data.fdProcessFlag) return null
    if (data.fdProcessFlag && !(data.fdProcessFlag.includes('1') && !data.fdProcessFlag.includes('4'))) return null
    return {
      name: fmtMsg(':cmsProjectInterview.form.!{l5hz6ugsxfxlg2nyfs7}', '录入面试成绩'),
      action: () => { history.goto(`/cmsProjectInterview/add/${data.fdId}`) },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsProjectInterview/add',
      }
    }
  }, [history, data?.fdProcessFlag])
  const handleEnterSelectInfo = useCallback(() => {
    if (!btnStatus || !data.fdProcessFlag) return null
    if (data.fdProcessFlag && !(data.fdProcessFlag.includes('4') && !data.fdProcessFlag.includes('5'))) return null
    return {
      name: fmtMsg(':menu.!{mctpwprd794p}', '发布中选信息'),
      action: () => {
        if (!projectTemplateData) {
          Message.error('请先配置模板', 1)
          return
        }
        history.goto(`/cmsProjectSelectInfo/add/${projectTemplateData.fdId}/${data.fdId}`)
      },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsProjectSelectInfo/add',
      }
    }
  }, [history, projectTemplateData, data?.fdProcessFlag, btnStatus])
  const handleEnterStaffReview = useCallback(() => {
    if (!btnStatus || !data.fdProcessFlag) return null
    if (data.fdProcessFlag && !(data.fdProcessFlag.includes('3') && !data.fdProcessFlag.includes('5'))) return null
    return {
      name: fmtMsg(':cmsProjectInterview.form.!{l5j0eriwqaq645oi9c}', '外包人员评审'),
      action: () => {
        if (!staffTemplateData) {
          Message.error('请先配置模板', 1)
          return
        }
        history.goto(`/cmsStaffReview/add/${staffTemplateData.fdId}/${data.fdId}`)
      },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsStaffReview/add',
      }
    }
  }, [history, staffTemplateData, data?.fdProcessFlag, btnStatus])

  const handleEdit = () => {

    const authParams = {
      vo: { fdId: params['id'] }
    }
    return {
      name: '编辑',
      action: () => { history.goto(`/cmsProjectDemand/edit/${data.fdId}`) },
      auth: {
        authModuleName: 'cms-out-manage',
        authURL: '/cmsProjectDemand/edit',
        params: authParams,
      }
    }
  }

  const handleDelete = useCallback(() => {
    confirm({
      content: '确认删除此记录？',
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
        authURL: '/cmsProjectDemand/delete',
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


  const getCustomizeOperations = () => {
    const customizeOperations = [
      handleOrder(),
      handleEnterWritten(),
      handleEnterInterview(),
      handleEnterStaffReview(),
      handleEnterSelectInfo(),
      handleEdit(),
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
      moduleCode: 'cms-out-manage-demand',
      entityName,
      onChange: (value) => {
        setFlowData(value)
      },
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
      emitValue({ moduleCode: 'cms-out-manage-demand', value: false })
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
              项目管理&gt; 项目需求&gt; 查看
            </div>
          </div>
        )}
        auditFormType='fragment'
        slot={{
          form: (
            <div>
              <div className='form'><XForm formRef={formComponentRef} value={data || {}} materialVis={materialVis} editFlag={editFlag} fdSuppliesVisible={fdSuppliesVisible} /></div>
              {data.fdProcessStatus === '30' ? renderTab() : null}
            </div>
          )
        }}
        {...lbpmFormProps}
      />
    )
  }



  const staffReviewParams = {
    conditions: {
      'fdProjectDemand.fdId': {
        '$eq': data.fdId
      }
    },
    sorts: { fdCreateTime: 'desc' }
  }
  const staffReviewRoute = '/cmsStaffReview/view/'

  const handleChange = useCallback((e) => {
    orderDetailList.current = e
  }, [])

  // 从子组件获取需要导出的数据
  const handleExport = useCallback((exportData, columns, hiddenKey, selectArr) => {
    exportOrderData.current = {
      exportData, columns, hiddenKey
    }
    setExportDisabled(!selectArr.length)
  }, [exportDisabled])

  // 将数据已Excel的形式导出
  const handleExportOrder = () => {
    const { exportData, columns, hiddenKey } = exportOrderData.current
    exportTable(exportData, columns, data.fdSubject, hiddenKey)
  }

  // 保存订单响应数据
  const handleOrderDetailSave = async () => {
    const requestArr = orderDetailList.current.map(i => {
      const params = {
        fdId: i.fdMain.fdId,
        cmsOrderDetail: [
          {
            fdId: i.fdId,
            fdRemarks: i?.fdRemarks || '',
            fdIsQualified: i?.fdIsQualified
          }
        ]
      }
      return apiOrder.updateDetail(params)
    })
    const res = await Promise.all(requestArr)
    //@ts-ignore
    const success = res.every(i => i.success)
    if (success) {
      Message.success('保存成功')
    } else {
      Message.error('保存失败')
    }
  }

  const operations = useMemo(() => (
    saveBtnVisible ? (
      <Fragment>
        {
          editFlag ? <Button type='primary' style={{ marginRight: '16px' }} onClick={handleOrderDetailSave}>保存</Button> : null
        }
        {
          exportRole ? (
            <Button type='primary' style={{ marginRight: '8px' }} disabled={exportDisabled} onClick={handleExportOrder}>导出</Button>
          ) : null
        }
      </Fragment>
    ) : null
  ), [saveBtnVisible, exportDisabled, data.fdProcessStatus, editFlag])


  const renderTab = () => {
    return (
      <div className='lui-btns-tabs'>
        <Tabs defaultActiveKey="1" tabBarExtraContent={operations} onChange={(v) => setSaveBtnVisible(v === '1' && data.fdProcessStatus === '30')}>
          <TabPane tab={fdSuppliesVisible ? '外包人员信息' : '订单响应'} key="1">
            <EditTable
              editFlag={editFlag}
              param={params}
              onchange={(e) => { handleChange(e) }}
              onExport={(data, columns, hiddenKey, selectArr) => { handleExport(data, columns, hiddenKey, selectArr) }}
            />
          </TabPane>
          {
            !fdSuppliesVisible ? (
              <Fragment>
                <TabPane tab="笔试" key="2">
                  <CmsListView
                    apiRequest={apiProjectWritten.listWritten}
                    columns={cmsProjectWrittenList}
                    params={staffReviewParams}
                    onRowUrl={'/cmsProjectWritten/view/'}
                  />
                </TabPane>
                <TabPane tab="面试" key="3">
                  <CmsListView
                    apiRequest={apiProjectInterview.listInterview}
                    columns={cmsProjectInterviewList}
                    params={staffReviewParams}
                    onRowUrl={'/cmsProjectInterview/view/'}
                  />
                </TabPane>
                <TabPane tab="外包人员评审" key="4" >
                  <CmsListView
                    apiRequest={apiStaffReviewList.listStaffReview}
                    columns={staffReviewColumns}
                    params={staffReviewParams}
                    onRowUrl={staffReviewRoute}
                  />
                </TabPane>
                <TabPane tab="中选信息" key="5">
                  <CmsListView
                    history={history}
                    params={staffReviewParams}
                    apiRequest={apiSelectInfo.listSelectInfo}
                    columns={projectSelectInfocolumns}
                    onRowUrl={'/cmsProjectSelectInfo/view/'}
                  />
                </TabPane>
              </Fragment>
            ) : null
          }
        </Tabs>
      </div>
    )
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
      <div className={`${baseCls}`}>
        {renderInnerContent()}
      </div>
    </Auth.Auth>
  )
})

export default Content
