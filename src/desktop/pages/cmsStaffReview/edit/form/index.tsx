import React, { useRef, createRef, useEffect, useState } from 'react'
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
import XformNumber from '@/desktop/components/form/XformNumber'
import XformSelect from '@/desktop/components/form/XformSelect'
import CMSXformModal, { EShowStatus } from '@/desktop/components/cms/XformModal'
import apiSupplierInfo from '@/api/cmsSupplierInfo'
import { supplierColumns } from '@/desktop/pages/common/common'
import { getData } from '@/desktop/shared/util'
import { removalData } from '@/utils/util'
const MECHANISMNAMES = {}
const baseCls = 'project-review-form'
const XForm = (props) => {
  const detailForms = useRef({
    cmsStaffReviewDetail: createRef() as any
  })
  const { formRef: formRef, value: value } = props
  const [form] = Form.useForm()
  const [supplierInfoArr, setSupplierInfoArr] = useState<any>([])
  const [supplierInfoList, setsupplierInfoList] = useState<any>([])
  const [outStaffInfoArr, setOutStaffInfoArr] = useState<any>([])
  const [levelList, setLevelList] = useState<any>([])

  const getSupplierArr = (data) => {
    const newData = value.cmsStaffReviewDetail.filter(i => {
      if (i.fdInterviewPass === '1') {
        if (i.fdWrittenPass === '1' || i.fdWrittenPass === '2') {
          return i
        }
      }
    })
    const newArr = newData.map(i => {
      const item = data.find(value => value.fdId === i.fdSupplier.fdId)
      return item?.fdId
    })
    setSupplierInfoArr(newArr)
  }
  const getStaffList = () => {
    let newData = value.cmsStaffReviewDetail.map(i => {
      const item = {
        value: i.fdOutName.fdId,
        label: i.fdOutName.fdName
      }
      return item
    })
    newData = removalData(newData)
    setOutStaffInfoArr(newData)
  }
  useEffect(() => {
    getStaffList()
  }, [value.cmsStaffReviewDetail])
  useEffect(() => {
    getData('fdSupplier', setsupplierInfoList, value.cmsStaffReviewDetail)
    getData('fdConfirmLevel', setLevelList, value.cmsStaffReviewDetail)
  }, [])
  useEffect(() => {
    getSupplierArr(supplierInfoList)
  }, [supplierInfoList])
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
                      },
                      {
                        required: true,
                        message: fmtMsg(':required', '内容不能为空')
                      }
                    ]}
                  >
                    <XformInput
                      {...sysProps}
                      placeholder={fmtMsg(':cmsStaffReview.form.!{l5lt2wilcwzjvqs2jgf}', '请输入')}
                      showStatus="edit"
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
                      showStatus="readOnly"
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
                      showStatus="readOnly"
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
                      showStatus="readOnly"
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
                      showStatus="readOnly"
                    ></XformAddress>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={5} columnSpan={2} rowSpan={1}>
                <XformFieldset>
                  <Form.Item
                    name={'cmsStaffReviewDetail'}
                    validateTrigger={false}
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
                            placeholder: fmtMsg(':cmsStaffReview.form.!{l5j0nahkr64j4nuj3ea}', '请输入'),
                            name: 'fdSupplier',
                            label: 'fdName',
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
                            showStatus: 'readOnly'
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
                            showStatus: 'readOnly'
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
                            placeholder: fmtMsg(':cmsStaffReview.form.!{l5j0nahkr64j4nuj3ea}', '请输入'),
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
                            showStatus: 'readOnly'
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
                            showStatus: 'readOnly'
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
                            showStatus: 'readOnly'
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
                            showStatus: 'readOnly'
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
                            showStatus: 'readOnly'
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
                            options: levelList,
                            desktop: {
                              type: XformSelect
                            },
                            type: XformSelect,
                            showStatus: 'readOnly'
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
                      canAddRow={false}
                      canDeleteRow={false}
                      canImport={false}
                      canExport={false}
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
                      columnsProps={supplierColumns}
                      chooseFdName='fdName'
                      multiple={true}
                      showFooter={true}
                      isSupplier={true}
                      apiKey={apiSupplierInfo}
                      apiName={'listSupplierInfo'}
                      showStatus={EShowStatus.edit}
                      criteriaKey='supplierCriertia'
                      onChange={(v) => form.setFieldsValue({
                        fdSupplies: v
                      })}
                      defaultTableCriteria={{
                        'fdId': {
                          'searchKey': '$in',
                          'searchValue': supplierInfoArr || []
                        }
                      }}
                      modalTitle='中选供应商选择'
                    ></CMSXformModal>
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
                  <Form.Item name={'fdProjectDemand'} hidden={true}>
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
