import React, { useRef, createRef, useEffect, useState } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Form, Message } from '@lui/core'
import { useApi, useSystem } from '@/desktop/shared/formHooks'
import XformAppearance from '@/desktop/components/form/XformAppearance'
import LayoutGrid from '@/desktop/components/form/LayoutGrid'
import GridItem from '@/desktop/components/form/GridItem'
import XformDescription from '@/desktop/components/form/XformDescription'
import XformFieldset from '@/desktop/components/form/XformFieldset'
import XformDatetime from '@/desktop/components/form/XformDatetime'
import XformNumber from '@/desktop/components/form/XformNumber'
import XformAddress from '@/desktop/components/form/XformAddress'
import XformSelect from '@/desktop/components/form/XformSelect'
import XformDetailTable from '@/desktop/components/form/XformDetailTable'
import XformInput from '@/desktop/components/form/XformInput'
import apiSupplier from '@/api/cmsSupplierInfo'
import { EShowStatus } from '@/types/showStatus'
import apiOrderResponse from '@/api/cmsOrderResponse'
import apiStaffInfo from '@/api/cmsOutStaffInfo'
import { outStaffInfoColumns } from '@/desktop/pages/common/common'
import CMSXformModal from '@/desktop/components/cms/XformModal'

const MECHANISMNAMES = {}


const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectInterDetail: createRef() as any
  })
  const { formRef: formRef, value: value } = props
  const [form] = Form.useForm()
  const [supplierData, setSupplierData] = useState<any>([])
  const [defaultTableCriteria, setDefaultTableCriteria] = useState<any>({})
  useEffect(() => {
    init()
    const paramId = props?.match?.params?.id
    if(props.mode==='add'){
      // value.fdProjectDemand=paramId
      form.setFieldsValue({
        fdProjectDemand: paramId
      })
    }
    if(paramId){
      initData(paramId)
    }
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
    const cmsProjectInterDetail = form.getFieldValue('cmsProjectInterDetail')
    const arr: any  = []
    cmsProjectInterDetail?.values?.forEach((v, r) => {
      if(!v.fdInterviewScores) return
      const fdInterviewPass = val <= v.fdInterviewScores ? '1' : '0'
      sysProps.$$form.current.updateFormItemProps('cmsProjectInterDetail', {
        rowValue: {
          rowNum: r,
          value: {
            fdInterviewPass: fdInterviewPass,
          }
        }
      })
      if(!arr.includes(v.fdSupplier) && fdInterviewPass==='1'){
        arr.push(v.fdSupplier)
      }
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
                    showStatus="edit"
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
                title={fmtMsg(':cmsProjectInterview.form.!{l5hzdv81cemh8kpfcn}', '合格分数线')}
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
                    placeholder={fmtMsg(':cmsProjectInterview.form.!{l5hzdv832ve43rgmhqh}', '请输入')}
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
                  initialValue={
                    {
                      fdId: mk.getSysConfig().currentUser.fdId,
                      fdName: mk.getSysConfig().currentUser.fdName,
                    }
                  }
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
                title={fmtMsg(':cmsProjectInterview.fdCreateTime', '创建时间')}
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
            {/* <GridItem column={1} row={6} columnSpan={2} rowSpan={1}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInterview.form.!{l5q3jmj77gupec4wbbd}', '文档状态')}
                layout={'horizontal'}
              >
                <Form.Item
                  name={'fdStatus'}
                  rules={[
                    {
                      validator: lengthValidator(50)
                    }
                  ]}
                >
                  <XformSelect
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectInterview.form.!{l5q3jmj9thzmdrhi7z}', '请输入')}
                    options={[
                      {
                        label: fmtMsg(':cmsProjectInterview.form.!{l5q3jmjaxjc18jsh4m}', '草稿'),
                        value: '10'
                      },
                      {
                        label: fmtMsg(':cmsProjectInterview.form.!{l5q3jmjd68mza9jsp8k}', '结束'),
                        value: '30'
                      }
                    ]}
                    optionSource={'custom'}
                    passValue={true}
                    showStatus="edit"
                  ></XformSelect>
                </Form.Item>
              </XformFieldset>
            </GridItem> */}
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
                          apiKey:apiStaffInfo,
                          apiName: 'listStaffInfo',
                          defaultTableCriteria: defaultTableCriteria,
                          chooseFdName:'fdName',
                          columnsProps:outStaffInfoColumns,
                          criteriaKey:'staffReviewUpgrade',
                          criteriaProps:['fdStaffName.fdName', 'fdName'],
                          title: fmtMsg(':cmsProjectInterview.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
                          name: 'fdInterviewName',
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
                          onChangeProps : async (v, r)=>{
                            sysProps.$$form.current.updateFormItemProps('cmsProjectInterDetail', {
                              rowValue: {
                                rowNum: r,
                                value: {
                                  fdSupplier:v.fdSupplier,
                                  fdEmail: v.fdEmail,
                                  fdInterviewScores: '',
                                  fdInterviewPass: '',
                                  fdInterviewName: v
                                }
                              }
                            })
                          },
                          showStatus: 'edit'
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
                          showStatus: EShowStatus.readOnly
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
                          showStatus: EShowStatus.readOnly
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
                          showStatus: 'edit',
                          controlActions: {
                            'onChange': [{
                              function: (v, r) => {
                                const fdQualifiedMark = form.getFieldValue('fdQualifiedMark')
                                if(!fdQualifiedMark){
                                  Message.error('请输入合格分数线', 1)
                                  return 
                                }
                                const fdInterviewPass = v>=fdQualifiedMark ? '1' : '0'
                                sysProps.$$form.current.updateFormItemProps('cmsProjectInterDetail', {
                                  rowValue: {
                                    rowNum: r,
                                    value: {
                                      fdInterviewPass: fdInterviewPass,
                                    }
                                  }
                                })
                                checkDetailWS(fdQualifiedMark)
                              }
                            }]
                          }
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
                          showStatus: 'edit'
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
                    canAddRow={true}
                    canDeleteRow={true}
                    canImport={true}
                    showStatus="edit"
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
            <GridItem column={1} row={5} columnSpan={2} rowSpan={1}
              style={{
                display: 'none'
              }}
            >
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInterview.form.!{l5iypuiahn8xqzb9qmc}', '项目需求')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdProjectDemand'}>
                  <XformInput
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectInterview.form.!{l5hz9wxdne6ahfqosua}', '请输入')}
                    showStatus={EShowStatus.edit}
                  ></XformInput>
                  

                  {/* <XformRelation
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
                    showStatus="edit"
                  ></XformRelation> */}
                </Form.Item>
              </XformFieldset>
            </GridItem>
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
  )
}

export default XForm
