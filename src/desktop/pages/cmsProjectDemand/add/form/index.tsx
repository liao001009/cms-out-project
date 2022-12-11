import React, { useRef, createRef, useState, useEffect, Fragment } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Form, Message, Button, ButtonGroup } from '@lui/core'
import { useApi, useSystem } from '@/desktop/shared/formHooks'
import XformAppearance from '@/desktop/components/form/XformAppearance'
import LayoutGrid from '@/desktop/components/form/LayoutGrid'
import GridItem from '@/desktop/components/form/GridItem'
import XformDescription from '@/desktop/components/form/XformDescription'
import XformFieldset from '@/desktop/components/form/XformFieldset'
import XformInput from '@/desktop/components/form/XformInput'
import XformAddress from '@/desktop/components/form/XformAddress'
import XformRadio from '@/desktop/components/form/XformRadio'
import XformDatetime from '@/desktop/components/form/XformDatetime'
import XformNumber from '@/desktop/components/form/XformNumber'
import XformDetailTable from '@/desktop/components/form/XformDetailTable'
import XformSelect from '@/desktop/components/form/XformSelect'
import XformMoney from '@/desktop/components/form/XformMoney'
import CMSXformModal from '@/desktop/components/cms/XformModal'
import { projectColumns, supplierColumns } from '@/desktop/pages/common/common'
import apiFrameInfo from '@/api/cmsFrameInfo'
import apiProject from '@/api/cmsProjectInfo'
import apiSupplier from '@/api/cmsSupplierInfo'
import apiPostInfo from '@/api/cmsPostInfo'
import apiLevelInfo from '@/api/cmsLevelInfo'
import apiProjectDemand from '@/api/cmsProjectDemand'
import apiAmount from '@/api/cmsOutSupplierAmount'
import XformExecl from '@/desktop/components/cms/XformExecl'
import Icon from '@lui/icons'

const MECHANISMNAMES = {}
import moment from 'moment'
const baseCls = 'project-demand-form'

