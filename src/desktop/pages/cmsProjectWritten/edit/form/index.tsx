import apiOrderResponse from '@/api/cmsOrderResponse'
import apiStaffInfo from '@/api/cmsOutStaffInfo'
import apiSupplier from '@/api/cmsSupplierInfo'
import CMSXformModal from '@/desktop/components/cms/XformModal'
import GridItem from '@/desktop/components/form/GridItem'
import LayoutGrid from '@/desktop/components/form/LayoutGrid'
import XformAddress from '@/desktop/components/form/XformAddress'
import XformAppearance from '@/desktop/components/form/XformAppearance'
import XformCheckbox from '@/desktop/components/form/XformCheckbox'
import XformDatetime from '@/desktop/components/form/XformDatetime'
import XformDetailTable from '@/desktop/components/form/XformDetailTable'
import XformFieldset from '@/desktop/components/form/XformFieldset'
import XformInput from '@/desktop/components/form/XformInput'
import XformNumber from '@/desktop/components/form/XformNumber'
import XformSelect from '@/desktop/components/form/XformSelect'
import { outStaffInfoColumns } from '@/desktop/pages/common/common'
import { useApi, useSystem } from '@/desktop/shared/formHooks'
import { EShowStatus } from '@/types/showStatus'
import { fmtMsg } from '@ekp-infra/respect'
import { Form, Message } from '@lui/core'
import React, { createRef, useEffect, useRef, useState } from 'react'
import './index.scss'

const MECHANISMNAMES = {}


