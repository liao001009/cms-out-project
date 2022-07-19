import React, { useRef, createRef } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Form } from '@lui/core'
import { useApi, useSystem } from '@/mobile/shared/formHooks'
import XformAppearance from '@/mobile/components/form/XformAppearance'
import XformMDescription from '@/mobile/components/form/XformMDescription'
import XformFieldset from '@/mobile/components/form/XformFieldset'
import XformMDatetime from '@/mobile/components/form/XformMDatetime'
import XformMNumber from '@/mobile/components/form/XformMNumber'
import XformMAddress from '@/mobile/components/form/XformMAddress'
import XformMDetailTable from '@/mobile/components/form/XformMDetailTable'
import XformMRelation from '@/mobile/components/form/XformMRelation'
import XformRelation from '@/mobile/components/form/XformRelation'
import XformMInput from '@/mobile/components/form/XformMInput'
import XformInput from '@/mobile/components/form/XformInput'
import XformNumber from '@/mobile/components/form/XformNumber'
import XformMSelect from '@/mobile/components/form/XformMSelect'
import XformSelect from '@/mobile/components/form/XformSelect'
import XformMCheckbox from '@/mobile/components/form/XformMCheckbox'

const MECHANISMNAMES = {}

const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectWrittenDe: createRef() as any
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
            <Form.Item name={'fdCol5hz0vs'}>
              <XformMDescription
                {...sysProps}
                defaultTextValue={fmtMsg(':cmsProjectWritten.form.!{l5hz6ugsxfxlg2nyfs7}', '录入笔试成绩')}
                layout={'horizontal'}
                showStatus="view"
              ></XformMDescription>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectWritten.form.!{l5hz9wxb6v3gf05totp}', '笔试时间')}
            layout={'horizontal'}
            labelTextAlign={'left'}
            required={true}
          >
            <Form.Item name={'fdWrittenTime'}>
              <XformMDatetime
                {...sysProps}
                placeholder={fmtMsg(':cmsProjectWritten.form.!{l5hz9wxdne6ahfqosua}', '请输入')}
                dataPattern={'yyyy-MM-dd HH:mm'}
                layout={'horizontal'}
                showStatus="view"
              ></XformMDatetime>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectWritten.form.!{l5hzdv81cemh8kpfcn}', '合格分数线')}
            layout={'horizontal'}
            required={true}
          >
            <Form.Item name={'fdQualifiedMark'}>
              <XformMNumber
                {...sysProps}
                placeholder={fmtMsg(':cmsProjectWritten.form.!{l5hzdv832ve43rgmhqh}', '请输入')}
                numberFormat={{
                  formatType: 'base'
                }}
                layout={'horizontal'}
                showStatus="view"
              ></XformMNumber>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectWritten.fdCreator', '创建者')}
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
              <XformMAddress
                {...sysProps}
                org={{
                  orgTypeArr: ['8'],
                  defaultValueType: 'null'
                }}
                range={'all'}
                preSelectType={'fixed'}
                showStatus="view"
              ></XformMAddress>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectWritten.fdCreateTime', '创建时间')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdCreateTime'}>
              <XformMDatetime
                {...sysProps}
                placeholder={'请输入'}
                dataPattern={'yyyy-MM-dd'}
                layout={'horizontal'}
                showStatus="view"
              ></XformMDatetime>
            </Form.Item>
          </XformFieldset>
          <XformFieldset>
            <Form.Item
              name={'cmsProjectWrittenDe'}
              noStyle
              rules={[
                {
                  validator: (rule, value, callback) => {
                    detailForms.current.cmsProjectWrittenDe.current
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
                $$ref={detailForms.current.cmsProjectWrittenDe}
                $$tableType="detail"
                $$tableName="cmsProjectWrittenDe"
                title={fmtMsg(':cmsProjectWritten.form.!{l5hzifw3j5ed7kldmk9}', '明细表1')}
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
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
                      name: 'fdInterviewName',
                      renderMode: 'singlelist',
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
                      mobile: {
                        layout: 'vertical',
                        type: XformMRelation
                      },
                      relationCfg: {
                        appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                        xformName: '外包人员信息',
                        modelId: '1g7tuuns0w13w13engw3a36caf238o0d15w0',
                        tableType: 'main',
                        tableName: 'mk_model_20220714k2uvx',
                        showFields: '$姓名$',
                        refFieldName: '$fd_name$'
                      },
                      type: XformRelation,
                      isForwardView: 'no',
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
                            name: 'fd_project',
                            label: '当前项目'
                          },
                          {
                            name: 'fd_inner_team',
                            label: '当前所属招证内部团队'
                          },
                          {
                            name: 'fd_confirm_level',
                            label: '定级级别'
                          },
                          {
                            name: 'fdSupplier',
                            label: '组织信息/所属供应商'
                          },
                          {
                            name: 'fd_entry_date',
                            label: '参加工作日期'
                          },
                          {
                            name: 'fd_work_address',
                            label: '工作地'
                          },
                          {
                            name: 'fd_current_project_nature',
                            label: '当前项目性质'
                          },
                          {
                            name: 'fd_status_info',
                            label: '状态信息'
                          },
                          {
                            name: 'fd_last_upgrade_date',
                            label: '上次调级时间'
                          },
                          {
                            name: 'fd_first_entrance_date',
                            label: '首次入场时间'
                          }
                        ],
                        filters: [
                          {
                            name: 'fd_name',
                            label: '姓名'
                          },
                          {
                            name: 'fd_project',
                            label: '当前项目'
                          },
                          {
                            name: 'fd_inner_team',
                            label: '当前所属招证内部团队'
                          },
                          {
                            name: 'fd_confirm_level',
                            label: '定级级别'
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
                            name: 'fd_last_upgrade_date',
                            label: '上次调级时间'
                          },
                          {
                            name: 'fd_first_entrance_date',
                            label: '首次入场时间'
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
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectWritten.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
                    options: {
                      validateRules: {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    }
                  },
                  {
                    type: XformMRelation,
                    controlProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称'),
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
                      relationCfg: {
                        appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                        xformName: '供应商信息',
                        modelId: '1g777qg92w10wcf2w1jiihhv3oqp4s6nr9w0',
                        tableType: 'main',
                        tableName: 'mk_model_20220705vk0ha',
                        showFields: '$供应商名称$',
                        refFieldName: '$fd_supplier_name$'
                      },
                      type: XformRelation,
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectWritten.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称')
                  },
                  {
                    type: XformMInput,
                    controlProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5izeh8ya568lfqhw1}', '学历'),
                      maxLength: 100,
                      name: 'fdMajor',
                      placeholder: fmtMsg(':cmsProjectWritten.form.!{l5izeh91gp0ih9z8wmv}', '请输入'),
                      mobile: {
                        layout: 'vertical',
                        type: XformMInput
                      },
                      passValue: true,
                      type: XformInput,
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5izeh8ya568lfqhw1}', '学历'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectWritten.form.!{l5izeh8ya568lfqhw1}', '学历')
                  },
                  {
                    type: XformMInput,
                    controlProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2r5c8ax8fakvlo08}', '邮箱'),
                      maxLength: 100,
                      name: 'fdEmail',
                      placeholder: fmtMsg(':cmsProjectWritten.form.!{l5i2r5c9cv95w3a6gai}', '请输入'),
                      mobile: {
                        layout: 'vertical',
                        type: XformMInput
                      },
                      type: XformInput,
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2r5c8ax8fakvlo08}', '邮箱'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectWritten.form.!{l5i2r5c8ax8fakvlo08}', '邮箱')
                  },
                  {
                    type: XformMNumber,
                    controlProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2r9d4aemiawkvbr}', '笔试得分'),
                      name: 'fdWrittenScores',
                      placeholder: fmtMsg(':cmsProjectWritten.form.!{l5i2r9d5i4h8wdz6su}', '请输入'),
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
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2r9d4aemiawkvbr}', '笔试得分'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectWritten.form.!{l5i2r9d4aemiawkvbr}', '笔试得分'),
                    options: {
                      validateRules: {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    }
                  },
                  {
                    type: XformMSelect,
                    controlProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2sy26tahw90jp8ej}', '是否通过笔试'),
                      maxLength: 50,
                      name: 'fdWrittenPass',
                      placeholder: fmtMsg(':cmsProjectWritten.form.!{l5i2sy277m7ezhzujdi}', '请输入'),
                      options: [
                        {
                          label: fmtMsg(':cmsProjectWritten.form.!{l5i2sy28xusq600dt4r}', '通过'),
                          value: '1'
                        },
                        {
                          label: fmtMsg(':cmsProjectWritten.form.!{l5i2sy2bt4d2xu68k4d}', '不通过'),
                          value: '0'
                        }
                      ],
                      optionSource: 'custom',
                      mobile: {
                        layout: 'vertical',
                        type: XformMSelect
                      },
                      type: XformSelect,
                      passValue: true,
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5i2sy26tahw90jp8ej}', '是否通过笔试'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectWritten.form.!{l5i2sy26tahw90jp8ej}', '是否通过笔试')
                  },
                  {
                    type: XformMDatetime,
                    controlProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5iziae2bzq0rckmq6}', '计划面试开始时间'),
                      name: 'fdBeginTime',
                      placeholder: fmtMsg(':cmsProjectWritten.form.!{l5iziae44d2by5dyv7w}', '请输入'),
                      dataPattern: 'yyyy-MM-dd HH:mm',
                      mobile: {
                        type: XformMDatetime
                      },
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5iziae2bzq0rckmq6}', '计划面试开始时间'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectWritten.form.!{l5iziae2bzq0rckmq6}', '计划面试开始时间')
                  },
                  {
                    type: XformMDatetime,
                    controlProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5izhz77fjktqau4o6p}', '计划面试结束时间'),
                      name: 'fdEndTime',
                      placeholder: fmtMsg(':cmsProjectWritten.form.!{l5izhz78u9a8rffwcyn}', '请输入'),
                      dataPattern: 'yyyy-MM-dd HH:mm',
                      mobile: {
                        type: XformMDatetime
                      },
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5izhz77fjktqau4o6p}', '计划面试结束时间'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectWritten.form.!{l5izhz77fjktqau4o6p}', '计划面试结束时间')
                  },
                  {
                    type: XformMInput,
                    controlProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号'),
                      maxLength: 100,
                      name: 'fdMeetingNum',
                      placeholder: fmtMsg(':cmsProjectWritten.form.!{l5izigstkbcmoluwehn}', '请输入'),
                      mobile: {
                        type: XformMInput
                      },
                      showStatus: 'view'
                    },
                    labelProps: {
                      title: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号'),
                      mobile: {
                        layout: 'vertical'
                      }
                    },
                    label: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号')
                  }
                ]}
                canExport={true}
                showStatus="view"
              ></XformMDetailTable>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectWritten.form.!{l5hzk88ieqeuw2kxojw}', '是否面试')}
            layout={'horizontal'}
          >
            <Form.Item
              name={'fdIsInterview'}
              rules={[
                {
                  validator: lengthValidator(200)
                }
              ]}
            >
              <XformMCheckbox
                {...sysProps}
                multi={true}
                options={[
                  {
                    label: fmtMsg(':cmsProjectWritten.form.!{l5hzk88kh63ne41czl}', '是'),
                    value: '1'
                  }
                ]}
                rowCount={3}
                direction={'column'}
                serialType={'empty'}
                optionSource={'custom'}
                layout={'horizontal'}
                showStatus="view"
              ></XformMCheckbox>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectWritten.form.!{l5hzlb769gv64l5j7ke}', '面试官')}
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
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectWritten.form.!{l5hzkchugrzq1fyh4b}', '邮件通知供应商')}
            layout={'horizontal'}
          >
            <Form.Item
              name={'fdNoticeSupplier'}
              rules={[
                {
                  validator: lengthValidator(200)
                }
              ]}
            >
              <XformMCheckbox
                {...sysProps}
                multi={true}
                options={[
                  {
                    label: fmtMsg(':cmsProjectWritten.form.!{l5hzkchwh5z2hpqmbm6}', '是'),
                    value: '1'
                  }
                ]}
                rowCount={3}
                direction={'column'}
                serialType={'empty'}
                optionSource={'custom'}
                layout={'horizontal'}
                showStatus="view"
              ></XformMCheckbox>
            </Form.Item>
          </XformFieldset>
          <Form.Item name={'fdSupplierTotal'}>
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
                  }
                ],
                filters: [],
                isListThrough: true
              }}
              direction={'column'}
              rowCount={3}
              showStatus="view"
            ></XformMRelation>
          </Form.Item>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectWritten.form.!{l5hzkx122azhemlsism}', '邮件通知面试官')}
            layout={'horizontal'}
          >
            <Form.Item
              name={'fdNoticeInterviewer'}
              rules={[
                {
                  validator: lengthValidator(200)
                }
              ]}
            >
              <XformMCheckbox
                {...sysProps}
                multi={true}
                options={[
                  {
                    label: fmtMsg(':cmsProjectWritten.form.!{l5hzkx14yy8eit54dhn}', '是'),
                    value: '1'
                  }
                ]}
                rowCount={3}
                direction={'column'}
                serialType={'empty'}
                optionSource={'custom'}
                layout={'horizontal'}
                showStatus="view"
              ></XformMCheckbox>
            </Form.Item>
          </XformFieldset>
          <XformFieldset
            labelTextAlign={'left'}
            mobileContentAlign={'right'}
            title={fmtMsg(':cmsProjectWritten.form.!{l5iypuiahn8xqzb9qmc}', '项目需求')}
            layout={'horizontal'}
          >
            <Form.Item name={'fdProjectDemand'}>
              <XformMRelation
                {...sysProps}
                renderMode={'select'}
                direction={'column'}
                rowCount={3}
                modelName={'com.landray.sys.xform.core.entity.design.SysXFormDesign'}
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
                isForwardView={'no'}
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
