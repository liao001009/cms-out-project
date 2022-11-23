import React, { useRef, createRef, useState, useEffect, Fragment } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Form } from '@lui/core'
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
import CMSXformModal from '@/desktop/components/cms/XformModal'
import apiFrameInfo from '@/api/cmsFrameInfo'
import apiPostInfo from '@/api/cmsPostInfo'
import apiLevelInfo from '@/api/cmsLevelInfo'
import { EShowStatus } from '@/types/showStatus'

const MECHANISMNAMES = {
  'cmsProjectDemandOrder.fdResumeAtt': 'attachmentDict'
}

const baseCls = 'project-demand-form'

const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectDemandWork: createRef() as any,
    cmsProjectDemandDetail: createRef() as any,
    cmsProjectDemandSupp: createRef() as any,
    cmsProjectDemandOrder: createRef() as any
  })
  const { formRef: formRef, value: value, materialVis, fdSuppliesVisible, isRequired, editFlag } = props
  const [form] = Form.useForm()
  // 框架数据
  const [frameData, setFrameData] = useState<any>([])
  // 岗位数据
  const [postData, setPostData] = useState<any>([])
  // 级别数据
  const [levelData, setLevelData] = useState<any>([])

  let minPerson = 0
  value.cmsProjectDemandDetail.map(item => {
    minPerson += item.fdPersonNum
  })
  form.setFieldsValue({
    fdLowPerson: minPerson
  })
  useEffect(() => {
    init()
  }, [])

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
  // 对外暴露接口
  useApi({
    form,
    formRef,
    value,
    MECHANISMNAMES
  })
  // 内置$$form对象，组件间的内部调用， 长度校验规则，此逻辑禁止移除与修改
  const { onValuesChange, ...sysProps } = useSystem({
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
                      showStatus="view"
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
                >
                  <Form.Item name={'fdProject'}>
                    <CMSXformModal
                      {...props}
                      chooseFdName='fdName'
                      showStatus={EShowStatus.view}
                    />
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem
                column={1}
                row={2}
                rowSpan={1}
                columnSpan={40}
              >
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5m0jv4pp0n540afo2d}', '主题')}
                  layout={'horizontal'}
                >
                  <Form.Item
                    name={'fdSubject'}
                  >
                    <XformInput
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectDemand.form.!{l5m0jv4rot36c080qh}', '请输入')}
                      showStatus="view"
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
                >
                  <Form.Item
                    name={'fdProjectNum'}
                  >
                    <XformInput
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hskhiae2anq4bp2ac}', '请输入')}
                      showStatus="view"
                    ></XformInput>
                  </Form.Item>
                </XformFieldset>
              </GridItem>

              {
                fdSuppliesVisible ? null : (
                  <Fragment>
                    <GridItem column={1} row={5} rowSpan={1} columnSpan={20}>
                      <XformFieldset
                        labelTextAlign={'left'}
                        mobileContentAlign={'right'}
                        title={fmtMsg(':cmsProjectDemand.form.!{l5htahiltc89au91i0d}', '所属部门')}
                        layout={'horizontal'}
                      >
                        <Form.Item name={'fdBelongDept'}>
                          <XformAddress
                            {...sysProps}
                            range={'all'}
                            preSelectType={'fixed'}
                            org={{
                              orgTypeArr: ['2'],
                              defaultValueType: 'null'
                            }}
                            showStatus="view"
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
                      >
                        <Form.Item name={'fdBelongTeam'}>
                          <XformAddress
                            {...sysProps}
                            org={{
                              orgTypeArr: ['2'],
                              defaultValueType: 'null'
                            }}
                            range={'all'}
                            preSelectType={'fixed'}
                            showStatus="view"
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
                      >
                        <Form.Item name={'fdProjectLeader'}>
                          <XformAddress
                            {...sysProps}
                            org={{
                              orgTypeArr: ['8'],
                              defaultValueType: 'null'
                            }}
                            range={'all'}
                            preSelectType={'fixed'}
                            showStatus="view"
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
                            showStatus="view"
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
                      >
                        <Form.Item name={'fdFrame'}>
                          <XformSelect
                            {...sysProps}
                            placeholder={fmtMsg(':cmsOutStaffInfo.form.!{l3mpxl7izzanc6s2rh}', '请输入')}
                            options={frameData}
                            optionSource={'custom'}
                            showStatus="view"
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
                      >
                        <Form.Item
                          name={'fdProjectNature'}
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
                            showStatus="view"
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
                      >
                        <Form.Item
                          name={'fdSupplierRange'}
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
                            showStatus="view"
                          ></XformRadio>
                        </Form.Item>
                      </XformFieldset>
                    </GridItem>
                    {
                      value.fdSupplierRange === '1' && (
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
                                  showStatus="view"
                                ></XformRadio>
                              </Form.Item>
                            </XformFieldset>
                          </GridItem>
                          {
                            value.fdIsAppoint === '1' && (
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
                                      chooseFdName='fdName'
                                      showStatus={EShowStatus.view}
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
                      value.fdFrame.fdName === '设计类' && (
                        <GridItem column={1} row={11} rowSpan={1} columnSpan={40}>
                          <XformFieldset
                            labelTextAlign={'left'}
                            mobileContentAlign={'right'}
                            title={fmtMsg(':cmsProjectDemand.form.!{l5hu3cliu0idfkp0p3p}', '设计类需求子类')}
                            layout={'horizontal'}
                          >
                            <Form.Item
                              name={'fdDesignDemand'}
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
                                showStatus="view"
                              ></XformRadio>
                            </Form.Item>
                          </XformFieldset>
                        </GridItem>
                      )
                    }
                    {
                      fdSuppliesVisible ? null : (
                        <GridItem column={1} row={12} rowSpan={1} columnSpan={40}>
                          <XformFieldset
                            labelTextAlign={'left'}
                            mobileContentAlign={'right'}
                            title={fmtMsg(':cmsProjectDemand.form.!{l5hu3p9hgtqae2rfxr6}', '订单金额')}
                            layout={'horizontal'}
                          >
                            <Form.Item name={'fdOrderAmount'}>
                              {/* <XformMoney
                          {...sysProps}
                          placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hu3p9i1j80lnhffd}', '请输入')}
                          numberFormat={{
                            formatType: 'base'
                          }}
                          precision={2}
                          showStatus="view"
                        ></XformMoney> */}
                              <span>{value?.fdOrderAmount.toFixed(2)}万</span>
                            </Form.Item>
                          </XformFieldset>
                        </GridItem>
                      )
                    }

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
                            showStatus="view"
                          ></XformAddress>
                        </Form.Item>
                      </XformFieldset>
                    </GridItem>
                  </Fragment>
                )
              }
              <GridItem column={fdSuppliesVisible ? 1 : 21} row={13} rowSpan={1} columnSpan={20}>
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
                      showStatus="view"
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
                >
                  <Form.Item
                    name={'fdAdmissionTime'}
                  >
                    <XformDatetime
                      {...sysProps}
                      placeholder={'请输入'}
                      dataPattern={'yyyy-MM-dd'}
                      showStatus="view"
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
                >
                  <Form.Item
                    name={'fdResponseTime'}
                  >
                    <XformDatetime
                      {...sysProps}
                      placeholder={'请输入'}
                      dataPattern={'yyyy-MM-dd HH/mm'}
                      showStatus="view"
                    ></XformDatetime>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              {
                materialVis || value.fdApprovalTime ? (
                  <Fragment>
                    <GridItem column={1} row={15} rowSpan={1} columnSpan={20}>
                      <XformFieldset
                        labelTextAlign={'left'}
                        mobileContentAlign={'right'}
                        title={fmtMsg(':cmsProjectDemand.form.!{l5hx79yiywiixyt0gwo}', '评审时间')}
                        layout={'horizontal'}
                        required={isRequired}
                      >
                        <Form.Item
                          name={'fdApprovalTime'}
                          rules={[
                            {
                              required: isRequired,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          ]}
                        >
                          <XformDatetime
                            {...sysProps}
                            placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hx79yk16674uklzee}', '请输入')}
                            dataPattern={'yyyy-MM-dd'}
                            passValue={true}
                            showStatus={materialVis ? 'edit' : 'view'}
                          ></XformDatetime>
                        </Form.Item>
                      </XformFieldset>
                    </GridItem>
                    <GridItem column={21} row={15} rowSpan={1} columnSpan={6} style={{ display: 'flex', alignItems: 'center', }}>
                      <XformFieldset
                        compose={true}
                        required={isRequired}
                        layout={'horizontal'}
                        title={fmtMsg(':cmsProjectDemand.form.!{l5hxh9fpx14ur0jgeue}', '人数区间')}
                      >
                      </XformFieldset>

                    </GridItem>
                    <GridItem column={27} row={15} rowSpan={1} columnSpan={12} style={{ padding: '6px 0' }}>
                      <div className='flex'>
                        <Form.Item
                          name={'fdLowPerson'}
                          rules={[
                            {
                              required: isRequired,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          ]}
                        >
                          <XformNumber
                            {...sysProps}
                            placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hxk7elmfxiucq54kd}', '请输入')}
                            numberFormat={{
                              formatType: 'base'
                            }}
                            range={{
                              start: 0
                            }}
                            showStatus={materialVis ? 'edit' : 'view'}
                          ></XformNumber>
                        </Form.Item>
                        <Form.Item name={'fdColUso4hd'}>
                          <XformDescription
                            {...sysProps}
                            defaultTextValue={fmtMsg(':cmsProjectDemand.form.!{l5hxjc3iktyguac1yn8}', '至')}
                            showStatus="view"
                          ></XformDescription>
                        </Form.Item>
                        <Form.Item
                          name={'fdUpPerson'}
                          rules={[
                            {
                              required: isRequired,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          ]}
                        >
                          <XformNumber
                            {...sysProps}
                            placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hxlsau5eqmbbchfv8}', '请输入')}
                            numberFormat={{
                              formatType: 'base'
                            }}
                            range={{
                              start: 0
                            }}
                            fdSysNumber={{}}
                            label={fmtMsg(':cmsProjectDemand.form.!{l5hxlsauo7w98rlogbn}', '人数区间上限')}
                            showStatus={materialVis ? 'edit' : 'view'}
                          ></XformNumber>
                        </Form.Item>
                        <Form.Item name={'fdColSgzhna'}>
                          <XformDescription
                            {...sysProps}
                            defaultTextValue={fmtMsg(':cmsProjectDemand.form.!{l5hxjtwrindzux1zywk}', '人')}
                            showStatus="view"
                          ></XformDescription>
                        </Form.Item>
                      </div>
                    </GridItem>
                    {/* <GridItem column={32} row={15} rowSpan={1} columnSpan={1}>

                    </GridItem>
                    <GridItem column={33} row={15} rowSpan={1} columnSpan={5}>

                    </GridItem>
                    <GridItem column={38} row={15} rowSpan={1} columnSpan={1}>

                    </GridItem> */}
                  </Fragment>
                ) : null
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
              {
                fdSuppliesVisible ? null : (
                  <GridItem column={1} row={16} rowSpan={1} columnSpan={40}>
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
                                showStatus: 'view'
                              },
                              labelProps: {
                                title: fmtMsg(':cmsProjectDemand.form.!{l5hum1no49vp6cu4uf}', '任务/模块名称'),
                                desktop: {
                                  layout: 'vertical'
                                },
                                labelTextAlign: 'left'
                              },
                              label: fmtMsg(':cmsProjectDemand.form.!{l5hum1no49vp6cu4uf}', '任务/模块名称'),
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
                                showStatus: 'view'
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
                                showStatus: 'view'
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
                                title: fmtMsg(':cmsProjectDemand.form.!{l5humco963yvy68le9m}', '费用核定（万元）'),
                                name: 'fdCostApproval',
                                placeholder: fmtMsg(':cmsProjectDemand.form.!{l5humcoa14k6b3skr3h}', '请输入'),
                                numberFormat: {
                                  formatType: 'base'
                                },
                                desktop: {
                                  type: XformNumber
                                },
                                type: XformNumber,
                                showStatus: 'view'
                              },
                              labelProps: {
                                title: fmtMsg(':cmsProjectDemand.form.!{l5humco963yvy68le9m}', '费用核定（万元）'),
                                desktop: {
                                  layout: 'vertical'
                                },
                                labelTextAlign: 'left'
                              },
                              label: fmtMsg(':cmsProjectDemand.form.!{l5humco963yvy68le9m}', '费用核定（万元）'),
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
                                showStatus: 'view'
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
                          canExport={false}
                          showStatus="view"
                        ></XformDetailTable>
                      </Form.Item>
                    </XformFieldset>
                  </GridItem>
                )
              }
              <GridItem column={1} row={17} rowSpan={1} columnSpan={40}>
                <XformFieldset>
                  <Form.Item
                    name={'cmsProjectDemandDetail'}
                    validateTrigger={false}
                    noStyle
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
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: postData,
                            desktop: {
                              type: XformSelect
                            },
                            relationCfg: {
                              appCode: '1g776q10pw10w5j2w27q4fgr1u02jiv194w0',
                              xformName: '岗位信息',
                              modelId: '1g77748i8w10w776w1qndvaerni3ke2996w0',
                              tableType: 'main',
                              tableName: 'mk_model_2022070583983',
                              showFields: '$岗位名称$',
                              refFieldName: '$fd_post_name$'
                            },
                            type: XformSelect,
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhou5kykloq4ftbr}', '岗位'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hvhou5kykloq4ftbr}', '岗位'),
                        },
                        {
                          type: XformSelect,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhr73mut7qpku1m}', '技能等级'),
                            name: 'fdSkillLevel',
                            renderMode: 'singlelist',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: levelData,
                            desktop: {
                              type: XformSelect
                            },
                            relationCfg: {
                              appCode: '1g776q10pw10w5j2w27q4fgr1u02jiv194w0',
                              xformName: '级别信息',
                              modelId: '1g777241qw10w6osw2h8p1ig2rgc7nf192w0',
                              tableType: 'main',
                              tableName: 'mk_model_20220705zz96g',
                              showFields: '$级别名称$',
                              refFieldName: '$fd_level_name$'
                            },
                            type: XformSelect,
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhr73mut7qpku1m}', '技能等级'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hvhr73mut7qpku1m}', '技能等级'),
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
                            desktop: {
                              type: XformNumber
                            },
                            type: XformNumber,
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvg16602c8ubf6wlqz}', '人数'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hvg16602c8ubf6wlqz}', '人数'),
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhi5ruejee5eeyv}', '经验和技能要求'),
                            maxLength: 100,
                            name: 'fdSkillRemand',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hvhi5shcphr934m3h}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhi5ruejee5eeyv}', '经验和技能要求'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5hvhi5ruejee5eeyv}', '经验和技能要求')
                        }
                      ]}
                      canExport={false}
                      showStatus="view"
                    ></XformDetailTable>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              {
                !fdSuppliesVisible ? (
                  <Fragment>
                    <GridItem column={1} row={18} rowSpan={1} columnSpan={40}>
                      <XformFieldset
                        labelTextAlign={'left'}
                        mobileContentAlign={'right'}
                        title={fmtMsg(':cmsProjectDemand.form.!{l5jfuzfeh4xamxk7vb4}', '发布供应商')}
                        layout={'horizontal'}
                      >
                        <Form.Item name={'fdSupplies'}>
                          <CMSXformModal
                            {...props}
                            showStatus={EShowStatus.view}
                            chooseFdName='fdName'
                            multiple={true}
                          />
                        </Form.Item>
                      </XformFieldset>
                    </GridItem>
                    <GridItem column={1} row={19} rowSpan={1} columnSpan={40}>
                      <XformFieldset>
                        <Form.Item
                          name={'cmsProjectDemandSupp'}
                          validateTrigger={false}
                          noStyle
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
                            defaultRowNumber={1}
                            mobileRender={['simple']}
                            pcSetting={['pagination']}
                            showNumber={true}
                            layout={'vertical'}
                            hiddenLabel={true}
                            columns={editFlag ?
                              [
                                {
                                  type: CMSXformModal,
                                  controlProps: {
                                    modalTitle: '供应商',
                                    chooseFdName: 'fdName',
                                    title: fmtMsg(':cmsProjectDemand.form.!{l5hvu8nbwvva3eaj5zf}', '供应商名称'),
                                    name: 'fdSupplier',
                                    desktop: {
                                      type: CMSXformModal
                                    },
                                    type: CMSXformModal,
                                    showStatus: 'view'
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
                                    name: 'fdFrame',
                                    multi: true,
                                    options: frameData,
                                    desktop: {
                                      type: XformSelect
                                    },
                                    type: XformSelect,
                                    showStatus: 'view'
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
                                    dataPattern: 'yyyy-MM-dd HH:mm',
                                    desktop: {
                                      type: XformDatetime
                                    },
                                    showStatus: 'view'
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
                                    title: fmtMsg(':cmsProjectDemand.form.!{l5jg2w7y6utzbx015rj}', '本年度份额占比'),
                                    maxLength: 100,
                                    name: 'fdAnnualRatio',
                                    placeholder: fmtMsg(':cmsProjectDemand.form.!{l5jg2w81dql7tlq4wp}', '请输入'),
                                    desktop: {
                                      type: XformInput
                                    },
                                    showStatus: 'view'
                                  },
                                  labelProps: {
                                    title: fmtMsg(':cmsProjectDemand.form.!{l5jg2w7y6utzbx015rj}', '本年度份额占比'),
                                    desktop: {
                                      layout: 'vertical'
                                    },
                                    labelTextAlign: 'left'
                                  },
                                  label: fmtMsg(':cmsProjectDemand.form.!{l5jg2w7y6utzbx015rj}', '本年度份额占比')
                                }
                              ] :
                              [
                                {
                                  type: CMSXformModal,
                                  controlProps: {
                                    modalTitle: '供应商',
                                    chooseFdName: 'fdName',
                                    title: fmtMsg(':cmsProjectDemand.form.!{l5hvu8nbwvva3eaj5zf}', '供应商名称'),
                                    name: 'fdSupplier',
                                    desktop: {
                                      type: CMSXformModal
                                    },
                                    type: CMSXformModal,
                                    showStatus: 'view'
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
                                    name: 'fdFrame',
                                    multi: true,
                                    options: frameData,
                                    desktop: {
                                      type: XformSelect
                                    },
                                    type: XformSelect,
                                    showStatus: 'view'
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
                              ]
                            }
                            canExport={false}
                            showStatus="view"
                          ></XformDetailTable>
                        </Form.Item>
                      </XformFieldset>
                    </GridItem>
                  </Fragment>
                ) : null
              }
            </LayoutGrid>
          </XformAppearance>
        </Form>
      </div>
    </div>
  )
}

export default XForm
