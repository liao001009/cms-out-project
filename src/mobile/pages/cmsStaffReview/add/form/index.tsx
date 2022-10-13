import React, { useRef, createRef } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Form } from '@lui/core'
import { useApi, useSystem } from '@/mobile/shared/formHooks'
import XformAppearance from '@/mobile/components/form/XformAppearance'
import XformMDescription from '@/mobile/components/form/XformMDescription'
import XformFieldset from '@/mobile/components/form/XformFieldset'
import XformMInput from '@/mobile/components/form/XformMInput'
import XformMDatetime from '@/mobile/components/form/XformMDatetime'
import XformMAddress from '@/mobile/components/form/XformMAddress'
import XformMDetailTable from '@/mobile/components/form/XformMDetailTable'
import XformMRelation from '@/mobile/components/form/XformMRelation'
import XformRelation from '@/mobile/components/form/XformRelation'
import XformMNumber from '@/mobile/components/form/XformMNumber'
import XformNumber from '@/mobile/components/form/XformNumber'
import XformInput from '@/mobile/components/form/XformInput'
import XformMSelect from '@/mobile/components/form/XformMSelect'
import XformSelect from '@/mobile/components/form/XformSelect'

const MECHANISMNAMES = {}

const XForm = (props) => {
  const detailForms = useRef({
    cmsStaffReviewDetail: createRef() as any
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
    <div className="mui-xform">
      <Form form={form} colPadding={false} onValuesChange={onValuesChange}>
        <XformAppearance>
          <XformFieldset compose={true}>
            <Form.Item name={'fdColNiac8a'}>
              <XformMDescription
                {...sysProps}
                defaultTextValue={fmtMsg(':cmsStaffReview.form.!{l5j0eriwqaq645oi9c}', '外包人员评审')}
                controlValueStyle={{
                  fontSize: 20,
                  fontWeight: 'bold'
                }}
                showStatus="edit"
              ></XformMDescription>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'left'}
            title={fmtMsg(':cmsStaffReview.form.!{l5lt2wijkpj6veh7erc}', '主题')}
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
              <XformMInput
                {...sysProps}
                placeholder={fmtMsg(':cmsStaffReview.form.!{l5lt2wilcwzjvqs2jgf}', '请输入')}
                showStatus="edit"
              ></XformMInput>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            mobileContentAlign={'left'}
            title={fmtMsg(':cmsStaffReview.form.!{l5j0g416fp0yxl0edsu}', '实际笔试时间')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdRealWritTime'}>
              <XformMDatetime
                {...sysProps}
                placeholder={fmtMsg(':cmsStaffReview.form.!{l5j0g418no3yijxeenl}', '请输入')}
                dataPattern={'yyyy-MM-dd HH:mm'}
                layout={'horizontal'}
                showStatus="view"
              ></XformMDatetime>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'left'}
            title={fmtMsg(':cmsStaffReview.form.!{l5j0ghnmvqsssi3uhma}', '实际面试时间')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdRealViewTime'}>
              <XformMDatetime
                {...sysProps}
                placeholder={fmtMsg(':cmsStaffReview.form.!{l5j0ghnnw46tflgcf4}', '请输入')}
                dataPattern={'yyyy-MM-dd HH:mm'}
                layout={'horizontal'}
                showStatus="view"
              ></XformMDatetime>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'left'}
            title={fmtMsg(':cmsStaffReview.form.!{l5j0h4l0nmxpcwpcr8g}', '面试官')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdInterviewer'}>
              <XformMAddress
                {...sysProps}
                multi={true}
                org={{
                  orgTypeArr: ['8'],
                  defaultValueType: 'null'
                }}
                range={'all'}
                preSelectType={'fixed'}
                layout={'horizontal'}
                showStatus="view"
              ></XformMAddress>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'left'}
            title={fmtMsg(':cmsStaffReview.form.!{l5j0hb5rh5lpzp1vrxr}', '项目负责人')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdProjectLeader'}>
              <XformMAddress
                {...sysProps}
                org={{
                  orgTypeArr: ['8'],
                  defaultValueType: 'null'
                }}
                range={'all'}
                preSelectType={'fixed'}
                layout={'horizontal'}
                showStatus="view"
              ></XformMAddress>
            </Form.Item>
          </XformFieldset>
          <XformFieldset>
            <Form.Item
              name={'cmsStaffReviewDetail'}
              noStyle
              rules={[
                {
                  validator: (rule, value, callback) => {
                    detailForms.current.cmsStaffReviewDetail.current
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
              <XformMDetailTable
                {...sysProps}
                $$ref={detailForms.current.cmsStaffReviewDetail}
                $$tableType="detail"
                $$tableName="cmsStaffReviewDetail"
                title={fmtMsg(':cmsStaffReview.form.!{l5j0jr7f8uf2fuuf6aw}', '明细表1')}
                defaultRowNumber={1}
                mobileRender={['simple']}
                pcSetting={['pagination']}
                showNumber={true}
                layout={'vertical'}
                hiddenLabel={true}
                columns={[
                  {
                    type: XformMRelation,
                    controlProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0l4chmvb5xkzogfj}', '供应商'),
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
                      mobile: {
                        layout: 'vertical',
                        type: XformMRelation
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
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0l4chmvb5xkzogfj}', '供应商'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsStaffReview.form.!{l5j0l4chmvb5xkzogfj}', '供应商')
                  },
                  {
                    type: XformMNumber,
                    controlProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0lyj3k6s4h7uw24f}', '供应商排名'),
                      name: 'fdSupplierOrder',
                      placeholder: fmtMsg(':cmsStaffReview.form.!{l5j0lyj5ja7itscqnm}', '请输入'),
                      numberFormat: {
                        formatType: 'base'
                      },
                      mobile: {
                        layout: 'vertical',
                        type: XformMNumber
                      },
                      type: XformNumber,
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0lyj3k6s4h7uw24f}', '供应商排名'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsStaffReview.form.!{l5j0lyj3k6s4h7uw24f}', '供应商排名')
                  },
                  {
                    type: XformMRelation,
                    controlProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0m5k1v80p3j6skmo}', '姓名'),
                      name: 'fdOutName',
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
                      mobile: {
                        layout: 'vertical',
                        type: XformMRelation
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
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0m5k1v80p3j6skmo}', '姓名'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsStaffReview.form.!{l5j0m5k1v80p3j6skmo}', '姓名')
                  },
                  {
                    type: XformMInput,
                    controlProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0msdrihr3awr8jvj}', '自评级别'),
                      maxLength: 100,
                      name: 'fdSkillLevel',
                      placeholder: fmtMsg(':cmsStaffReview.form.!{l5j0msdthqxvlo7k5zu}', '请输入'),
                      mobile: {
                        layout: 'vertical',
                        type: XformMInput
                      },
                      type: XformInput,
                      showStatus: 'edit'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0msdrihr3awr8jvj}', '自评级别'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsStaffReview.form.!{l5j0msdrihr3awr8jvj}', '自评级别')
                  },
                  {
                    type: XformMSelect,
                    controlProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0nahjfal1c3vmzfc}', '笔试是否通过'),
                      maxLength: 50,
                      name: 'fdWrittenPass',
                      placeholder: fmtMsg(':cmsStaffReview.form.!{l5j0nahkr64j4nuj3ea}', '请输入'),
                      options: [
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0nahl0y0akd5zf5cn}', '通过'),
                          value: '1'
                        },
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0nahmg98vku77on}', '不通过'),
                          value: '0'
                        },
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0nahn1y66v7farvp}', '为参加笔试'),
                          value: '2'
                        }
                      ],
                      optionSource: 'custom',
                      mobile: {
                        layout: 'vertical',
                        type: XformMSelect
                      },
                      type: XformSelect,
                      showStatus: 'edit'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0nahjfal1c3vmzfc}', '笔试是否通过'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsStaffReview.form.!{l5j0nahjfal1c3vmzfc}', '笔试是否通过')
                  },
                  {
                    type: XformMSelect,
                    controlProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0ng04v9x21cf9o9j}', '面试是否通过'),
                      maxLength: 50,
                      name: 'fdInterviewPass',
                      placeholder: fmtMsg(':cmsStaffReview.form.!{l5j0ng04py3lhpxr629}', '请输入'),
                      options: [
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0ng053tzw396yy8r}', '通过'),
                          value: '1'
                        },
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0ng07cjyffcp11ke}', '不通过'),
                          value: '0'
                        },
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0ng08dbu57pugteq}', '为参面试'),
                          value: '2'
                        }
                      ],
                      optionSource: 'custom',
                      mobile: {
                        layout: 'vertical',
                        type: XformMSelect
                      },
                      type: XformSelect,
                      showStatus: 'edit'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0ng04v9x21cf9o9j}', '面试是否通过'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsStaffReview.form.!{l5j0ng04v9x21cf9o9j}', '面试是否通过')
                  },
                  {
                    type: XformMSelect,
                    controlProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5m8ahrw75gp6s7y6qi}', '评审结论'),
                      maxLength: 50,
                      name: 'fdConclusion',
                      placeholder: fmtMsg(':cmsStaffReview.form.!{l5m8ahrza8hcm760u3}', '请输入'),
                      options: [
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5m8ahs0tar8d084fyn}', '通过'),
                          value: '1'
                        },
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5m8ahs11zmhx09ox65}', '不通过'),
                          value: '0'
                        }
                      ],
                      optionSource: 'custom',
                      mobile: {
                        type: XformMSelect
                      },
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5m8ahrw75gp6s7y6qi}', '评审结论'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsStaffReview.form.!{l5m8ahrw75gp6s7y6qi}', '评审结论')
                  },
                  {
                    type: XformMRelation,
                    controlProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0obajl93mj68ky2f}', '定级'),
                      name: 'fdConfirmLevel',
                      placeholder: fmtMsg(':cmsStaffReview.form.!{l5j0oball6b84dapmal}', '请输入'),
                      options: [
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0obamvt9a487ivrk}', '选项1'),
                          value: '1'
                        },
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0obao2673dij5ja1}', '选项2'),
                          value: '2'
                        },
                        {
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0obapf66egvmgped}', '选项3'),
                          value: '3'
                        }
                      ],
                      optionSource: 'custom',
                      mobile: {
                        layout: 'vertical',
                        type: XformMRelation
                      },
                      type: XformRelation,
                      renderMode: 'select',
                      direction: 'column',
                      rowCount: 3,
                      modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                      isForwardView: 'no',
                      relationCfg: {
                        appCode: '1g776q10pw10w5j2w27q4fgr1u02jiv194w0',
                        xformName: '级别信息',
                        modelId: '1g777241qw10w6osw2h8p1ig2rgc7nf192w0',
                        tableType: 'main',
                        tableName: 'mk_model_20220705zz96g',
                        showFields: '$级别名称$',
                        refFieldName: '$fd_level_name$'
                      },
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsStaffReview.form.!{l5j0obajl93mj68ky2f}', '定级'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsStaffReview.form.!{l5j0obajl93mj68ky2f}', '定级')
                  }
                ]}
                canAddRow={true}
                canDeleteRow={true}
                canImport={true}
                showStatus="edit"
              ></XformMDetailTable>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'left'}
            title={fmtMsg(':cmsStaffReview.form.!{l5kvp3zj3qq76tpcbpy}', '中选供应商')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdSupplies'}>
              <XformMRelation
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
                  showFields: '$供应商简称$',
                  refFieldName: '$fd_supplier_simple_name$'
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
                      name: 'fd_admin_account',
                      label: '开通管理员账号'
                    },
                    {
                      name: 'fd_frame',
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
                      name: 'fd_frame',
                      label: '所属框架'
                    },
                    {
                      name: 'fd_desc',
                      label: '供应商简介'
                    }
                  ],
                  isListThrough: true
                }}
                showStatus="edit"
              ></XformMRelation>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'left'}
            title={fmtMsg(':cmsStaffReview.form.!{l5kvs0rsymu0ee2wucj}', '项目需求')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdProjectDemand'} hidden={true}>
              <XformMRelation
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
                layout={'horizontal'}
                relationCfg={{
                  appCode: '1g77dbphcw10w198swtqlij1fbb1uj3tkuw0',
                  xformName: '项目需求',
                  modelId: '1g7oh4ag9w11wci9gw3c6rh9h3ebmc2619w0',
                  tableType: 'main',
                  tableName: 'mk_model_202207128b999',
                  showFields: '$项目名称$',
                  refFieldName: '$fd_project$'
                }}
                showStatus="view"
              ></XformMRelation>
            </Form.Item>
          </XformFieldset>
        </XformAppearance>
      </Form>
    </div>
  )
}

export default XForm
