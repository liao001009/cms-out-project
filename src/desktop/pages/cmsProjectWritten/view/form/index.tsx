import React, { useRef, createRef, useEffect, useMemo } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Form } from '@lui/core'
import { useApi, useSystem } from '@/desktop/shared/formHooks'
import XformAppearance from '@/desktop/components/form/XformAppearance'
import LayoutGrid from '@/desktop/components/form/LayoutGrid'
import GridItem from '@/desktop/components/form/GridItem'
import XformDescription from '@/desktop/components/form/XformDescription'
import XformFieldset from '@/desktop/components/form/XformFieldset'
import XformDatetime from '@/desktop/components/form/XformDatetime'
import XformNumber from '@/desktop/components/form/XformNumber'
import XformAddress from '@/desktop/components/form/XformAddress'
import XformDetailTable from '@/desktop/components/form/XformDetailTable'
import XformRelation from '@/desktop/components/form/XformRelation'
import XformInput from '@/desktop/components/form/XformInput'
import XformSelect from '@/desktop/components/form/XformSelect'
import XformCheckbox from '@/desktop/components/form/XformCheckbox'
import { EShowStatus } from '@/types/showStatus'
import XformGetDataSelect from '@/desktop/components/cms/XformGetDataSelect'
import apiSupplier from '@/api/cmsSupplierInfo'
import CMSXformModal from '@/desktop/components/cms/XformModal'

