import React, { useRef, createRef } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Form } from '@lui/core'
import { useApi, useSystem } from '@/desktop/shared/formHooks'
import XformAppearance from '@/desktop/components/form/XformAppearance'
import LayoutGrid from '@/desktop/components/form/LayoutGrid'
import GridItem from '@/desktop/components/form/GridItem'
import XformDescription from '@/desktop/components/form/XformDescription'
import XformFieldset from '@/desktop/components/form/XformFieldset'
import XformRelation from '@/desktop/components/form/XformRelation'
import XformInput from '@/desktop/components/form/XformInput'
import XformAddress from '@/desktop/components/form/XformAddress'
import XformRadio from '@/desktop/components/form/XformRadio'
import XformDatetime from '@/desktop/components/form/XformDatetime'
import XformNumber from '@/desktop/components/form/XformNumber'
import XformDetailTable from '@/desktop/components/form/XformDetailTable'
import XformSelect from '@/desktop/components/form/XformSelect'
import XformAttach from '@/desktop/components/form/XformAttach'
import XformTextarea from '@/desktop/components/form/XformTextarea'
import XformButton from '@/desktop/components/form/XformButton'
import XformMoney from '@/desktop/components/form/XformMoney'

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
  const { formRef: formRef, value: value } = props
  const [form] = Form.useForm()
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
                  <Form.Item name={'fdProject'}>
                    <XformRelation
                      {...sysProps}
                      renderMode={'singlelist'}
                      direction={'column'}
                      rowCount={3}
                      modelName={'com.landray.sys.xform.core.entity.design.SysXFormDesign'}
                      isForwardView={'no'}
                      options={[
                        {
                          fdName: '选项1',
                          fdId: '1'
                        },
                        {
                          fdName: '选项2',
                          fdId: '2'
                        },
                        {
                          fdName: '选项3',
                          fdId: '3'
                        }
                      ]}
                      relationCfg={{
                        appCode: '1g77dbphcw10w198swtqlij1fbb1uj3tkuw0',
                        xformName: '项目库',
                        modelId: '1g77dc2o1w10w19a3w30f22612umq6uk3lw0',
                        tableType: 'main',
                        tableName: 'mk_model_202207052yvle',
                        showFields: '$项目名称$',
                        refFieldName: '$fd_name$'
                      }}
                      outParams={{
                        params: [
                          {
                            sourceField: {
                              fdType: 'text',
                              fdName: 'fdProjectNum',
                              tableName: 'main'
                            },
                            targetField: {
                              fdType: 'text',
                              fdName: 'fd_code',
                              tableName: 'main'
                            }
                          },
                          {
                            sourceField: {
                              fdType: 'address',
                              fdName: 'fdBelongDept',
                              tableName: 'main'
                            },
                            targetField: {
                              fdType: 'address',
                              fdName: 'fdBelongDept',
                              tableName: 'main'
                            }
                          },
                          {
                            sourceField: {
                              fdType: 'address',
                              fdName: 'fdBelongTeam',
                              tableName: 'main'
                            },
                            targetField: {
                              fdType: 'address',
                              fdName: 'fdBelongTeam',
                              tableName: 'main'
                            }
                          },
                          {
                            sourceField: {
                              fdType: 'address',
                              fdName: 'fdProjectLeader',
                              tableName: 'main'
                            },
                            targetField: {
                              fdType: 'address',
                              fdName: 'fd_project_principal',
                              tableName: 'main'
                            }
                          },
                          {
                            sourceField: {
                              fdType: 'address',
                              fdName: 'fdInnerLeader',
                              tableName: 'main'
                            },
                            targetField: {
                              fdType: 'address',
                              fdName: 'fd_project_principal',
                              tableName: 'main'
                            }
                          }
                        ]
                      }}
                      datasource={{
                        queryCollection: {
                          linkType: '$and',
                          query: []
                        },
                        sorters: [],
                        columns: [
                          {
                            name: 'fd_name',
                            label: '项目名称'
                          },
                          {
                            name: 'fd_code',
                            label: '项目编号'
                          },
                          {
                            name: 'fdBelongDept',
                            label: '所属部门'
                          },
                          {
                            name: 'fdBelongTeam',
                            label: '所属组/团队'
                          },
                          {
                            name: 'fd_project_principal',
                            label: '项目负责人'
                          },
                          {
                            name: 'fd_inner_principal',
                            label: '内部责任人'
                          },
                          {
                            name: 'fdFrame',
                            label: '项目所属框架'
                          },
                          {
                            name: 'fdProjectNature',
                            label: '项目性质'
                          },
                          {
                            name: 'fd_project_date',
                            label: '项目立项时间'
                          },
                          {
                            name: 'fd_col_b0hjof',
                            label: '预计开始时间'
                          },
                          {
                            name: 'fd_col_r2zg5c',
                            label: '预计结束时间'
                          }
                        ],
                        filters: [
                          {
                            name: 'fd_name',
                            label: '项目名称'
                          },
                          {
                            name: 'fd_code',
                            label: '项目编号'
                          },
                          {
                            name: 'fdBelongDept',
                            label: '所属部门'
                          },
                          {
                            name: 'fdBelongTeam',
                            label: '所属组/团队'
                          },
                          {
                            name: 'fd_project_principal',
                            label: '项目负责人'
                          },
                          {
                            name: 'fd_inner_principal',
                            label: '内部责任人'
                          },
                          {
                            name: 'fdFrame',
                            label: '项目所属框架'
                          },
                          {
                            name: 'fdProjectNature',
                            label: '项目性质'
                          },
                          {
                            name: 'fd_project_date',
                            label: '项目立项时间'
                          },
                          {
                            name: 'fd_col_b0hjof',
                            label: '预计开始时间'
                          },
                          {
                            name: 'fd_col_r2zg5c',
                            label: '预计结束时间'
                          }
                        ],
                        isListThrough: true
                      }}
                      showStatus="edit"
                    ></XformRelation>
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
                      }
                    ]}
                  >
                    <XformInput
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hskhiae2anq4bp2ac}', '请输入')}
                      showStatus="edit"
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
                  <Form.Item name={'fdBelongDept'}>
                    <XformAddress
                      {...sysProps}
                      range={'all'}
                      preSelectType={'fixed'}
                      org={{
                        orgTypeArr: ['2'],
                        defaultValueType: 'null'
                      }}
                      showStatus="edit"
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
                  <Form.Item name={'fdBelongTeam'}>
                    <XformAddress
                      {...sysProps}
                      org={{
                        orgTypeArr: ['2'],
                        defaultValueType: 'null'
                      }}
                      range={'all'}
                      preSelectType={'fixed'}
                      showStatus="edit"
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
                  <Form.Item name={'fdProjectLeader'}>
                    <XformAddress
                      {...sysProps}
                      org={{
                        orgTypeArr: ['8'],
                        defaultValueType: 'null'
                      }}
                      range={'all'}
                      preSelectType={'fixed'}
                      showStatus="edit"
                    ></XformAddress>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={21} row={6} rowSpan={1} columnSpan={20}>
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
                      showStatus="edit"
                    ></XformAddress>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={7} rowSpan={1} columnSpan={40}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5htlddeosjl3v9jri}', '所属框架')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item name={'fdFrame'}>
                    <XformRelation
                      {...sysProps}
                      renderMode={'select'}
                      direction={'column'}
                      rowCount={3}
                      modelName={'com.landray.sys.xform.core.entity.design.SysXFormDesign'}
                      isForwardView={'no'}
                      options={[
                        {
                          fdName: '选项1',
                          fdId: '1'
                        },
                        {
                          fdName: '选项2',
                          fdId: '2'
                        },
                        {
                          fdName: '选项3',
                          fdId: '3'
                        }
                      ]}
                      relationCfg={{
                        appCode: '1g776q10pw10w5j2w27q4fgr1u02jiv194w0',
                        xformName: '框架信息',
                        modelId: '1g776skc9w10w5s5w1of8s041q6o7vv2liw0',
                        tableType: 'main',
                        tableName: 'mk_model_20220705d9xao',
                        showFields: '$框架名称$',
                        refFieldName: '$fd_name$'
                      }}
                      showStatus="edit"
                    ></XformRelation>
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
                      showStatus="edit"
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
                    ></XformRadio>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
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
                    ></XformRadio>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={21} row={10} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5hu2utft6lbporlys}', '指定供应商名称')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdSupplier'}>
                    <XformRelation
                      {...sysProps}
                      renderMode={'singlelist'}
                      direction={'column'}
                      rowCount={3}
                      modelName={'com.landray.sys.xform.core.entity.design.SysXFormDesign'}
                      isForwardView={'no'}
                      options={[
                        {
                          fdName: '选项1',
                          fdId: '1'
                        },
                        {
                          fdName: '选项2',
                          fdId: '2'
                        },
                        {
                          fdName: '选项3',
                          fdId: '3'
                        }
                      ]}
                      relationCfg={{
                        appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                        xformName: '供应商信息',
                        modelId: '1g777qg92w10wcf2w1jiihhv3oqp4s6nr9w0',
                        tableType: 'main',
                        tableName: 'mk_model_20220705vk0ha',
                        showFields: '$供应商名称$',
                        refFieldName: '$fd_supplier_name$'
                      }}
                      datasource={{
                        queryCollection: {
                          linkType: '$and',
                          query: []
                        },
                        sorters: [],
                        columns: [
                          {
                            name: 'fd_supplier_name',
                            label: '供应商名称'
                          },
                          {
                            name: 'fd_org_code',
                            label: '组织机构代码'
                          },
                          {
                            name: 'fd_cooperation_status',
                            label: '供应商合作状态'
                          },
                          {
                            name: 'fd_supplier_simple_name',
                            label: '供应商简称'
                          },
                          {
                            name: 'fdFrame',
                            label: '所属框架'
                          }
                        ],
                        filters: [
                          {
                            name: 'fd_supplier_name',
                            label: '供应商名称'
                          },
                          {
                            name: 'fd_org_code',
                            label: '组织机构代码'
                          },
                          {
                            name: 'fd_cooperation_status',
                            label: '供应商合作状态'
                          },
                          {
                            name: 'fd_supplier_simple_name',
                            label: '供应商简称'
                          },
                          {
                            name: 'fdFrame',
                            label: '所属框架'
                          }
                        ],
                        isListThrough: true
                      }}
                      showStatus="edit"
                    ></XformRelation>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
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
              <GridItem column={1} row={14} rowSpan={1} columnSpan={20}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5hx79yiywiixyt0gwo}', '评审时间')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdApprovalTime'}>
                    <XformDatetime
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hx79yk16674uklzee}', '请输入')}
                      dataPattern={'yyyy/MM/dd'}
                      passValue={true}
                      showStatus="edit"
                    ></XformDatetime>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={21} row={14} rowSpan={1} columnSpan={4}>
                <XformFieldset compose={true}>
                  <Form.Item name={'fdCol1rfdbf'}>
                    <XformDescription
                      {...sysProps}
                      defaultTextValue={fmtMsg(':cmsProjectDemand.form.!{l5hxh9fpx14ur0jgeue}', '人数区间')}
                      showStatus="edit"
                    ></XformDescription>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={25} row={14} rowSpan={1} columnSpan={4}>
                <Form.Item name={'fdLowPerson'}>
                  <XformNumber
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hxk7elmfxiucq54kd}', '请输入')}
                    numberFormat={{
                      formatType: 'base'
                    }}
                    showStatus="edit"
                  ></XformNumber>
                </Form.Item>
              </GridItem>
              <GridItem column={29} row={14} rowSpan={1} columnSpan={4}>
                <XformFieldset compose={true}>
                  <Form.Item name={'fdColUso4hd'}>
                    <XformDescription
                      {...sysProps}
                      defaultTextValue={fmtMsg(':cmsProjectDemand.form.!{l5hxjc3iktyguac1yn8}', '至')}
                      showStatus="edit"
                    ></XformDescription>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={33} row={14} rowSpan={1} columnSpan={4}>
                <Form.Item name={'fdUpPerson'}>
                  <XformNumber
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectDemand.form.!{l5hxlsau5eqmbbchfv8}', '请输入')}
                    numberFormat={{
                      formatType: 'base'
                    }}
                    fdSysNumber={{}}
                    label={fmtMsg(':cmsProjectDemand.form.!{l5hxlsauo7w98rlogbn}', '人数区间上限')}
                    showStatus="edit"
                  ></XformNumber>
                </Form.Item>
              </GridItem>
              <GridItem column={1} row={17} rowSpan={1} columnSpan={40}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectDemand.form.!{l5jfuzfeh4xamxk7vb4}', '发布供应商')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdSupplies'}>
                    <XformRelation
                      {...sysProps}
                      renderMode={'mullist'}
                      direction={'column'}
                      rowCount={3}
                      modelName={'com.landray.sys.xform.core.entity.design.SysXFormDesign'}
                      isForwardView={'no'}
                      options={[
                        {
                          fdName: '选项1',
                          fdId: '1'
                        },
                        {
                          fdName: '选项2',
                          fdId: '2'
                        },
                        {
                          fdName: '选项3',
                          fdId: '3'
                        }
                      ]}
                      multi={true}
                      relationCfg={{
                        appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                        xformName: '供应商信息',
                        modelId: '1g777qg92w10wcf2w1jiihhv3oqp4s6nr9w0',
                        tableType: 'main',
                        tableName: 'mk_model_20220705vk0ha',
                        showFields: '$供应商名称$',
                        refFieldName: '$fd_supplier_name$'
                      }}
                      datasource={{
                        queryCollection: {
                          linkType: '$and',
                          query: []
                        },
                        sorters: [],
                        columns: [
                          {
                            name: 'fd_supplier_name',
                            label: '供应商名称'
                          },
                          {
                            name: 'fd_org_code',
                            label: '组织机构代码'
                          },
                          {
                            name: 'fd_cooperation_status',
                            label: '供应商合作状态'
                          },
                          {
                            name: 'fd_supplier_email',
                            label: '供应商邮箱'
                          },
                          {
                            name: 'fd_supplier_simple_name',
                            label: '供应商简称'
                          },
                          {
                            name: 'fd_desc',
                            label: '供应商简介'
                          }
                        ],
                        filters: [
                          {
                            name: 'fd_supplier_name',
                            label: '供应商名称'
                          },
                          {
                            name: 'fdFrame',
                            label: '所属框架'
                          }
                        ],
                        isListThrough: true
                      }}
                      showStatus="edit"
                    ></XformRelation>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={37} row={14} rowSpan={1} columnSpan={4}>
                <XformFieldset compose={true}>
                  <Form.Item name={'fdColSgzhna'}>
                    <XformDescription
                      {...sysProps}
                      defaultTextValue={fmtMsg(':cmsProjectDemand.form.!{l5hxjtwrindzux1zywk}', '人')}
                      showStatus="edit"
                    ></XformDescription>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={19} rowSpan={1} columnSpan={40}>
                <XformFieldset>
                  <Form.Item
                    name={'cmsProjectDemandOrder'}
                    noStyle
                    rules={[
                      {
                        validator: (rule, value, callback) => {
                          detailForms.current.cmsProjectDemandOrder.current
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
                      $$ref={detailForms.current.cmsProjectDemandOrder}
                      $$tableType="detail"
                      $$tableName="cmsProjectDemandOrder"
                      title={fmtMsg(':cmsProjectDemand.form.!{l5j1vtrejcmjzq5qx1f}', '订单响应')}
                      defaultRowNumber={1}
                      mobileRender={['simple']}
                      pcSetting={['pagination']}
                      showNumber={true}
                      layout={'vertical'}
                      columns={[
                        {
                          type: XformRelation,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j1xs1sd2qc3t4rrrk}', '供应商名称'),
                            name: 'fdSupplier',
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: [
                              {
                                fdName: '选项1',
                                fdId: '1'
                              },
                              {
                                fdName: '选项2',
                                fdId: '2'
                              },
                              {
                                fdName: '选项3',
                                fdId: '3'
                              }
                            ],
                            desktop: {
                              type: XformRelation
                            },
                            type: XformRelation,
                            relationCfg: {
                              appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                              xformName: '供应商信息',
                              modelId: '1g777qg92w10wcf2w1jiihhv3oqp4s6nr9w0',
                              tableType: 'main',
                              tableName: 'mk_model_20220705vk0ha',
                              showFields: '$供应商名称$',
                              refFieldName: '$fd_supplier_name$'
                            },
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j1xs1sd2qc3t4rrrk}', '供应商名称'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j1xs1sd2qc3t4rrrk}', '供应商名称')
                        },
                        {
                          type: XformRelation,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j22y5le315op72brr}', '姓名'),
                            name: 'fdOutName',
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            options: [
                              {
                                fdName: '选项1',
                                fdId: '1'
                              },
                              {
                                fdName: '选项2',
                                fdId: '2'
                              },
                              {
                                fdName: '选项3',
                                fdId: '3'
                              }
                            ],
                            desktop: {
                              type: XformRelation
                            },
                            type: XformRelation,
                            relationCfg: {
                              appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                              xformName: '外包人员信息',
                              modelId: '1g7tuuns0w13w13engw3a36caf238o0d15w0',
                              tableType: 'main',
                              tableName: 'mk_model_20220714k2uvx',
                              showFields: '$姓名$',
                              refFieldName: '$fd_name$'
                            },
                            isForwardView: 'no',
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j22y5le315op72brr}', '姓名'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j22y5le315op72brr}', '姓名')
                        },
                        {
                          type: XformRelation,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j233a3cz5onu9osf9}', '岗位名称'),
                            name: 'fdPost',
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: [
                              {
                                fdName: '选项1',
                                fdId: '1'
                              },
                              {
                                fdName: '选项2',
                                fdId: '2'
                              },
                              {
                                fdName: '选项3',
                                fdId: '3'
                              }
                            ],
                            desktop: {
                              type: XformRelation
                            },
                            type: XformRelation,
                            relationCfg: {
                              appCode: '1g776q10pw10w5j2w27q4fgr1u02jiv194w0',
                              xformName: '岗位信息',
                              modelId: '1g77748i8w10w776w1qndvaerni3ke2996w0',
                              tableType: 'main',
                              tableName: 'mk_model_2022070583983',
                              showFields: '$岗位名称$',
                              refFieldName: '$fd_post_name$'
                            },
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j233a3cz5onu9osf9}', '岗位名称'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j233a3cz5onu9osf9}', '岗位名称')
                        },
                        {
                          type: XformRelation,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j237hamltd6k6b6pe}', '所属框架'),
                            name: 'fdFrame',
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: [
                              {
                                fdName: '选项1',
                                fdId: '1'
                              },
                              {
                                fdName: '选项2',
                                fdId: '2'
                              },
                              {
                                fdName: '选项3',
                                fdId: '3'
                              }
                            ],
                            desktop: {
                              type: XformRelation
                            },
                            type: XformRelation,
                            relationCfg: {
                              appCode: '1g776q10pw10w5j2w27q4fgr1u02jiv194w0',
                              xformName: '框架信息',
                              modelId: '1g776skc9w10w5s5w1of8s041q6o7vv2liw0',
                              tableType: 'main',
                              tableName: 'mk_model_20220705d9xao',
                              showFields: '$框架名称$',
                              refFieldName: '$fd_name$'
                            },
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j237hamltd6k6b6pe}', '所属框架'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j237hamltd6k6b6pe}', '所属框架')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j24j36s9mgz4vszhs}', '自评级别'),
                            maxLength: 100,
                            name: 'fdSkillLevel',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5j24j386bisym5t39l}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j24j36s9mgz4vszhs}', '自评级别'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j24j36s9mgz4vszhs}', '自评级别')
                        },
                        {
                          type: XformSelect,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j24sendhb5tjvhw7a}', '评定级别'),
                            maxLength: 50,
                            name: 'fdConfirmLevel',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5j24seo1h8l92yt4xm}', '请输入'),
                            options: [
                              {
                                label: fmtMsg(':cmsProjectDemand.form.!{l5j24seq1gg6pqiybow}', '资深'),
                                value: '1'
                              },
                              {
                                label: fmtMsg(':cmsProjectDemand.form.!{l5j24ses1fai1xyih4x}', '高级'),
                                value: '2'
                              },
                              {
                                label: fmtMsg(':cmsProjectDemand.form.!{l5j24set7rq7xhaos9l}', '中级'),
                                value: '3'
                              },
                              {
                                label: fmtMsg(':cmsProjectDemand.form.!{l5j5le54dcrul6yz2ov}', '初级'),
                                value: '4'
                              }
                            ],
                            optionSource: 'custom',
                            desktop: {
                              type: XformSelect
                            },
                            type: XformSelect,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j24sendhb5tjvhw7a}', '评定级别'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j24sendhb5tjvhw7a}', '评定级别')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j2509v6emztje7u2j}', '邮箱'),
                            maxLength: 100,
                            name: 'fdEmail',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5j2509x5xkcmk4bd16}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j2509v6emztje7u2j}', '邮箱'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j2509v6emztje7u2j}', '邮箱')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j25jer26thjw90iqm}', '电话'),
                            maxLength: 100,
                            name: 'fdPhone',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5j25jeuplifqvy528s}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j25jer26thjw90iqm}', '电话'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j25jer26thjw90iqm}', '电话')
                        },
                        {
                          type: XformAttach,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j25yszc316bqtsrhl}', '简历'),
                            maxLength: 200,
                            name: 'fdResumeAtt',
                            singleMaxSize: 5120000,
                            desktop: {
                              type: XformAttach
                            },
                            type: XformAttach,
                            downloadCount: true,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j25yszc316bqtsrhl}', '简历'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j25yszc316bqtsrhl}', '简历')
                        },
                        {
                          type: XformRadio,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j26cqoz3wzsifnnwa}', '是否合格'),
                            maxLength: 50,
                            name: 'fdIsQualified',
                            options: [
                              {
                                label: fmtMsg(':cmsProjectDemand.form.!{l5j26cqvnum8db5jrhd}', '是'),
                                value: '1'
                              },
                              {
                                label: fmtMsg(':cmsProjectDemand.form.!{l5j26cqzjravhhpl8se}', '否'),
                                value: '0'
                              }
                            ],
                            rowCount: 3,
                            direction: 'column',
                            serialType: 'empty',
                            optionSource: 'custom',
                            desktop: {
                              type: XformRadio
                            },
                            type: XformRadio,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j26cqoz3wzsifnnwa}', '是否合格'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j26cqoz3wzsifnnwa}', '是否合格')
                        },
                        {
                          type: XformTextarea,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j26p7w7agm9t6dzoh}', '备注'),
                            maxLength: 2000,
                            name: 'fdRemarks',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5j26p7xe8i3jwpphtl}', '请输入'),
                            height: 3,
                            desktop: {
                              type: XformTextarea
                            },
                            type: XformTextarea,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j26p7w7agm9t6dzoh}', '备注'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j26p7w7agm9t6dzoh}', '备注')
                        },
                        {
                          type: XformButton,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j284e1tfa3eumv70i}', '操作'),
                            name: 'fdSendMessage',
                            btnCfg: {
                              inputVal: fmtMsg(':cmsProjectDemand.form.!{l5j284egz9yczrzil9}', '发送提醒'),
                              colorMap: {
                                background: {
                                  label: '背景色',
                                  color: '#4285F4'
                                },
                                font: {
                                  label: '文字色',
                                  color: '#fff'
                                }
                              }
                            },
                            typeCfg: {
                              type: 'url',
                              openWay: 'newPage'
                            },
                            desktop: {
                              type: XformButton
                            },
                            type: XformButton,
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j284e1tfa3eumv70i}', '操作'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5j284e1tfa3eumv70i}', '操作')
                        }
                      ]}
                      canAddRow={true}
                      canDeleteRow={true}
                      canImport={true}
                      showStatus="edit"
                    ></XformDetailTable>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
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
                      showStatus="edit"
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
                    rules={[
                      {
                        validator: lengthValidator(60)
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
                      showStatus="edit"
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
                      showStatus="edit"
                    ></XformDatetime>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={15} rowSpan={1} columnSpan={40}>
                <XformFieldset>
                  <Form.Item
                    name={'cmsProjectDemandWork'}
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
                            showStatus: 'edit'
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
                      canImport={true}
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
                          type: XformDatetime,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5jh2jka2sj0dsajqjh}', '预计入场时间'),
                            name: 'fdAdmissionTime',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5jh2jkboc2keesgybs}', '请输入'),
                            dataPattern: 'yyyy-MM-dd HH:mm',
                            desktop: {
                              type: XformDatetime
                            },
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5jh2jka2sj0dsajqjh}', '预计入场时间'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5jh2jka2sj0dsajqjh}', '预计入场时间'),
                          options: {
                            validateRules: {
                              required: true,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          }
                        },
                        {
                          type: XformDatetime,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5jh2mex4elh46zftko}', '要求响应时间'),
                            name: 'fdResponseTime',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5jh2meyd19wv6uamf}', '请输入'),
                            dataPattern: 'yyyy-MM-dd HH:mm',
                            desktop: {
                              type: XformDatetime
                            },
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5jh2mex4elh46zftko}', '要求响应时间'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5jh2mex4elh46zftko}', '要求响应时间'),
                          options: {
                            validateRules: {
                              required: true,
                              message: fmtMsg(':required', '内容不能为空')
                            }
                          }
                        },
                        {
                          type: XformRelation,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhou5kykloq4ftbr}', '岗位'),
                            name: 'fdPost',
                            renderMode: 'singlelist',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: [
                              {
                                fdName: '选项1',
                                fdId: '1'
                              },
                              {
                                fdName: '选项2',
                                fdId: '2'
                              },
                              {
                                fdName: '选项3',
                                fdId: '3'
                              }
                            ],
                            desktop: {
                              type: XformRelation
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
                            datasource: {
                              queryCollection: {
                                linkType: '$and',
                                query: []
                              },
                              sorters: [],
                              columns: [
                                {
                                  name: 'fd_post_name',
                                  label: '岗位名称'
                                },
                                {
                                  name: 'fd_base_require',
                                  label: '基本要求'
                                },
                                {
                                  name: 'fd_core_require',
                                  label: '核心要求'
                                },
                                {
                                  name: 'fdFrame',
                                  label: '框架类型'
                                }
                              ],
                              filters: [
                                {
                                  name: 'fd_post_name',
                                  label: '岗位名称'
                                },
                                {
                                  name: 'fd_base_require',
                                  label: '基本要求'
                                },
                                {
                                  name: 'fd_core_require',
                                  label: '核心要求'
                                },
                                {
                                  name: 'fdFrame',
                                  label: '框架类型'
                                }
                              ],
                              isListThrough: true
                            },
                            type: XformRelation,
                            showStatus: 'edit'
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
                          type: XformRelation,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhr73mut7qpku1m}', '技能等级'),
                            name: 'fdSkillLevel',
                            renderMode: 'singlelist',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: [
                              {
                                fdName: '选项1',
                                fdId: '1'
                              },
                              {
                                fdName: '选项2',
                                fdId: '2'
                              },
                              {
                                fdName: '选项3',
                                fdId: '3'
                              }
                            ],
                            desktop: {
                              type: XformRelation
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
                            outParams: {
                              params: [
                                {
                                  sourceField: {
                                    fdType: 'text',
                                    fdName: 'fdSkillRemand',
                                    tableName: 'cmsProjectDemandDetail'
                                  },
                                  targetField: {
                                    fdType: 'textarea',
                                    fdName: 'fd_remark',
                                    tableName: 'main'
                                  }
                                }
                              ]
                            },
                            datasource: {
                              queryCollection: {
                                linkType: '$and',
                                query: []
                              },
                              sorters: [],
                              columns: [
                                {
                                  name: 'fd_level_name',
                                  label: '级别名称'
                                },
                                {
                                  name: 'fd_remark',
                                  label: '学历与经验要求'
                                },
                                {
                                  name: 'fdFrame',
                                  label: '框架类型'
                                },
                                {
                                  name: 'fdCreator',
                                  label: '创建人'
                                },
                                {
                                  name: 'fdCreateTime',
                                  label: '创建时间'
                                }
                              ],
                              filters: [
                                {
                                  name: 'fd_level_name',
                                  label: '级别名称'
                                },
                                {
                                  name: 'fd_remark',
                                  label: '学历与经验要求'
                                },
                                {
                                  name: 'fdFrame',
                                  label: '框架类型'
                                },
                                {
                                  name: 'fdCreator',
                                  label: '创建人'
                                },
                                {
                                  name: 'fdCreateTime',
                                  label: '创建时间'
                                }
                              ],
                              isListThrough: true
                            },
                            type: XformRelation,
                            showStatus: 'edit'
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
                          }
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
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvhi5ruejee5eeyv}', '经验和技能要求'),
                            maxLength: 100,
                            name: 'fdSkillRemand',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5hvhi5shcphr934m3h}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'edit'
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
                      canAddRow={true}
                      canDeleteRow={true}
                      canImport={true}
                      showStatus="edit"
                    ></XformDetailTable>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={18} rowSpan={1} columnSpan={40}>
                <XformFieldset>
                  <Form.Item
                    name={'cmsProjectDemandSupp'}
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
                      columns={[
                        {
                          type: XformRelation,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5hvu8nbwvva3eaj5zf}', '供应商名称'),
                            name: 'fdSupplier',
                            renderMode: 'singlelist',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: [
                              {
                                fdName: '选项1',
                                fdId: '1'
                              },
                              {
                                fdName: '选项2',
                                fdId: '2'
                              },
                              {
                                fdName: '选项3',
                                fdId: '3'
                              }
                            ],
                            desktop: {
                              type: XformRelation
                            },
                            type: XformRelation,
                            relationCfg: {
                              appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                              xformName: '供应商信息',
                              modelId: '1g777qg92w10wcf2w1jiihhv3oqp4s6nr9w0',
                              tableType: 'main',
                              tableName: 'mk_model_20220705vk0ha',
                              showFields: '$供应商名称$',
                              refFieldName: '$fd_supplier_name$'
                            },
                            datasource: {
                              queryCollection: {
                                linkType: '$and',
                                query: []
                              },
                              sorters: [],
                              columns: [
                                {
                                  name: 'fd_supplier_name',
                                  label: '供应商名称'
                                },
                                {
                                  name: 'fd_org_code',
                                  label: '组织机构代码'
                                },
                                {
                                  name: 'fd_cooperation_status',
                                  label: '供应商合作状态'
                                },
                                {
                                  name: 'fd_supplier_email',
                                  label: '供应商邮箱'
                                },
                                {
                                  name: 'fd_supplier_simple_name',
                                  label: '供应商简称'
                                },
                                {
                                  name: 'fd_admin_account',
                                  label: '开通管理员账号'
                                },
                                {
                                  name: 'fdFrame',
                                  label: '所属框架'
                                },
                                {
                                  name: 'fd_desc',
                                  label: '供应商简介'
                                }
                              ],
                              filters: [
                                {
                                  name: 'fd_supplier_name',
                                  label: '供应商名称'
                                },
                                {
                                  name: 'fd_org_code',
                                  label: '组织机构代码'
                                },
                                {
                                  name: 'fd_cooperation_status',
                                  label: '供应商合作状态'
                                },
                                {
                                  name: 'fd_supplier_email',
                                  label: '供应商邮箱'
                                },
                                {
                                  name: 'fd_supplier_simple_name',
                                  label: '供应商简称'
                                },
                                {
                                  name: 'fd_admin_account',
                                  label: '开通管理员账号'
                                },
                                {
                                  name: 'fdFrame',
                                  label: '所属框架'
                                },
                                {
                                  name: 'fd_desc',
                                  label: '供应商简介'
                                }
                              ],
                              isListThrough: true
                            },
                            showStatus: 'edit'
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
                          type: XformRelation,
                          controlProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5j8fap7kgcwzldwypj}', '所属框架'),
                            name: 'fdFrame',
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: [
                              {
                                fdName: '选项1',
                                fdId: '1'
                              },
                              {
                                fdName: '选项2',
                                fdId: '2'
                              },
                              {
                                fdName: '选项3',
                                fdId: '3'
                              }
                            ],
                            desktop: {
                              type: XformRelation
                            },
                            type: XformRelation,
                            relationCfg: {
                              appCode: '1g776q10pw10w5j2w27q4fgr1u02jiv194w0',
                              xformName: '框架信息',
                              modelId: '1g776skc9w10w5s5w1of8s041q6o7vv2liw0',
                              tableType: 'main',
                              tableName: 'mk_model_20220705d9xao',
                              showFields: '$框架名称$',
                              refFieldName: '$fd_name$'
                            },
                            showStatus: 'edit'
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
                            showStatus: 'edit'
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
                            title: fmtMsg(':cmsProjectDemand.form.!{l5jg2w7y6utzbx015rj}', '本年度份额'),
                            maxLength: 100,
                            name: 'fdAnnualRatio',
                            placeholder: fmtMsg(':cmsProjectDemand.form.!{l5jg2w81dql7tlq4wp}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            showStatus: 'edit'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectDemand.form.!{l5jg2w7y6utzbx015rj}', '本年度份额'),
                            desktop: {
                              layout: 'vertical'
                            },
                            labelTextAlign: 'left'
                          },
                          label: fmtMsg(':cmsProjectDemand.form.!{l5jg2w7y6utzbx015rj}', '本年度份额')
                        }
                      ]}
                      canAddRow={true}
                      canDeleteRow={true}
                      canImport={true}
                      showStatus="edit"
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