const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectDemandWork: createRef() as any,
    cmsProjectDemandDetail: createRef() as any,
    cmsProjectDemandSupp: createRef() as any,
  })
  const { formRef: formRef, value: value } = props
  const [form] = Form.useForm()
  // 框架数据
  const [frameData, setFrameData] = useState<any>([])
  // 岗位数据
  const [postData, setPostData] = useState<any>([])
  // 选中岗位数据
  const [selectedPostData, setSelectedPostData] = useState<any>([])
  // 级别数据
  const [levelData, setLevelData] = useState<any>([])
  // 选中级别数据
  const [selectedLevelData, setSelectedLevelData] = useState<any>([])
  // 是否指定供应商单选
  const [isSuppler, setIsSuppler] = useState<boolean>(false)
  // 设计类需求子类显隐
  const [isFrameChild, setIsFrameChild] = useState<boolean>(false)
  // 供应商范围
  const [isSupplierRange, setIsSupplierRange] = useState<boolean>(false)
  // 指定供应商值
  const [assignSupplier, setAssignSupplier] = useState<string | undefined>('')
  // 选定的框架类型
  const [selectedFrame, setSelectedFrame] = useState<any>({})
  // 选好的发布供应商
  const [selectedFdSupplier, setSelectedFdSupplier] = useState<any>([])

  const [visible, setVisible] = useState<boolean>(false)
  const [errMsgArr, setErrMsgArr] = useState<any>([])
  useEffect(() => {
    init()
    getTag()
  }, [])

  const getTag = () => {
    let parentNode, addRow
    const timer = setInterval(() => {
      parentNode = document.querySelector('.cmsProjectDemandWork .ele-xform-detail-table-toolbar-right-buttons')
      const uploadDown = document.getElementById('uploadDown') || document.createElement('div')
      addRow = document.querySelector('button[title="添加行"]')
      if (parentNode && parentNode.nodeType && addRow && addRow.nodeType) {
        parentNode?.insertBefore(uploadDown, addRow)
        uploadDown.style.display = 'block'
        clearInterval(timer)
      }
    }, 1000)
  }

  const init = async () => {
    try {
      const res = await apiFrameInfo.list({ pageSize: 1000 })
      const frameArr = res.data.content.map(i => {
        const item = {
          value: i.fdId,
          label: i.fdName,
          ...i
        }
        return item
      })
      setFrameData(frameArr)
      const resPost = await apiPostInfo.list({ pageSize: 1000 })
      const postArr = resPost.data.content.map(i => {
        const item = {
          value: i.fdId,
          label: i.fdName,
          ...i
        }
        return item
      })
      setPostData(postArr)
      const resLevel = await apiLevelInfo.list({ pageSize: 1000 })
      const levelArr = resLevel.data.content.map(i => {
        const item = {
          value: i.fdId,
          label: i.fdName,
          ...i
        }
        return item
      })
      setLevelData(levelArr)
    } catch (error) {
      console.log('error', error)
    }
  }

  const getProjectDemand = async (fdId) => {
    try {
      const res = await apiProjectDemand.listDemand({
        'conditions': {
          'cmsProjectDemandSupp.fdSupplier.fdId': {
            '$eq': fdId
          }
        },
        'pageSize': 1,
        'columns': ['fdId', 'fdPublishTime', 'fdSubject', 'fdSupplies'],
        'sorts': {
          'fdPublishTime': 'desc'
        }
      })
      return res.data.content[0]
    } catch (error) {
      Message.error(error.response.data.msg || '请求失败')
    }
  }

  const getSupplierAmount = async (param) => {
    try {
      const res = await apiAmount.getSupplierAmount(param)
      return res.data?.fdSupplierAmount[0]
    } catch (error) {
      Message.error(error.response.data.msg || '请求失败')
    }
  }
  useEffect(() => {
    const newSelectPost = postData.filter(i => i.fdFrame.fdId === selectedFrame.fdId)
    const newSelectLevel = levelData.filter(i => i.fdFrame.fdId === selectedFrame.fdId)
    setSelectedLevelData(newSelectLevel)
    setSelectedPostData(newSelectPost)
  }, [selectedFrame, postData, levelData])

  const handleSetFdSupplier = (val) => {
    setAssignSupplier(val.fdName)
    setSelectedFdSupplier([])
    form.setFieldsValue({
      fdSupplies: undefined
    })
    const valuesData = sysProps.$$form.current.getFieldsValue('cmsProjectDemandSupp').values
    valuesData.length && detailForms.current.cmsProjectDemandSupp.current.deleteAll()
  }

  const handleChangeSupplier = async (v) => {
    setSelectedFdSupplier(v)
    // 给明细表默认加行数并赋值默认数据
    const valuesData = sysProps.$$form.current.getFieldsValue('cmsProjectDemandSupp').values
    const newSelectSupplierFdId = v.map(i => i.fdId)
    const newSelectedSupplierFdId = valuesData.map(i => i.fdSupplier.fdId)
    if (newSelectSupplierFdId.sort().toString() === newSelectedSupplierFdId.sort().toString()) return
    valuesData.length && detailForms.current.cmsProjectDemandSupp.current.deleteAll()
    const requestArr = v.map(i => getProjectDemand(i.fdId))
    const res = await Promise.all(requestArr)
    const newData = v.map(item => {
      res.forEach(k => {
        //@ts-ignore
        const newItem = k?.fdSupplies.filter(s => s.fdId === item.fdId) || []
        if (newItem.length) {
          //@ts-ignore
          item.fdPublishTime = k.fdPublishTime
        }
      })
      return item
    })
    if (selectedFrame && newData?.length) {
      const resquestAmountArr = v.map(i => {
        const year = moment(new Date()).year()
        const fdBeginDate = moment(`${year}-01-01`).valueOf()
        const fdEndDate = moment(`${year}-12-31`).valueOf()
        const param = {
          fdBeginDate,
          fdEndDate,
          fdSupplier: [{ fdId: i.fdId }],
          fdFrame: [{ ...selectedFrame }]
        }
        return getSupplierAmount(param)
      })
      let amountRes: any[] = await Promise.all(resquestAmountArr)
      amountRes = amountRes.filter(i => i)
      if (amountRes.length) {
        newData.forEach((i: any) => {
          amountRes.forEach((k: any) => {
            //@ts-ignore
            if (k.fdShare) {
              //@ts-ignore
              if (k.fdSupplierId === i.fdId) {
                //@ts-ignore
                i.fdAnnualRatio = k.fdShare
              }
            }
          })
        })
      }
    }
    setTimeout(() => {
      newData.length && detailForms.current.cmsProjectDemandSupp.current.updateValues(newData.map(item => ({
        fdFrame: item.fdFrame,
        fdLastTime: item.fdPublishTime,
        fdAnnualRatio: item?.fdAnnualRatio,
        fdSupplier: { ...item }
      })))
    }, 0)
  }

  const handleProject = (v) => {
    setIsFrameChild(v.fdFrame.fdName === '设计类')
    setSelectedFrame(v.fdFrame)
    setSelectedFdSupplier([])
    form.setFieldsValue({
      fdInnerLeader: v.fdInnerPrincipal,
      fdProjectNum: v.fdCode,
      fdBelongDept: v.fdBelongDept,
      fdProjectLeader: v.fdProjectPrincipal,
      fdBelongTeam: v.fdBelongTeam,
      fdFrame: v.fdFrame,
      fdSupplier: undefined,
      fdProjectNature: v.fdProjectNature,
      fdSupplies: undefined
    })
    detailForms.current.cmsProjectDemandSupp.current.deleteAll()
    setAssignSupplier(undefined)
  }


  const uploadExec = () => {
    setVisible(true)
  }

  const downloadExecl = () => {
    window.open(mk.getResourcePath('@module:cms-out-project/desktop/static/attach/work.xlsx'), '_blank')
  }

  const handlerChange = (info) => {
    //@ts-ignore
    const array: any[] = Object.values(info).flat(Infinity)
    setDetailData(array)
  }
  const setDetailData = (data) => {
    const valuesData = sysProps.$$form.current.getFieldsValue('cmsProjectDemandWork').values
    valuesData.length && detailForms.current.cmsProjectDemandWork.current.deleteAll()
    const errMsg: any[] = []
    if (data.length > 0) {
      const newData = data.map(i => {
        const item = {}
        Object.keys(i).forEach(k => {
          item[k.split('/')[1]] = i[k]
        })
        return item
      })
      newData.forEach((i, index) => {
        if (!i.fdTaskName) {
          errMsg.push(`第${index + 1}条数据的‘任务’没有填写`)
        }
        if (!i.fdCostApproval) {
          errMsg.push(`第${index + 1}条数据的‘费用核定(万元)’没有填写`)
        }
        if (i.fdCostApproval < 0) {
          errMsg.push(`第${index + 1}条数据的‘费用核定(万元)’的数字小于0`)
        }
      })
      if (!errMsg.length) {
        detailForms.current.cmsProjectDemandWork.current.updateValues(newData)
        setErrMsgArr([])
        handleCancel()
      } else {
        setErrMsgArr(errMsg)
      }
    }
  }
  const handleCancel = () => {
    setVisible(false)
  }
  // 对外暴露接口
  useApi({
    form,
    formRef,
    value,
    MECHANISMNAMES
  })
  // 内置$$form对象，组件间的内部调用， 长度校验规则，此逻辑禁止移除与修改
  const { onValuesChange, lengthValidator, ...sysProps } = useSystem({
    props,
    form,
    detailForms
  })

  return (
    <div className={baseCls}>
      <div className="lui-xform">
        <Form form={form} colPadding={false} onValuesChange={onValuesChange}>
          <XformAppearance>
            <LayoutGrid columns={40} rows={19}>
              <GridItem
                column={1}
                row={1}
                style={{
                  textAlign: 'center',
                  justifyContent: 'center'
                }}
                rowSpan={1}
                columnSpan={40}
              >
                <XformFieldset compose={true}>
                  <Form.Item name={'fdColApzu6l'}>
                    <XformDescription
                      {...sysProps}
                      defaultTextValue={fmtMsg(':cmsProjectDemand.form.!{l5hsi1bcwr3pt5b4on}', '项目需求')}
                      controlValueStyle={{
                        fontSize: 20,
                        fontWeight: 'bold'
                      }}
                      showStatus="edit"
                    ></XformDescription>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={3} rowSpan={1} columnSpan={40}>
                <XformFieldset
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5hsja2npf5yc4nlqj}', '项目名称')}
                  layout={'horizontal'}
                  labelTextAlign={'left'}
                  required={true}
                >
                  <Form.Item
                    name={'fdProject'}
                    rules={[
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <CMSXformModal
                      key={postData.concat(levelData)}
                      {...props}
                      columnsProps={projectColumns}
                      chooseFdName='fdName'
                      apiKey={apiProject}
                      mark={true}
                      apiName={'listProjectInfo'}
                      showStatus='add'
                      modalTitle='项目名称选择'
                      criteriaKey='projectCriertia'
                      criteriaProps={['fdFrame.fdName', 'fdBelongTeam.fdName']}
                      showTableData={'fdName'}
                      onChangeProps={(v) => handleProject(v)}
                    />
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem
                column={1}
                row={2}
                style={{
                  textAlign: 'center',
                  justifyContent: 'center'
                }}
                rowSpan={1}
                columnSpan={40}
              >
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5m0jv4pp0n540afo2d}', '主题')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item
                    name={'fdSubject'}
                    rules={[
                      {
                        validator: lengthValidator(100)
                      },
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformInput
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectDemand.form.!{l5m0jv4rot36c080qh}', '请输入')}
                      showStatus="edit"
                    ></XformInput>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={4} rowSpan={1} columnSpan={40}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5hskhi8cgpynm5py6m}', '项目编号')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item
                    name={'fdProjectNum'}
                    rules={[
                      {
                        validator: lengthValidator(100)
                      },
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformInput
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hskhiae2anq4bp2ac}', '请输入')}
                      showStatus="readOnly"
                    ></XformInput>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={5} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5htahiltc89au91i0d}', '所属部门')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item
                    name={'fdBelongDept'}
                    rules={[
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformAddress
                      {...sysProps}
                      range={'all'}
                      preSelectType={'fixed'}
                      org={{
                        orgTypeArr: ['2'],
                        defaultValueType: 'null'
                      }}
                      showStatus="readOnly"
                    ></XformAddress>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={21} row={5} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5htan5uzruygvtzgnk}', '所属团队')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item
                    name={'fdBelongTeam'}
                    rules={[
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformAddress
                      {...sysProps}
                      org={{
                        orgTypeArr: ['2'],
                        defaultValueType: 'null'
                      }}
                      range={'all'}
                      preSelectType={'fixed'}
                      showStatus="readOnly"
                    ></XformAddress>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={6} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5htati10ogp6u4pyr4n}', '项目负责人')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item
                    name={'fdProjectLeader'}
                    rules={[
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformAddress
                      {...sysProps}
                      org={{
                        orgTypeArr: ['8'],
                        defaultValueType: 'null'
                      }}
                      range={'all'}
                      preSelectType={'fixed'}
                      showStatus="readOnly"
                    ></XformAddress>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              {/* <GridItem column={21} row={6} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5htbm1i443cb33w5p9}', '内部负责人')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdInnerLeader'}>
                    <XformAddress
                      {...sysProps}
                      org={{
                        orgTypeArr: ['8'],
                        defaultValueType: 'null'
                      }}
                      range={'all'}
                      preSelectType={'fixed'}
                      showStatus="add"
                    ></XformAddress>
                  </Form.Item>
                </XformFieldset>
              </GridItem> */}
              <GridItem column={1} row={7} rowSpan={1} columnSpan={40}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5htlddeosjl3v9jri}', '所属框架')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item
                    name={'fdFrame'}
                    rules={[
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformSelect
                      {...sysProps}
                      placeholder={fmtMsg(':cmsOutStaffInfo.form.!{l3mpxl7izzanc6s2rh}', '请输入')}
                      options={frameData}
                      optionSource={'custom'}
                      showStatus="readOnly"
                    ></XformSelect>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={8} rowSpan={1} columnSpan={40}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5hu16e6mscf4v6vz9}', '项目性质')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item
                    name={'fdProjectNature'}
                    rules={[
                      {
                        validator: lengthValidator(50)
                      },
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformRadio
                      {...sysProps}
                      options={[
                        {
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hu16e8qahrwl5i8k}', '项目外包'),
                          value: '1'
                        },
                        {
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hu16eaq7orwzlc0f}', '厂商驻场实施'),
                          value: '2'
                        }
                      ]}
                      rowCount={3}
                      direction={'column'}
                      serialType={'empty'}
                      optionSource={'custom'}
                      showStatus="readOnly"
                    ></XformRadio>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={9} rowSpan={1} columnSpan={40}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5hu1fkme7t0hcs6rzg}', '供应商范围')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item
                    name={'fdSupplierRange'}
                    rules={[
                      {
                        validator: lengthValidator(50)
                      },
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformRadio
                      {...sysProps}
                      options={[
                        {
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hu1fkn2huctriykh3}', '框架内'),
                          value: '1'
                        },
                        {
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hu1fkpozpqjlnmoz}', '框架外'),
                          value: '2'
                        }
                      ]}
                      rowCount={3}
                      direction={'column'}
                      serialType={'empty'}
                      optionSource={'custom'}
                      showStatus="edit"
                      onChange={(v) => {
                        setIsSupplierRange(v === '1')
                        form.setFieldsValue({
                          fdIsAppoint: undefined,
                          fdSupplier: undefined
                        })
                        setAssignSupplier(undefined)
                      }}
                    ></XformRadio>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              {
                isSupplierRange && (
                  <Fragment>
                    <GridItem column={1} row={10} rowSpan={1} columnSpan={20}>
                      <XformFieldset
                        labelTextAlign={'left'}
                        mobileContentAlign={'right'}
                        title={fmtMsg(':cmsProjectDemand.form.!{l5hu1sgpxwx7n0fkx9}', '是否指定供应商')}
                        layout={'horizontal'}
                      >
                        <Form.Item
                          name={'fdIsAppoint'}
                          rules={[
                            {
                              validator: lengthValidator(50)
                            }
                          ]}
                        >
                          <XformRadio
                            {...sysProps}
                            options={[
                              {
                                label: fmtMsg(':cmsProjectDemand.form.!{l5hu1sgrsktb3s7wysj}', '是'),
                                value: '1'
                              },
                              {
                                label: fmtMsg(':cmsProjectDemand.form.!{l5hu1sgsr7kztv0gx3l}', '否'),
                                value: '0'
                              }
                            ]}
                            rowCount={3}
                            direction={'column'}
                            serialType={'empty'}
                            optionSource={'custom'}
                            showStatus="edit"
                            onChange={(v) => {
                              setIsSuppler(v === '1')
                              form.setFieldsValue({
                                fdSupplier: undefined
                              })
                              setAssignSupplier(undefined)
                            }}
                          ></XformRadio>
                        </Form.Item>
                      </XformFieldset>
                    </GridItem>
                    {
                      isSuppler && (
                        <GridItem column={21} row={10} rowSpan={1} columnSpan={20}>
                          <XformFieldset
                            labelTextAlign={'left'}
                            mobileContentAlign={'right'}
                            title={fmtMsg(':cmsProjectDemand.form.!{l5hu2utft6lbporlys}', '指定供应商名称')}
                            layout={'horizontal'}
                          >
                            <Form.Item name={'fdSupplier'}>
                              <CMSXformModal
                                {...props}
                                columnsProps={supplierColumns}
                                chooseFdName='fdName'
                                defaultSearch={true}
                                defaultTableCriteria={{
                                  'fdFrame.fdId': {
                                    searchKey: '$eq',
                                    searchValue: selectedFrame.fdId || undefined
                                  }
                                }}
                                apiKey={apiSupplier}
                                apiName={'list'}
                                criteriaKey='demandSupplier'
                                showStatus='add'
                                modalTitle='供应商选择'
                                criteriaProps={['fdOrgCode', 'fdFrame.fdName', 'fdName']}
                                onChange={(v) => handleSetFdSupplier(v)}
                              />
                            </Form.Item>
                          </XformFieldset>
                        </GridItem>
                      )
                    }
                  </Fragment>
                )
              }
              {
                isFrameChild && (
                  <GridItem column={1} row={11} rowSpan={1} columnSpan={40}>
                    <XformFieldset
                      labelTextAlign={'left'}
                      mobileContentAlign={'right'}
                      title={fmtMsg(':cmsProjectDemand.form.!{l5hu3cliu0idfkp0p3p}', '设计类需求子类')}
                      layout={'horizontal'}
                      required={true}
                    >
                      <Form.Item
                        name={'fdDesignDemand'}
                        rules={[
                          {
                            validator: lengthValidator(50)
                          },
                          {
                            required: true,
                            message: fmtMsg(':required', '内容不能为空')
                          }
                        ]}
                      >
                        <XformRadio
                          {...sysProps}
                          options={[
                            {
                              label: fmtMsg(':cmsProjectDemand.form.!{l5hu3cljitk33gpmjdk}', '驻场设计类'),
                              value: '1'
                            },
                            {
                              label: fmtMsg(':cmsProjectDemand.form.!{l5hu3cllnpuwlev3vqm}', '外派设计类'),
                              value: '2'
                            }
                          ]}
                          rowCount={3}
                          direction={'column'}
                          serialType={'empty'}
                          optionSource={'custom'}
                          showStatus="edit"
                        ></XformRadio>
                      </Form.Item>
                    </XformFieldset>
                  </GridItem>
                )
              }
              <GridItem
                column={26}
                row={14}
                rowSpan={1}
                columnSpan={5}
                style={{
                  display: 'none'
                }}
              ></GridItem>
              <GridItem
                column={31}
                row={14}
                rowSpan={1}
                columnSpan={5}
                style={{
                  display: 'none'
                }}
              ></GridItem>
              <GridItem
                column={36}
                row={14}
                rowSpan={1}
                columnSpan={5}
                style={{
                  display: 'none'
                }}
              ></GridItem>
              <GridItem column={1} row={12} rowSpan={1} columnSpan={40}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5hu3p9hgtqae2rfxr6}', '订单金额')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdOrderAmount'}>
                    <XformMoney
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hu3p9i1j80lnhffd}', '请输入')}
                      numberFormat={{
                        formatType: 'base'
                      }}
                      precision={2}
                      showStatus="readOnly"
                    ></XformMoney>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={13} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.fdCreator', '创建者')}
                  layout={'horizontal'}
                >
                  <Form.Item
                    name={'fdCreator'}
                  >
                    <XformAddress
                      {...sysProps}
                      org={{
                        orgTypeArr: ['8'],
                        defaultValueType: 'null'
                      }}
                      range={'all'}
                      preSelectType={'fixed'}
                      showStatus="readOnly"
                    ></XformAddress>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={21} row={13} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.fdCreateTime', '创建时间')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdCreateTime'}>
                    <XformDatetime
                      {...sysProps}
                      placeholder={'请输入'}
                      dataPattern={'yyyy-MM-dd'}
                      showStatus="readOnly"
                    ></XformDatetime>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={14} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5jh2jka2sj0dsajqjh}', '预计入场时间')}
                  layout={'horizontal'}
                  required={true}

                >
                  <Form.Item
                    name={'fdAdmissionTime'}
                    rules={[
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformDatetime
                      {...sysProps}
                      placeholder={'请输入'}
                      dataPattern={'yyyy-MM-dd'}
                      showStatus="edit"
                    ></XformDatetime>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={21} row={14} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5jh2mex4elh46zftko}', '要求响应时间')}
                  layout={'horizontal'}
                  required={true}

                >
                  <Form.Item
                    name={'fdResponseTime'}
                    rules={[
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformDatetime
                      {...sysProps}
                      placeholder={'请输入'}
                      dataPattern={'yyyy-MM-dd'}
                      showStatus="edit"
                      onChange={(v) => {
                        form.setFieldsValue({
                          fdResponseTime: v + 68400000
                        })
                      }}
                    ></XformDatetime>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <div id='uploadDown' style={{ display: 'none' }}>
                <ButtonGroup amount={2} className='lui-test-btn-group' shape='link'>
                  <Button onClick={uploadExec} shape='link' type='default' label='上传' icon={<Icon type='vector' name='upload' />} />
                  <Button onClick={downloadExecl} shape='link' type='default' label='下载模板' icon={<Icon type='vector' name='download' />} />
                </ButtonGroup>
                <XformExecl onChange={(info) => { handlerChange(info) }} handleCancel={handleCancel} visible={visible} errMsgArr={errMsgArr} />
              </div>
              <GridItem column={1} row={15} rowSpan={1} columnSpan={40} className='cmsProjectDemandWork'>
                <XformFieldset>
                  <Form.Item
                    name={'cmsProjectDemandWork'}
                    validateTrigger={false}
                    noStyle
                    rules={[
                      {
                        validator: (rule, value, callback) => {
                          detailForms.current.cmsProjectDemandWork.current
                            .validate()
                            .then((error) => {
                              error ? callback(error) : callback()
                            })
                            .catch(() => {
                              callback('明细表校验不通过！')
                            })
                        }
                      }
                    ]}
                  >
                    <XformDetailTable
                      {...sysProps}
                      $$ref={detailForms.current.cmsProjectDemandWork}
                      $$tableType="detail"
                      $$tableName="cmsProjectDemandWork"
                      title={fmtMsg(':cmsProjectDemand.form.!{l5huinae76gwwbeute}', '工作分解')}
                      defaultRowNumber={1}
                      mobileRender={['simple']}
                      pcSetting={['pagination']}
                      showNumber={true}
                      layout={'vertical'}
                      columns={[
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hum1no49vp6cu4uf}', '任务/模块名称'),
                            maxLength: 100,
                            name: 'fdTaskName',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hum1npins4qa32u7s}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hum1no49vp6cu4uf}', '任务/模块名称'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hum1no49vp6cu4uf}', '任务/模块名称'),
                          options: {
                            validateRules: {
                              required: true,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          }
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hulwvhnlkr08pckwk}', '功能'),
                            maxLength: 100,
                            name: 'fdFunction',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hulwvidzdoomav25t}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hulwvhnlkr08pckwk}', '功能'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hulwvhnlkr08pckwk}', '功能')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hum4xpfoabugxs41n}', '子任务'),
                            maxLength: 100,
                            name: 'fdSubtask',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hum4xqafagoyvy9f5}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hum4xpfoabugxs41n}', '子任务'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hum4xpfoabugxs41n}', '子任务')
                        },
                        {
                          type: XformNumber,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5humco963yvy68le9m}', '费用核定(万元)'),
                            name: 'fdCostApproval',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5humcoa14k6b3skr3h}', '请输入'),
                            numberFormat: {
                              formatType: 'base'
                            },
                            range: {
                              start: 0
                            },
                            desktop: {
                              type: XformNumber
                            },
                            type: XformNumber,
                            showStatus: 'edit',
                            controlActions: {
                              'onBlur': [{
                                function: () => {
                                  const values = sysProps.$$form.current.getFieldsValue('cmsProjectDemandWork').values
                                  const newPrice = values.reduce((a, b) => {
                                    return a + b.fdCostApproval
                                  }, 0)
                                  form.setFieldsValue({
                                    fdOrderAmount: newPrice
                                  })
                                }
                              }]
                            }
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5humco963yvy68le9m}', '费用核定（万元）'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5humco963yvy68le9m}', '费用核定（万元）'),
                          options: {
                            validateRules: {
                              required: true,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          }
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hur3x2uh2nrghy2cp}', '工期要求'),
                            maxLength: 100,
                            name: 'fdConPeriod',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hur3x33mxezfwee47}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hur3x2uh2nrghy2cp}', '工期要求'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hur3x2uh2nrghy2cp}', '工期要求')
                        }
                      ]}
                      canAddRow={true}
                      canDeleteRow={true}
                      canImport={false}
                      canExport={false}
                      canExpand={true}
                      showStatus="edit"
                    ></XformDetailTable>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={16} rowSpan={1} columnSpan={40}>
                <XformFieldset>
                  <Form.Item
                    name={'cmsProjectDemandDetail'}
                    noStyle
                    validateTrigger={false}
                    rules={[
                      {
                        validator: (rule, value, callback) => {
                          detailForms.current.cmsProjectDemandDetail.current
                            .validate()
                            .then((error) => {
                              error ? callback(error) : callback()
                            })
                            .catch(() => {
                              callback('明细表校验不通过！')
                            })
                        }
                      }
                    ]}
                  >
                    <XformDetailTable
                      {...sysProps}
                      $$ref={detailForms.current.cmsProjectDemandDetail}
                      $$tableType="detail"
                      $$tableName="cmsProjectDemandDetail"
                      title={fmtMsg(':cmsProjectDemand.form.!{l5huy2mldont3z8hct8}', '需求详情')}
                      defaultRowNumber={1}
                      mobileRender={['simple']}
                      pcSetting={['pagination']}
                      showNumber={true}
                      layout={'vertical'}
                      columns={[
                        {
                          type: XformSelect,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhou5kykloq4ftbr}', '岗位'),
                            name: 'fdPost',
                            renderMode: 'singlelist',
                            direction: 'column',
                            rowCount: 3,
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hur3x33mxezfwee47}', '请输入'),
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: selectedPostData,
                            desktop: {
                              type: XformSelect
                            },

                            type: XformSelect,
                            showStatus: 'edit',
                            controlActions: {
                              'onChange': [{
                                function: (v, r) => {
                                  sysProps.$$form.current.updateFormItemProps('cmsProjectDemandDetail', {
                                    rowValue: {
                                      rowNum: r,
                                      value: {
                                        fdPost: { fdId: v },
                                      }
                                    }
                                  })
                                }
                              }]
                            }
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhou5kykloq4ftbr}', '岗位'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hvhou5kykloq4ftbr}', '岗位'),
                          options: {
                            validateRules: {
                              required: true,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          }
                        },
                        {
                          type: XformSelect,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhr73mut7qpku1m}', '技能等级'),
                            name: 'fdSkillLevel',
                            renderMode: 'singlelist',
                            direction: 'column',
                            rowCount: 3,
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hur3x33mxezfwee47}', '请输入'),
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: selectedLevelData,
                            desktop: {
                              type: XformSelect
                            },
                            type: XformSelect,
                            showStatus: 'edit',
                            controlActions: {
                              'onChange': [{
                                function: (v, r) => {
                                  // const levelItem = levelData.find(item => item.fdId === v)
                                  sysProps.$$form.current.updateFormItemProps('cmsProjectDemandDetail', {
                                    rowValue: {
                                      rowNum: r,
                                      value: {
                                        // fdSkillRemand: levelItem.fdRemark,
                                        fdSkillLevel: { fdId: v }
                                      }
                                    }
                                  })
                                }
                              }]
                            }
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhr73mut7qpku1m}', '技能等级'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hvhr73mut7qpku1m}', '技能等级'),
                          options: {
                            validateRules: {
                              required: true,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          },

                        },
                        {
                          type: XformNumber,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvg16602c8ubf6wlqz}', '人数'),
                            name: 'fdPersonNum',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hvg167fimx9fukd5}', '请输入'),
                            numberFormat: {
                              formatType: 'base'
                            },
                            range: {
                              start: 0
                            },
                            desktop: {
                              type: XformNumber
                            },
                            type: XformNumber,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvg16602c8ubf6wlqz}', '人数'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hvg16602c8ubf6wlqz}', '人数'),
                          options: {
                            validateRules: {
                              required: true,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          }
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: '具体要求',
                            maxLength: 200,
                            name: 'fdSkillRemand',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hvhi5shcphr934m3h}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: '具体要求',
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: '具体要求'
                        }
                      ]}
                      canAddRow={true}
                      canDeleteRow={true}
                      canImport={false}
                      canExport={false}
                      canExpand={true}
                      showStatus="edit"
                    ></XformDetailTable>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={17} rowSpan={1} columnSpan={40}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5jfuzfeh4xamxk7vb4}', '发布供应商')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdSupplies'}>
                    <CMSXformModal
                      {...props}
                      columnsProps={supplierColumns}
                      chooseFdName='fdName'
                      apiKey={apiSupplier}
                      apiName={'list'}
                      criteriaKey='demandSupplier'
                      showStatus='add'
                      criteriaProps={['fdOrgCode', 'fdFrame.fdName', 'fdName']}
                      modalTitle='供应商选择'
                      showFooter={true}
                      multiple={true}
                      initData={selectedFdSupplier}
                      defaultSearch={true}
                      defaultTableCriteria={{
                        'fdName': {
                          searchKey: '$contains',
                          searchValue: assignSupplier || undefined
                        },
                        'fdFrame.fdId': {
                          searchKey: '$eq',
                          searchValue: selectedFrame.fdId || undefined
                        }
                      }}
                      onChange={(v) => handleChangeSupplier(v)}
                    />
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={18} rowSpan={1} columnSpan={40}>
                <XformFieldset>
                  <Form.Item
                    name={'cmsProjectDemandSupp'}
                    noStyle
                    validateTrigger={false}
                    rules={[
                      {
                        validator: (rule, value, callback) => {
                          detailForms.current.cmsProjectDemandSupp.current
                            .validate()
                            .then((error) => {
                              error ? callback(error) : callback()
                            })
                            .catch(() => {
                              callback('明细表校验不通过！')
                            })
                        }
                      }
                    ]}
                  >
                    <XformDetailTable
                      {...sysProps}
                      $$ref={detailForms.current.cmsProjectDemandSupp}
                      $$tableType="detail"
                      $$tableName="cmsProjectDemandSupp"
                      title={fmtMsg(':cmsProjectDemand.form.!{l5hvsnakv4ck8q22sqp}', '发布供应商')}
                      defaultRowNumber={0}
                      mobileRender={['simple']}
                      pcSetting={['pagination']}
                      showNumber={true}
                      layout={'vertical'}
                      hiddenLabel={true}
                      columns={[
                        {
                          type: CMSXformModal,
                          controlProps: {
                            apiKey: apiSupplier,
                            apiName: 'list',
                            criteriaKey: 'supplierCriertia',
                            chooseFdName: 'fdName',
                            criteriaProps: ['fdOrgCode', 'fdFrame.fdName'],
                            columnsProps: supplierColumns,
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvu8nbwvva3eaj5zf}', '供应商名称'),
                            name: 'fdSupplier',
                            renderMode: 'singlelist',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            desktop: {
                              type: CMSXformModal
                            },
                            type: CMSXformModal,
                            relationCfg: {
                              appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                              xformName: '供应商信息',
                              modelId: '1g777qg92w10wcf2w1jiihhv3oqp4s6nr9w0',
                              tableType: 'main',
                              tableName: 'mk_model_20220705vk0ha',
                              showFields: '$供应商名称$',
                              refFieldName: '$fd_supplier_name$'
                            },

                            showStatus: 'readOnly'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvu8nbwvva3eaj5zf}', '供应商名称'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hvu8nbwvva3eaj5zf}', '供应商名称')
                        },
                        {
                          type: XformSelect,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j8fap7kgcwzldwypj}', '所属框架'),
                            placeholder: fmtMsg(':cmsOutStaffInfo.form.!{l3mpxl7izzanc6s2rh}', '请输入'),
                            name: 'fdFrame',
                            multi: true,
                            options: frameData,
                            desktop: {
                              type: XformSelect
                            },
                            type: XformSelect,
                            showStatus: 'readOnly'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j8fap7kgcwzldwypj}', '所属框架'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j8fap7kgcwzldwypj}', '所属框架')
                        },
                        {
                          type: XformDatetime,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5jfsj2yyw86i6eb5z}', '上次发布需求时间'),
                            name: 'fdLastTime',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5jfsj2zv2npau0ak0g}', '请输入'),
                            dataPattern: 'yyyy-MM-dd',
                            desktop: {
                              type: XformDatetime
                            },
                            showStatus: 'readOnly'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5jfsj2yyw86i6eb5z}', '上次发布需求时间'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5jfsj2yyw86i6eb5z}', '上次发布需求时间')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: '本年度份额占比%',
                            maxLength: 100,
                            name: 'fdAnnualRatio',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5jg2w81dql7tlq4wp}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: '本年度份额占比%',
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: '本年度份额占比%'
                        }
                      ]}
                      canAddRow={false}
                      canDeleteRow={false}
                      canImport={false}
                      canExport={false}
                      canExpand={true}
                      showStatus="view"
                    ></XformDetailTable>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
            </LayoutGrid>
          </XformAppearance>
        </Form>
      </div>
    </div>
  )
}

export default XForm
