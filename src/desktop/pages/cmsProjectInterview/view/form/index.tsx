import apiStaffInfo from '@/api/cmsOutStaffInfo'
import apiSupplier from '@/api/cmsSupplierInfo'
import CMSXformModal, { EShowStatus } from '@/desktop/components/cms/XformModal'
import GridItem from '@/desktop/components/form/GridItem'
import LayoutGrid from '@/desktop/components/form/LayoutGrid'
import XformAddress from '@/desktop/components/form/XformAddress'
import XformAppearance from '@/desktop/components/form/XformAppearance'
import XformDatetime from '@/desktop/components/form/XformDatetime'
import XformDescription from '@/desktop/components/form/XformDescription'
import XformDetailTable from '@/desktop/components/form/XformDetailTable'
import XformFieldset from '@/desktop/components/form/XformFieldset'
import XformInput from '@/desktop/components/form/XformInput'
import XformNumber from '@/desktop/components/form/XformNumber'
import XformSelect from '@/desktop/components/form/XformSelect'
import { useApi, useSystem } from '@/desktop/shared/formHooks'
import { fmtMsg } from '@ekp-infra/respect'
import { Form } from '@lui/core'
import React, { createRef, useEffect, useRef, useState } from 'react'
import './index.scss'

const MECHANISMNAMES = {}

