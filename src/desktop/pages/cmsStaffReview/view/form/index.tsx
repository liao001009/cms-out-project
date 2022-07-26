import React, { useRef, createRef, useState, useEffect } from 'react'
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
import XformDatetime from '@/desktop/components/form/XformDatetime'
import XformAddress from '@/desktop/components/form/XformAddress'
import XformDetailTable from '@/desktop/components/form/XformDetailTable'
import XformRelation from '@/desktop/components/form/XformRelation'
import XformNumber from '@/desktop/components/form/XformNumber'
import XformSelect from '@/desktop/components/form/XformSelect'
import apiSupplierInfo from '@/api/cmsSupplierInfo'
import apiOutStaffInfo from '@/api/cmsOutStaffInfo'
import CMSXformModal, { EShowStatus } from '@/desktop/components/cms/XformModal'

const MECHANISMNAMES = {}
const baseCls = 'project-review-form'
const XForm = (props) => {
  const detailForms = useRef({
    cmsStaffReviewDetail: createRef() as any
  })
  const { formRef: formRef, value: value, materialVis } = props
  const [form] = Form.useForm()
  const [supplierInfoList, setsupplierInfoList] = useState<any>([])
  const [outStaffInfoArr, setOutStaffInfoArr] = useState<any>([])
  const getList = async (api, func) => {
    try {
      const res = await api
      const newData = res.data.content.map(i => {
        const item = {
          value: i.fdId,
          label: i.fdName
        }
        return item
      })
      func(newData)
    } catch (error) {
      console.log('error', error)
    }
  }
  useEffect(() => {
    getList(apiOutStaffInfo.listStaffInfo({}), setOutStaffInfoArr)
    getList(apiSupplierInfo.listSupplierInfo({}), setsupplierInfoList)
  }, [])
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
    <div className={`${baseCls}`}>
      <div className="lui-xform">
        <Form form={form} colPadding={false} onValuesChange={onValuesChange}>
          <XformAppearance>
            <LayoutGrid columns={2} rows={7}>
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
                  <Form.Item name={'fdColNiac8a'}>
                    <XformDescription
                      {...sysProps}
                      defaultTextValue={fmtMsg(':cmsStaffReview.form.!{l5j0eriwqaq645oi9c}', '外包人员评审')}
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
              ></GridItem>
              <GridItem column={1} row={2} rowSpan={1} columnSpan={2}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsStaffReview.form.!{l5lt2wijkpj6veh7erc}', '主题')}
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
                      placeholder={fmtMsg(':cmsStaffReview.form.!{l5lt2wilcwzjvqs2jgf}', '请输入')}
                      showStatus="view"
                    ></XformInput>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem
                column={2}
                row={2}
                rowSpan={1}
                style={{
                  display: 'none'
                }}
              ></GridItem>
              <GridItem column={1} row={3}>
                <XformFieldset
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsStaffReview.form.!{l5j0g416fp0yxl0edsu}', '实际笔试时间')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdRealWritTime'}>
                    <XformDatetime
                      {...sysProps}
                      placeholder={fmtMsg(':cmsStaffReview.form.!{l5j0g418no3yijxeenl}', '请输入')}
                      dataPattern={'yyyy-MM-dd HH:mm'}
                      showStatus="view"
                    ></XformDatetime>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={2} row={3}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsStaffReview.form.!{l5j0ghnmvqsssi3uhma}', '实际面试时间')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdRealViewTime'}>
                    <XformDatetime
                      {...sysProps}
                      placeholder={fmtMsg(':cmsStaffReview.form.!{l5j0ghnnw46tflgcf4}', '请输入')}
                      dataPattern={'yyyy-MM-dd HH:mm'}
                      showStatus="view"
                    ></XformDatetime>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={4}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsStaffReview.form.!{l5j0h4l0nmxpcwpcr8g}', '面试官')}
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
                      showStatus="view"
                    ></XformAddress>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={2} row={4}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsStaffReview.form.!{l5j0hb5rh5lpzp1vrxr}', '项目负责人')}
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
              <GridItem column={1} row={5} columnSpan={2} rowSpan={1}>
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
                    <XformDetailTable
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
                          type: XformSelect,
                          controlProps: {
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0l4chmvb5xkzogfj}', '供应商'),
                            name: 'fdSupplier',
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: supplierInfoList,
                            desktop: {
                              type: XformSelect
                            },
                            type: XformSelect,
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0l4chmvb5xkzogfj}', '供应商'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0l4chmvb5xkzogfj}', '供应商')
                        },
                        {
                          type: XformNumber,
                          controlProps: {
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0lyj3k6s4h7uw24f}', '供应商排名'),
                            name: 'fdSupplierOrder',
                            placeholder: fmtMsg(':cmsStaffReview.form.!{l5j0lyj5ja7itscqnm}', '请输入'),
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
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0lyj3k6s4h7uw24f}', '供应商排名'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0lyj3k6s4h7uw24f}', '供应商排名')
                        },
                        {
                          type: XformSelect,
                          controlProps: {
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0m5k1v80p3j6skmo}', '姓名'),
                            name: 'fdOutName',
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: outStaffInfoArr,
                            desktop: {
                              type: XformSelect
                            },
                            type: XformSelect,
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0m5k1v80p3j6skmo}', '姓名'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0m5k1v80p3j6skmo}', '姓名')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0msdrihr3awr8jvj}', '自评级别'),
                            maxLength: 100,
                            name: 'fdSkillLevel',
                            placeholder: fmtMsg(':cmsStaffReview.form.!{l5j0msdthqxvlo7k5zu}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0msdrihr3awr8jvj}', '自评级别'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0msdrihr3awr8jvj}', '自评级别')
                        },
                        {
                          type: XformSelect,
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
                                label: fmtMsg(':cmsStaffReview.form.!{l5j0nahn1y66v7farvp}', '未参加笔试'),
                                value: '2'
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
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0nahjfal1c3vmzfc}', '笔试是否通过'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0nahjfal1c3vmzfc}', '笔试是否通过')
                        },
                        {
                          type: XformSelect,
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
                                label: fmtMsg(':cmsStaffReview.form.!{l5j0ng08dbu57pugteq}', '未参面试'),
                                value: '2'
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
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0ng04v9x21cf9o9j}', '面试是否通过'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0ng04v9x21cf9o9j}', '面试是否通过')
                        },
                        {
                          type: XformSelect,
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
                            desktop: {
                              type: XformSelect
                            },
                            showStatus: 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsStaffReview.form.!{l5m8ahrw75gp6s7y6qi}', '评审结论'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsStaffReview.form.!{l5m8ahrw75gp6s7y6qi}', '评审结论')
                        },
                        {
                          type: XformSelect,
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
                            desktop: {
                              type: XformSelect
                            },
                            type: XformSelect,
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            showStatus: materialVis ? 'edit' : 'view'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsStaffReview.form.!{l5j0obajl93mj68ky2f}', '定级'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsStaffReview.form.!{l5j0obajl93mj68ky2f}', '定级')
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
                row={5}
                style={{
                  display: 'none'
                }}
              ></GridItem>
              <GridItem column={1} row={6} columnSpan={2} rowSpan={1}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsStaffReview.form.!{l5kvp3zj3qq76tpcbpy}', '中选供应商')}
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
              <GridItem
                column={2}
                row={6}
                style={{
                  display: 'none'
                }}
              ></GridItem>
              {/* <GridItem column={1} row={7} columnSpan={2} rowSpan={1}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsStaffReview.form.!{l5kvs0rsymu0ee2wucj}', '项目需求')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdProjectDemand'}>
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
                        appCode: '1g77dbphcw10w198swtqlij1fbb1uj3tkuw0',
                        xformName: '项目需求',
                        modelId: '1g7oh4ag9w11wci9gw3c6rh9h3ebmc2619w0',
                        tableType: 'main',
                        tableName: 'mk_model_202207128b999',
                        showFields: '$项目名称$',
                        refFieldName: '$fd_project$'
                      }}
                      showStatus="view"
                    ></XformRelation>
                  </Form.Item>
                </XformFieldset>
              </GridItem> */}
              <GridItem
                column={2}
                row={7}
                style={{
                  display: 'none'
                }}
              ></GridItem>
            </LayoutGrid>
          </XformAppearance>
        </Form>
      </div>
    </div>
  )
}

export default XForm