const XForm = (props) => {
  
  const detailForms = useRef({
    cmsProjectWrittenDe: createRef() as any
  })
  const { formRef: formRef, value: value } = props
  const [form] = Form.useForm()
  const [nSVisible, setNSVisible] = useState<string>('1')
  const [ivVisible, setIvVisible] = useState<string>('1')
  const [supplierData, setSupplierData] = useState<any>([])
  const [defaultTableCriteria, setDefaultTableCriteria] = useState<any>({})
  useEffect(() => {
    init()
    const paramId = props?.match?.params?.id
    if(props.mode==='add'){
      form.setFieldsValue({
        fdProjectDemand: paramId,
      })
    }
    if(paramId){
      initData(paramId)
    }
    form.setFieldsValue({
      fdNoticeSupplier: ['1'], 
      fdIsInterview: ['1'], 
      fdNoticeInterviewer: ['1']
    })
  }, [])
  
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

  const initData = async (params) => {
    try {
      const initParam = { conditions: { 'fdProjectDemand.fdId': { '$eq': params } } }
      const resOrder = await apiOrderResponse.listStaff(initParam)
      const ids = resOrder?.data?.content?.map(i=>{
        return i.fdId
      })
      const newParam = {
        fdId: {
          searchKey: '$in',
          searchValue : ids
        }
      }
      setDefaultTableCriteria(newParam)
    } catch (error) {
      console.error(error)
    }
  }

  const checkDetailWS =  (val)=>{
    const cmsProjectWrittenDe = form.getFieldValue('cmsProjectWrittenDe')
    const arr: any  = []
    cmsProjectWrittenDe?.values?.forEach((v, r) => {
      if(!v.fdWrittenScores) return
      const fdWrittenPass = val <= v.fdWrittenScores ? '1' : '0'
      sysProps.$$form.current.updateFormItemProps('cmsProjectWrittenDe', {
        rowValue: {
          rowNum: r,
          value: {
            fdWrittenPass: fdWrittenPass,
          }
        }
      })
      if(!arr.includes(v.fdSupplier) && fdWrittenPass==='1'){
        arr.push(v.fdSupplier)
      }
    })
    form.setFieldsValue({
      fdSupplierTotal: arr
    })
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
    <div className="lui-xform">
      <Form form={form} colPadding={false} onValuesChange={onValuesChange}>
        <XformAppearance>
          <LayoutGrid columns={2} rows={9}>
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
                <Form.Item name={'fdWrittenTime'}
                  rules={[
                    {
                      required: true,
                      message: fmtMsg(':required', '内容不能为空')
                    }
                  ]}
                >
                  <XformDatetime
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectWritten.form.!{l5hz9wxdne6ahfqosua}', '请输入')}
                    dataPattern={'yyyy-MM-dd HH:mm'}
                    showStatus="edit"
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
                <Form.Item name={'fdQualifiedMark'}
                  rules={[
                    {
                      required: true,
                      message: fmtMsg(':required', '内容不能为空')
                    }
                  ]}
                >
                  <XformNumber
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectWritten.form.!{l5hzdv832ve43rgmhqh}', '请输入')}
                    numberFormat={{
                      formatType: 'base'
                    }}
                    showStatus="edit"
                    onChange = {(v)=> checkDetailWS(v) }
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
                  initialValue={{
                    fdId: mk.getSysConfig().currentUser.fdId,
                    fdName: mk.getSysConfig().currentUser.fdName,
                  }}
                >
                  <XformAddress
                    {...sysProps}
                    org={{
                      orgTypeArr: ['8'],
                      defaultValueType: 'fixed'
                    }}
                    range={'all'}
                    preSelectType={'fixed'}
                    showStatus={EShowStatus.readOnly}
                    defaultValue={
                      {
                        fdId: mk.getSysConfig().currentUser.fdId,
                        fdName: mk.getSysConfig().currentUser.fdName,
                      }
                    }
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
                <Form.Item name={'fdCreateTime'}
                  initialValue={new Date().getTime()}
                >
                  <XformDatetime
                    {...sysProps}
                    placeholder={'请输入'}
                    dataPattern={'yyyy-MM-dd'}
                    showStatus={EShowStatus.readOnly}
                    defaultValueType='now'
                    defaultValue={new Date().getTime()}
                  ></XformDatetime>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            <GridItem column={1} row={4} columnSpan={2} rowSpan={1}>
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

                  {
                    ivVisible === '1' ? (
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
                        columns={[
                          {
                            type: CMSXformModal,
                            controlProps: {
                              apiKey: apiStaffInfo,
                              apiName: 'listStaffInfo',
                              defaultTableCriteria: defaultTableCriteria,
                              chooseFdName: 'fdName',
                              columnsProps: outStaffInfoColumns,
                              criteriaKey: 'staffReviewUpgrade',
                              criteriaProps: ['fdStaffName.fdName', 'fdName'],
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
                              onChangeProps: async (v, r) => {
                                sysProps.$$form.current.updateFormItemProps('cmsProjectWrittenDe', {
                                  rowValue: {
                                    rowNum: r,
                                    value: {
                                      fdSupplier: v.fdSupplier,
                                      fdMajor: v.fdMajor,
                                      fdEmail: v.fdEmail,
                                      fdWrittenPass: '',
                                      fdWrittenScores: '',
                                      fdInterviewName: v
                                    }
                                  }
                                })
                              },
                              isForwardView: 'no',
                              showStatus: 'edit'
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
                            type: XformSelect,
                            controlProps: {
                              title: fmtMsg(':cmsProjectWritten.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称'),
                              name: 'fdSupplier',
                              placeholder: fmtMsg(':cmsProjectWritten.form.!{l5i2sy277m7ezhzujdi}', '请输入'),
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
                              showStatus: EShowStatus.readOnly
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
                              showStatus: EShowStatus.readOnly
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
                              showStatus: EShowStatus.readOnly
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
                              showStatus: 'edit',
                              controlActions: {
                                'onChange': [{
                                  function: (v, r) => {
                                    const fdQualifiedMark = form.getFieldValue('fdQualifiedMark')
                                    if (!fdQualifiedMark) {
                                      Message.error('请输入合格分数线', 1)
                                      return
                                    }
                                    const fdWrittenPass = v >= fdQualifiedMark ? '1' : '0'
                                    sysProps.$$form.current.updateFormItemProps('cmsProjectWrittenDe', {
                                      rowValue: {
                                        rowNum: r,
                                        value: {
                                          fdWrittenPass: fdWrittenPass,
                                        }
                                      }
                                    })
                                    checkDetailWS(fdQualifiedMark)
                                  }
                                }]
                              }
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
                              showStatus: 'edit'
                            },
                            labelProps: {
                              title: fmtMsg(':cmsProjectWritten.form.!{l5i2sy26tahw90jp8ej}', '是否通过笔试'),
                              desktop: {
                                layout: 'vertical'
                              }
                            },
                            label: fmtMsg(':cmsProjectWritten.form.!{l5i2sy26tahw90jp8ej}', '是否通过笔试')
                          },

                          {
                            type: XformDatetime,
                            controlProps: {
                              title: fmtMsg(':cmsProjectWritten.form.!{l5iziae2bzq0rckmq6}', '计划面试开始时间'),
                              name: 'fdBeginTime',
                              placeholder: fmtMsg(':cmsProjectWritten.form.!{l5iziae44d2by5dyv7w}', '请输入'),
                              dataPattern: 'yyyy-MM-dd HH:mm',
                              desktop: {
                                type: XformDatetime
                              },
                              showStatus: 'edit'
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
                              dataPattern: 'yyyy-MM-dd HH:mm',
                              desktop: {
                                type: XformDatetime
                              },
                              showStatus: 'edit'
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
                              showStatus: 'edit'
                            },
                            labelProps: {
                              title: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号'),
                              desktop: {
                                layout: 'vertical'
                              }
                            },
                            label: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号')
                          }
                        ]}
                        canAddRow={true}
                        canDeleteRow={true}
                        canImport={true}
                        showStatus="edit"
                      ></XformDetailTable>
                    ): (
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
                        columns={[
                          {
                            type: CMSXformModal,
                            controlProps: {
                              apiKey: apiStaffInfo,
                              apiName: 'listStaffInfo',
                              defaultTableCriteria: defaultTableCriteria,
                              chooseFdName: 'fdName',
                              columnsProps: outStaffInfoColumns,
                              criteriaKey: 'staffReviewUpgrade',
                              criteriaProps: ['fdStaffName.fdName', 'fdName'],
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
                              onChangeProps: async (v, r) => {
                                sysProps.$$form.current.updateFormItemProps('cmsProjectWrittenDe', {
                                  rowValue: {
                                    rowNum: r,
                                    value: {
                                      fdSupplier: v.fdSupplier,
                                      fdMajor: v.fdMajor,
                                      fdEmail: v.fdEmail,
                                      fdWrittenPass: '',
                                      fdWrittenScores: '',
                                      fdInterviewName: v
                                    }
                                  }
                                })
                              },
                              isForwardView: 'no',
                              showStatus: 'edit'
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
                            type: XformSelect,
                            controlProps: {
                              title: fmtMsg(':cmsProjectWritten.form.!{l5i2e44y9gjv4vhmjr5}', '供应商名称'),
                              name: 'fdSupplier',
                              placeholder: fmtMsg(':cmsProjectWritten.form.!{l5i2sy277m7ezhzujdi}', '请输入'),
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
                              showStatus: EShowStatus.readOnly
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
                              showStatus: EShowStatus.readOnly
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
                              showStatus: EShowStatus.readOnly
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
                              showStatus: 'edit',
                              controlActions: {
                                'onChange': [{
                                  function: (v, r) => {
                                    const fdQualifiedMark = form.getFieldValue('fdQualifiedMark')
                                    if (!fdQualifiedMark) {
                                      Message.error('请输入合格分数线', 1)
                                      return
                                    }
                                    const fdWrittenPass = v >= fdQualifiedMark ? '1' : '0'
                                    sysProps.$$form.current.updateFormItemProps('cmsProjectWrittenDe', {
                                      rowValue: {
                                        rowNum: r,
                                        value: {
                                          fdWrittenPass: fdWrittenPass,
                                        }
                                      }
                                    })
                                    checkDetailWS(fdQualifiedMark)
                                  }
                                }]
                              }
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
                              showStatus: 'edit'
                            },
                            labelProps: {
                              title: fmtMsg(':cmsProjectWritten.form.!{l5i2sy26tahw90jp8ej}', '是否通过笔试'),
                              desktop: {
                                layout: 'vertical'
                              }
                            },
                            label: fmtMsg(':cmsProjectWritten.form.!{l5i2sy26tahw90jp8ej}', '是否通过笔试')
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
                              showStatus: 'edit'
                            },
                            labelProps: {
                              title: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号'),
                              desktop: {
                                layout: 'vertical'
                              }
                            },
                            label: fmtMsg(':cmsProjectWritten.form.!{l5izigssxh9x6w7qrq}', '远程面试会议号')
                          }
                        ]}
                        canAddRow={true}
                        canDeleteRow={true}
                        canImport={true}
                        showStatus="edit"
                      ></XformDetailTable>
                    )
                  } 
                  



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
            <GridItem column={1} row={8} columnSpan={2} rowSpan={1}
              style={{
                display: 'none'
              }}
            >
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectWritten.form.!{l5iypuiahn8xqzb9qmc}', '项目需求')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdProjectDemand'}>
                  <XformInput
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectInterview.form.!{l5hz9wxdne6ahfqosua}', '请输入')}
                    showStatus={EShowStatus.edit}
                  ></XformInput>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            
            <GridItem column={1} row={5} rowSpan={1} columnSpan={1}>
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
                    showStatus="edit"
                    onChange={(v) => setIvVisible(v?.[0])}
                  ></XformCheckbox>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            {
              ivVisible === '1' ?
                (<React.Fragment>
                  <GridItem column={2} row={5} rowSpan={1} columnSpan={1}>
                    <XformFieldset
                      labelTextAlign={'left'}
                      mobileContentAlign={'right'}
                      title={fmtMsg(':cmsProjectWritten.form.!{l5hzlb769gv64l5j7ke}', '面试官')}
                      layout={'horizontal'}
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
                          showStatus="edit"
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
                    >
                      <Form.Item
                        name={'fdNoticeSupplier'}
                        rules={[
                          {
                            validator: lengthValidator(200)
                          }
                        ]}
                      // initialValue={{
                      //   label: fmtMsg(':cmsProjectWritten.form.!{l5hzkchwh5z2hpqmbm6}', '是'),
                      //   value: '1'
                      // }}
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
                          showStatus="edit"
                          onChange={(v) => setNSVisible(v?.[0])}
                        ></XformCheckbox>
                      </Form.Item>
                    </XformFieldset>
                  </GridItem>
                  {
                    nSVisible === '1' ?
                      (<React.Fragment>
                        <GridItem column={2} row={6} columnSpan={1} rowSpan={1}
                        >
                          <Form.Item name={'fdSupplierTotal'}>
                            <XformSelect
                              {...sysProps}
                              multi={true}
                              placeholder={fmtMsg(':cmsOutStaffInfo.form.!{l3mpxl7izzanc6s2rh}', '请输入')}
                              options={supplierData}
                              optionSource={'custom'}
                              showStatus={EShowStatus.readOnly}
                            ></XformSelect>
                          </Form.Item>
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
                      </React.Fragment>) : null
                  }
                  <GridItem column={1} row={7} columnSpan={2} rowSpan={1}>
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
                          showStatus="edit"
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
                </React.Fragment>) : null
            }
            
          </LayoutGrid>
        </XformAppearance>
      </Form>
    </div>
  )
}

export default XForm