const baseCls = 'cmsProjectInterview-form'
const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectInterDetail: createRef() as any
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
  const [supplierData, setSupplierData] = useState<any>([])
  const init = async () => {
    try {
      const res = await apiSupplier.listSupplierInfo({})
      const arr = res.data.content.map(i => {
        const item = {
          value: i.fdId,
          label: i.fdName,
          ...i
        }
        return item
      })
      setSupplierData(arr)
    } catch (error) {
      console.log('error', error)
    }
  }
  useEffect(() => {
    init()
  }, [])
  return (
    <div className={baseCls}>
      <div className="lui-xform">
        <Form form={form} colPadding={false} onValuesChange={onValuesChange}>
          <XformAppearance>
            <LayoutGrid columns={2} rows={6}>
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
                      defaultTextValue={fmtMsg(':cmsProjectInterview.form.!{l5hz6ugsxfxlg2nyfs7}', '录入面试成绩')}
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
                  title={fmtMsg(':cmsProjectInterview.form.!{l5hz9wxb6v3gf05totp}', '实际面试时间')}
                  layout={'horizontal'}
                  labelTextAlign={'left'}
                  required={true}
                >
                  <Form.Item name={'fdInterviewTime'}>
                    <XformDatetime
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectInterview.form.!{l5hz9wxdne6ahfqosua}', '请输入')}
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
                  title={fmtMsg(':cmsProjectInterview.form.!{l5hzdv81cemh8kpfcn}', '合格分数线')}
                  layout={'horizontal'}
                  required={true}
                >
                  <Form.Item name={'fdQualifiedMark'}>
                    <XformNumber
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectInterview.form.!{l5hzdv832ve43rgmhqh}', '请输入')}
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
                  title={fmtMsg(':cmsProjectInterview.fdCreator', '创建者')}
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
                  title={fmtMsg(':cmsProjectInterview.fdCreateTime', '创建时间')}
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
              <GridItem
                column={2}
                row={6}
                style={{
                  display: 'none'
                }}
                rowSpan={1}
                columnSpan={1}
              ></GridItem>
              <GridItem column={1} row={4} columnSpan={2} rowSpan={1}>
                <XformFieldset>
                  <Form.Item
                    name={'cmsProjectInterDetail'}
                    validateTrigger={false}
                    noStyle
                    rules={[
                      {
                        validator: (rule, value, callback) => {
                          detailForms.current.cmsProjectInterDetail.current
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
                      $$ref={detailForms.current.cmsProjectInterDetail}
                      $$tableType="detail"
                      $$tableName="cmsProjectInterDetail"
                      title={fmtMsg(':cmsProjectInterview.form.!{l5hzifw3j5ed7kldmk9}', '明细表1')}
                      defaultRowNumber={1}
                      mobileRender={['simple']}
                      pcSetting={['pagination']}
                      showNumber={true}
                      layout={'vertical'}
                      hiddenLabel={true}
                      columns={[
                        {
                          type: CMSXformModal,
                          controlProps: {
                            apiKey: apiStaffInfo,
                            apiName: 'listStaffInfo',
                            // defaultTableCriteria: defaultTableCriteria,
                            chooseFdName: 'fdName',
                            // columnsProps: outStaffInfoColumns,
                            criteriaKey: 'staffReviewUpgrade',
                            criteriaProps: ['fdStaffName.fdName', 'fdName'],
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
                            name: 'fdInterviewName',
                            renderMode: 'singlelist',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
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
                            // onChangeProps: async (v, r) => {
                            //   sysProps.$$form.current.updateFormItemProps('cmsProjectInterDetail', {
                            //     rowValue: {
                            //       rowNum: r,
                            //       value: {
                            //         fdSupplier: v.fdSupplier,
                            //         fdEmail: v.fdEmail,
                            //         fdInterviewScores: '',
                            //         fdInterviewPass: '',
                            //         fdInterviewName: v
                            //       }
                            //     }
                            //   })
                            // },
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectInterview.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
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
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称'),
                            placeholder: fmtMsg(':cmsProjectInterview.form.!{l5i2r5c9cv95w3a6gai}', '请输入'),
                            name: 'fdSupplier',
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: supplierData,
                            desktop: {
                              type: XformSelect
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
                            type: XformSelect,
                            showStatus: EShowStatus.view
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectInterview.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2r5c8ax8fakvlo08}', '邮箱'),
                            maxLength: 100,
                            name: 'fdEmail',
                            placeholder: fmtMsg(':cmsProjectInterview.form.!{l5i2r5c9cv95w3a6gai}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: EShowStatus.view
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2r5c8ax8fakvlo08}', '邮箱'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectInterview.form.!{l5i2r5c8ax8fakvlo08}', '邮箱')
                        },
                        {
                          type: XformNumber,
                          controlProps: {
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2r9d4aemiawkvbr}', '面试得分'),
                            name: 'fdInterviewScores',
                            placeholder: fmtMsg(':cmsProjectInterview.form.!{l5i2r9d5i4h8wdz6su}', '请输入'),
                            numberFormat: {
                              formatType: 'base'
                            },
                            desktop: {
                              type: XformNumber
                            },
                            type: XformNumber,
                            showStatus: 'view',
                            // controlActions: {
                            //   'onBlur': [{
                            //     function: (v, r) => {
                            //       const fdQualifiedMark = form.getFieldValue('fdQualifiedMark')
                            //       if (!fdQualifiedMark) {
                            //         Message.error('请输入合格分数线', 1)
                            //         return
                            //       }
                            //       const fdInterviewPass = v >= fdQualifiedMark ? '1' : '0'
                            //       sysProps.$$form.current.updateFormItemProps('cmsProjectInterDetail', {
                            //         rowValue: {
                            //           rowNum: r,
                            //           value: {
                            //             fdInterviewPass: fdInterviewPass,
                            //           }
                            //         }
                            //       })
                            //       checkDetailWS(fdQualifiedMark)
                            //     }
                            //   }]
                            // }
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2r9d4aemiawkvbr}', '面试得分'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectInterview.form.!{l5i2r9d4aemiawkvbr}', '面试得分'),
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
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2sy26tahw90jp8ej}', '是否通过面试'),
                            maxLength: 50,
                            name: 'fdInterviewPass',
                            placeholder: fmtMsg(':cmsProjectInterview.form.!{l5i2sy277m7ezhzujdi}', '请输入'),
                            options: [
                              {
                                label: fmtMsg(':cmsProjectInterview.form.!{l5i2sy28xusq600dt4r}', '通过'),
                                value: '1'
                              },
                              {
                                label: fmtMsg(':cmsProjectInterview.form.!{l5i2sy2bt4d2xu68k4d}', '不通过'),
                                value: '0'
                              }
                            ],
                            optionSource: 'custom',
                            desktop: {
                              type: XformSelect
                            },
                            type: XformSelect,
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectInterview.form.!{l5i2sy26tahw90jp8ej}', '是否通过面试'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectInterview.form.!{l5i2sy26tahw90jp8ej}', '是否通过面试')
                        }
                      ]}
                      canExport={true}
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
                row={5}
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
