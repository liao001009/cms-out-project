import React, { useRef, createRef } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Form } from '@lui/core'
import { useApi, useSystem } from '@/mobile/shared/formHooks'
import XformAppearance from '@/mobile/components/form/XformAppearance'
import XformMDescription from '@/mobile/components/form/XformMDescription'
import XformFieldset from '@/mobile/components/form/XformFieldset'
import XformMInput from '@/mobile/components/form/XformMInput'
import XformMRelation from '@/mobile/components/form/XformMRelation'
import XformMAddress from '@/mobile/components/form/XformMAddress'
import XformMRtf from '@/mobile/components/form/XformMRtf'
import XformMDetailTable from '@/mobile/components/form/XformMDetailTable'
import XformRelation from '@/mobile/components/form/XformRelation'
import XformMTextarea from '@/mobile/components/form/XformMTextarea'

const MECHANISMNAMES = {}

const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectStaffList: createRef() as any
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
            <Form.Item name={'fdColUv007g'}>
              <XformMDescription
                {...sysProps}
                defaultTextValue={fmtMsg(':cmsProjectSelectInfo.form.!{l5luqhawfcol72uxfme}', '发布中选信息')}
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
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectSelectInfo.form.!{l5luvc6l7kcfxu610qi}', '主题')}
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
                placeholder={fmtMsg(':cmsProjectSelectInfo.form.!{l5luvc6m0fjjfi00tpz6}', '请输入')}
                showStatus="edit"
              ></XformMInput>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectSelectInfo.form.!{l5luujunniw1ehkz4od}', '项目名称')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdProject'}>
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
                  xformName: '项目库',
                  modelId: '1g77dc2o1w10w19a3w30f22612umq6uk3lw0',
                  tableType: 'main',
                  tableName: 'mk_model_202207052yvle',
                  showFields: '$项目名称$',
                  refFieldName: '$fd_name$'
                }}
                showStatus="view"
              ></XformMRelation>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectSelectInfo.form.!{l5luy97lcs2tji2td2q}', '项目编号')}
            layout={'horizontal'}
          >
            <Form.Item
              name={'fdProjectNum'}
              rules={[
                {
                  validator: lengthValidator(100)
                }
              ]}
            >
              <XformMInput
                {...sysProps}
                placeholder={fmtMsg(':cmsProjectSelectInfo.form.!{l5luy97m7eih0soi5ai}', '请输入')}
                showStatus="edit"
              ></XformMInput>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectSelectInfo.form.!{l5luypqfsx8hpajwtvq}', '项目负责人')}
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
                showStatus="edit"
              ></XformMAddress>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectSelectInfo.form.!{l5lv9ncd9rasnnkldum}', '中选供应商')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdSelectedSupplier'}>
              <XformMRelation
                {...sysProps}
                renderMode={'mullist'}
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
                layout={'horizontal'}
                direction={'column'}
                rowCount={3}
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
                      name: 'fd_frame',
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
                      name: 'fd_frame',
                      label: '所属框架'
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
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectSelectInfo.form.!{l5lv9ttgp5tnh2aaym}', '落选供应商')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdFailSupplier'}>
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
                      label: 'fd_supplier_name'
                    },
                    {
                      name: 'fd_org_code',
                      label: 'fd_org_code'
                    },
                    {
                      name: 'fd_cooperation_status',
                      label: 'fd_cooperation_status'
                    },
                    {
                      name: 'fd_supplier_simple_name',
                      label: 'fd_supplier_simple_name'
                    },
                    {
                      name: 'fd_frame',
                      label: 'fd_frame'
                    }
                  ],
                  filters: [
                    {
                      name: 'fd_supplier_name',
                      label: 'fd_supplier_name'
                    },
                    {
                      name: 'fd_org_code',
                      label: 'fd_org_code'
                    },
                    {
                      name: 'fd_cooperation_status',
                      label: 'fd_cooperation_status'
                    },
                    {
                      name: 'fd_frame',
                      label: 'fd_frame'
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
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectSelectInfo.form.!{l5m0dspgq56rtvxth9}', '描述说明')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdDesc'}>
              <XformMRtf
                {...sysProps}
                height={400}
                resize={true}
                defaultValueFormulaVO={{
                  type: 'Eval',
                  script:
                    '"根据面试结果，恭喜贵公司成为本项目的承接供应商。\\r\\n请收到本流程信息后请尽快根据中选人员名单要求与项目负责人确定后续事宜，谢谢"',
                  vo: {
                    mode: 'formula',
                    content:
                      '"根据面试结果，恭喜贵公司成为本项目的承接供应商。\\r\\n请收到本流程信息后请尽快根据中选人员名单要求与项目负责人确定后续事宜，谢谢"'
                  }
                }}
                viewPageSet={{
                  isSystem: true,
                  displayMode: 'adaptive'
                }}
                layout={'horizontal'}
                showStatus="edit"
              ></XformMRtf>
            </Form.Item>
          </XformFieldset>
          <XformFieldset>
            <Form.Item
              name={'cmsProjectStaffList'}
              noStyle
              rules={[
                {
                  validator: (rule, value, callback) => {
                    detailForms.current.cmsProjectStaffList.current
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
                $$ref={detailForms.current.cmsProjectStaffList}
                $$tableType="detail"
                $$tableName="cmsProjectStaffList"
                title={fmtMsg(':cmsProjectSelectInfo.form.!{l5lvuge7px2a82s75k}', '中选人员名单')}
                defaultRowNumber={1}
                mobileRender={['simple']}
                pcSetting={['pagination']}
                showNumber={true}
                layout={'vertical'}
                columns={[
                  {
                    type: XformMRelation,
                    controlProps: {
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvypnlzsscq0s59bm}', '姓名'),
                      name: 'fdOutName',
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
                      datasource: {
                        queryCollection: {
                          linkType: '$and',
                          query: []
                        },
                        sorters: [],
                        columns: [
                          {
                            name: 'fd_name',
                            label: '姓名'
                          },
                          {
                            name: 'fdSupplier',
                            label: '组织信息/所属供应商'
                          },
                          {
                            name: 'fd_work_address',
                            label: '工作地'
                          },
                          {
                            name: 'fdConfirmLevel',
                            label: '定级级别'
                          },
                          {
                            name: 'fdProject',
                            label: '当前项目'
                          },
                          {
                            name: 'fd_inner_team',
                            label: '当前所属招证内部团队'
                          },
                          {
                            name: 'fd_current_project_nature',
                            label: '当前项目性质'
                          },
                          {
                            name: 'fd_status_info',
                            label: '状态信息'
                          }
                        ],
                        filters: [
                          {
                            name: 'fd_name',
                            label: '姓名'
                          },
                          {
                            name: 'fdSupplier',
                            label: '组织信息/所属供应商'
                          },
                          {
                            name: 'fd_inner_team',
                            label: '当前所属招证内部团队'
                          },
                          {
                            name: 'fdProject',
                            label: '当前项目'
                          },
                          {
                            name: 'fd_current_project_nature',
                            label: '当前项目性质'
                          },
                          {
                            name: 'fd_status_info',
                            label: '状态信息'
                          }
                        ],
                        isListThrough: true
                      },
                      outParams: {
                        params: [
                          {
                            sourceField: {
                              fdType: 'relation',
                              fdName: 'fdSupplier',
                              tableName: 'cmsProjectStaffList'
                            },
                            targetField: {
                              fdType: 'relation',
                              fdName: 'fdSupplier',
                              tableName: 'main'
                            }
                          },
                          {
                            sourceField: {
                              fdType: 'relation',
                              fdName: 'fdConfirmLevel',
                              tableName: 'cmsProjectStaffList'
                            },
                            targetField: {
                              fdType: 'relation',
                              fdName: 'fdConfirmLevel',
                              tableName: 'main'
                            }
                          },
                          {
                            sourceField: {
                              fdType: 'text',
                              fdName: 'fdEmail',
                              tableName: 'cmsProjectStaffList'
                            },
                            targetField: {
                              fdType: 'text',
                              fdName: 'fdEmail',
                              tableName: 'main'
                            }
                          },
                          {
                            sourceField: {
                              fdType: 'text',
                              fdName: 'fdPhone',
                              tableName: 'cmsProjectStaffList'
                            },
                            targetField: {
                              fdType: 'text',
                              fdName: 'fd_mobile',
                              tableName: 'main'
                            }
                          }
                        ]
                      },
                      showStatus: 'edit'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvypnlzsscq0s59bm}', '姓名'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvypnlzsscq0s59bm}', '姓名')
                  },
                  {
                    type: XformMRelation,
                    controlProps: {
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvyw442h1gb4vaxv6}', '供应商名称'),
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
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvyw442h1gb4vaxv6}', '供应商名称'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvyw442h1gb4vaxv6}', '供应商名称')
                  },
                  {
                    type: XformMInput,
                    controlProps: {
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtg32atyhhmqjuqb}', '邮箱'),
                      maxLength: 100,
                      name: 'fdEmail',
                      placeholder: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtg35kok5qkk5j6o}', '请输入'),
                      mobile: {
                        type: XformMInput
                      },
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtg32atyhhmqjuqb}', '邮箱'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtg32atyhhmqjuqb}', '邮箱')
                  },
                  {
                    type: XformMInput,
                    controlProps: {
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtjaa6nyvxtjubli}', '电话'),
                      maxLength: 100,
                      name: 'fdPhone',
                      placeholder: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtjab5yc3bokqmpx}', '请输入'),
                      mobile: {
                        type: XformMInput
                      },
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtjaa6nyvxtjubli}', '电话'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtjaa6nyvxtjubli}', '电话')
                  },
                  {
                    type: XformMRelation,
                    controlProps: {
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvz3us0mcivqan3zxi}', '级别'),
                      name: 'fdConfirmLevel',
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
                      title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvz3us0mcivqan3zxi}', '级别'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvz3us0mcivqan3zxi}', '级别')
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
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectSelectInfo.form.!{l5lvnd7suu30hkja4ts}', '供应商确认')}
            layout={'horizontal'}
          >
            <Form.Item
              name={'fdConfirm'}
              rules={[
                {
                  validator: lengthValidator(2000)
                }
              ]}
            >
              <XformMTextarea
                {...sysProps}
                placeholder={fmtMsg(':cmsProjectSelectInfo.form.!{l5lvnd7uknt2pxu03br}', '请输入')}
                height={3}
                layout={'horizontal'}
                showStatus="edit"
              ></XformMTextarea>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectSelectInfo.form.!{l5m0hyqv7omae7rri8s}', '项目需求')}
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
                  showFields: '$主题$',
                  refFieldName: '$fd_subject$'
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