const MECHANISMNAMES = {}
const baseCls = 'cmsProjectWritten-form'

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
  useEffect(() => {
    // 后端数据结构是字符串，要求前端用checkbox，所以只能转换
    form.setFieldsValue({
      fdNoticeSupplier: [value.fdNoticeSupplier],
      fdIsInterview: [value.fdIsInterview],
      fdNoticeInterviewer: [value.fdNoticeInterviewer]
    })
  }, [])

  const columns = useMemo(() => {
    const data: any[] = [
      {
        type: CMSXformModal,
        controlProps: {
          modalTitle: '姓名',
          chooseFdName: 'fdName',
          title: fmtMsg(':cmsProjectWritten.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
          name: 'fdInterviewName',
          renderMode: 'singlelist',
          direction: 'column',
          rowCount: 3,
          modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
          desktop: {
            type: CMSXformModal
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
          type: CMSXformModal,
          isForwardView: 'no',
          showStatus: 'view'
        },
        labelProps: {
          title: fmtMsg(':cmsProjectWritten.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
          desktop: {
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
        type: XformGetDataSelect,
        controlProps: {
          apiRequest: apiSupplier.list,
          showFdName: 'fdName',

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
          desktop: {
            type: XformGetDataSelect
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
          type: XformGetDataSelect,
          showStatus: EShowStatus.view
        },
        labelProps: {
          title: fmtMsg(':cmsProjectWritten.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称'),
          desktop: {
            layout: 'vertical'
          }
        },
        label: fmtMsg(':cmsProjectWritten.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称')
      },
      {
        type: XformSelect,
        controlProps: {
          title: fmtMsg(':cmsProjectWritten.form.!{l5izeh8ya568lfqhw1}', '学历'),
          maxLength: 50,
          name: 'fdMajor',
          placeholder: fmtMsg(':cmsProjectWritten.form.!{l5i2sy277m7ezhzujdi}', '请输入'),
          options: [
            {
              label: fmtMsg(':cmsProjectWritten.form.!{l3lb8gpoaz0xj1znu5e}', '高中'),
              value: '1'
            },
            {
              label: fmtMsg(':cmsProjectWritten.form.!{l3lb8gpqsa1dkyunv4g}', '专科'),
              value: '2'
            },
            {
              label: fmtMsg(':cmsProjectWritten.form.!{l3lb8gptifemq19c12}', '本科'),
              value: '3'
            },
            {
              label: fmtMsg(':cmsProjectWritten.form.!{l3lb8gpvwi2j25x1zbt}', '研究生'),
              value: '4'
            }
          ],
          optionSource: 'custom',
          desktop: {
            type: XformSelect
          },
          type: XformSelect,
          showStatus: EShowStatus.view
        },
        labelProps: {
          title: fmtMsg(':cmsProjectWritten.form.!{l5izeh8ya568lfqhw1}', '学历'),
          desktop: {
            layout: 'vertical'
          }
        },
        label: fmtMsg(':cmsProjectWritten.form.!{l5izeh8ya568lfqhw1}', '学历')
      },
      {
        type: XformInput,
        controlProps: {
          title: fmtMsg(':cmsProjectWritten.form.!{l5i2r5c8ax8fakvlo08}', '邮箱'),
          maxLength: 100,
          name: 'fdEmail',
          placeholder: fmtMsg(':cmsProjectWritten.form.!{l5i2r5c9cv95w3a6gai}', '请输入'),
          desktop: {
            type: XformInput
          },
          type: XformInput,
          showStatus: 'view'
        },
        labelProps: {
          title: fmtMsg(':cmsProjectWritten.form.!{l5i2r5c8ax8fakvlo08}', '邮箱'),
          desktop: {
            layout: 'vertical'
          }
        },
        label: fmtMsg(':cmsProjectWritten.form.!{l5i2r5c8ax8fakvlo08}', '邮箱')
      },
      {
        type: XformNumber,
        controlProps: {
          title: fmtMsg(':cmsProjectWritten.form.!{l5i2r9d4aemiawkvbr}', '笔试得分'),
          name: 'fdWrittenScores',
          placeholder: fmtMsg(':cmsProjectWritten.form.!{l5i2r9d5i4h8wdz6su}', '请输入'),
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
          title: fmtMsg(':cmsProjectWritten.form.!{l5i2r9d4aemiawkvbr}', '笔试得分'),
          desktop: {
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
        type: XformSelect,
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
          desktop: {
            type: XformSelect
          },
          type: XformSelect,
          passValue: true,
          showStatus: 'view'
        },
        labelProps: {
          title: fmtMsg(':cmsProjectWritten.form.!{l5i2sy26tahw90jp8ej}', '是否通过笔试'),
          desktop: {
            layout: 'vertical'
          }
        },
        label: fmtMsg(':cmsProjectWritten.form.!{l5i2sy26tahw90jp8ej}', '是否通过笔试')
      },

    ]
    if (value.fdIsInterview === '1') {
      data.push(
        {
          type: XformDatetime,
          controlProps: {
            title: fmtMsg(':cmsProjectWritten.form.!{l5iziae2bzq0rckmq6}', '计划面试开始时间'),
            name: 'fdBeginTime',
            placeholder: fmtMsg(':cmsProjectWritten.form.!{l5iziae44d2by5dyv7w}', '请输入'),
            dataPattern: 'yyyy-MM-dd HH/mm',
            desktop: {
              type: XformDatetime
            },
            showStatus: 'view'
          },
          labelProps: {
            title: fmtMsg(':cmsProjectWritten.form.!{l5iziae2bzq0rckmq6}', '计划面试开始时间'),
            desktop: {
              layout: 'vertical'
            }
          },
          label: fmtMsg(':cmsProjectWritten.form.!{l5iziae2bzq0rckmq6}', '计划面试开始时间')
        },
        {
          type: XformDatetime,
          controlProps: {
            title: fmtMsg(':cmsProjectWritten.form.!{l5izhz77fjktqau4o6p}', '计划面试结束时间'),
            name: 'fdEndTime',
            placeholder: fmtMsg(':cmsProjectWritten.form.!{l5izhz78u9a8rffwcyn}', '请输入'),
            dataPattern: 'yyyy-MM-dd HH/mm',
            desktop: {
              type: XformDatetime
            },
            showStatus: 'view'
          },
          labelProps: {
            title: fmtMsg(':cmsProjectWritten.form.!{l5izhz77fjktqau4o6p}', '计划面试结束时间'),
            desktop: {
              layout: 'vertical'
            }
          },
          label: fmtMsg(':cmsProjectWritten.form.!{l5izhz77fjktqau4o6p}', '计划面试结束时间')
        },
        {
          type: XformInput,
          controlProps: {
            title: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号'),
            maxLength: 100,
            name: 'fdMeetingNum',
            placeholder: fmtMsg(':cmsProjectWritten.form.!{l5izigstkbcmoluwehn}', '请输入'),
            desktop: {
              type: XformInput
            },
            showStatus: 'view'
          },
          labelProps: {
            title: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号'),
            desktop: {
              layout: 'vertical'
            }
          },
          label: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号')
        }
      )
    }
    return data
  }, [])



  return (
    <div className={baseCls}>
      <div className="lui-xform">
        <Form form={form} colPadding={false} onValuesChange={onValuesChange}>
          <XformAppearance>
            <LayoutGrid columns={2} rows={9}>
              <GridItem
                column={1}
                row={1}
                columnSpan={2}
                rowSpan={1}
                style={{
                  textAlign: 'center',
                  justifyContent: 'center'
                }}
              >
                <XformFieldset compose={true}>
                  <Form.Item name={'fdCol5hz0vs'}>
                    <XformDescription
                      {...sysProps}
                      defaultTextValue={fmtMsg(':cmsProjectWritten.form.!{l5hz6ugsxfxlg2nyfs7}', '录入笔试成绩')}
                      controlValueStyle={{
                        fontSize: 20,
                        fontWeight: 'bold'
                      }}
                      showStatus="view"
                    ></XformDescription>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem
                column={2}
                row={1}
                style={{
                  display: 'none',
                  textAlign: 'center',
                  justifyContent: 'center'
                }}
                rowSpan={1}
                columnSpan={1}
              ></GridItem>
              <GridItem column={1} row={2} rowSpan={1} columnSpan={1}>
                <XformFieldset
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectWritten.form.!{l5hz9wxb6v3gf05totp}', '笔试时间')}
                  layout={'horizontal'}
                  labelTextAlign={'left'}
                  required={true}
                >
                  <Form.Item name={'fdWrittenTime'}>
                    <XformDatetime
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectWritten.form.!{l5hz9wxdne6ahfqosua}', '请输入')}
                      dataPattern={'yyyy-MM-dd HH/mm'}
                      showStatus="view"
                    ></XformDatetime>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={2} row={2} rowSpan={1} columnSpan={1}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectWritten.form.!{l5hzdv81cemh8kpfcn}', '合格分数线')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item name={'fdQualifiedMark'}>
                    <XformNumber
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectWritten.form.!{l5hzdv832ve43rgmhqh}', '请输入')}
                      numberFormat={{
                        formatType: 'base'
                      }}
                      showStatus="view"
                    ></XformNumber>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={3} rowSpan={1} columnSpan={1}>
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
              <GridItem column={2} row={3} rowSpan={1} columnSpan={1}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectWritten.fdCreateTime', '创建时间')}
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
              <GridItem column={1} row={4} columnSpan={2} rowSpan={1}>
                <XformFieldset>
                  <Form.Item
                    name={'cmsProjectWrittenDe'}
                    validateTrigger={false}
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
                    <XformDetailTable
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
                      columns={columns}
                      canExport={false}
                      showStatus="view"
                    ></XformDetailTable>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem
                column={2}
                row={4}
                style={{
                  display: 'none'
                }}
                rowSpan={1}
                columnSpan={1}
              ></GridItem>
              <GridItem
                column={2}
                row={9}
                style={{
                  display: 'none'
                }}
                rowSpan={1}
                columnSpan={1}
              ></GridItem>
              <GridItem
                column={2}
                row={8}
                style={{
                  display: 'none'
                }}
                rowSpan={1}
                columnSpan={1}
              ></GridItem>
              <GridItem column={1} row={5} rowSpan={1} columnSpan={1}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectWritten.form.!{l5hzk88ieqeuw2kxojw}', '是否面试')}
                  layout={'horizontal'}
                  hidden={value.fdIsInterview === '0'}
                >
                  <Form.Item
                    name={'fdIsInterview'}
                    rules={[
                      {
                        validator: lengthValidator(200)
                      }
                    ]}
                  >
                    <XformCheckbox
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
                      showStatus="view"
                    ></XformCheckbox>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={2} row={5} rowSpan={1} columnSpan={1}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectWritten.form.!{l5hzlb769gv64l5j7ke}', '面试官')}
                  layout={'horizontal'}
                  hidden={value.fdIsInterview === '0'}
                >
                  <Form.Item name={'fdInterviewer'}>
                    <XformAddress
                      {...sysProps}
                      multi={true}
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
              <GridItem column={1} row={6} columnSpan={1} rowSpan={1}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectWritten.form.!{l5hzkchugrzq1fyh4b}', '邮件通知供应商')}
                  layout={'horizontal'}
                  hidden={value.fdNoticeSupplier === '0' || value.fdIsInterview === '0'}
                >
                  <Form.Item
                    name={'fdNoticeSupplier'}
                    rules={[
                      {
                        validator: lengthValidator(200)
                      }
                    ]}
                  >
                    <XformCheckbox
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
                      showStatus="view"
                    ></XformCheckbox>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={2} row={6} columnSpan={1} rowSpan={1}>
                <XformFieldset
                  hidden={value.fdNoticeSupplier === '0' || value.fdIsInterview === '0'}
                >
                  <Form.Item name={'fdSupplierTotal'}>
                    <XformRelation
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
                    ></XformRelation>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem
                column={2}
                row={6}
                style={{
                  display: 'none'
                }}
                rowSpan={1}
                columnSpan={1}
              ></GridItem>
              <GridItem column={1} row={7} columnSpan={2} rowSpan={1}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectWritten.form.!{l5hzkx122azhemlsism}', '邮件通知面试官')}
                  layout={'horizontal'}
                  hidden={value.fdNoticeInterviewer === '0' || value.fdIsInterview === '0'}
                >
                  <Form.Item
                    name={'fdNoticeInterviewer'}
                    rules={[
                      {
                        validator: lengthValidator(200)
                      }
                    ]}
                  >
                    <XformCheckbox
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
                      showStatus="view"
                    ></XformCheckbox>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem
                column={2}
                row={7}
                style={{
                  display: 'none'
                }}
                rowSpan={1}
                columnSpan={1}
              ></GridItem>
            </LayoutGrid>
          </XformAppearance>
        </Form>
      </div>
    </div>
  )
}

export default XForm
