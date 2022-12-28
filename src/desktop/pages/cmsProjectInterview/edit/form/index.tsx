import React, { useRef, createRef, useEffect, useState } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Button, Form, Message, ButtonGroup } from '@lui/core'
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
import { EShowStatus } from '@/types/showStatus'
import apiOrderResponse from '@/api/cmsOrderResponse'
import apiStaffInfo from '@/api/cmsOutStaffInfo'
import { outStaffInfoColumns } from '@/desktop/pages/common/common'
import CMSXformModal from '@/desktop/components/cms/XformModal'
import XformExecl from '@/desktop/components/cms/XformExecl'
import Icon from '@lui/icons'
import apiSelect from '@/api/cmsSelectConfirm'
import { removalData } from '@/utils/util'

const MECHANISMNAMES = {}


const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectInterDetail: createRef() as any
  })
  const { formRef: formRef, value: value } = props
  const [form] = Form.useForm()
  const [supplierData, setSupplierData] = useState<any>([])
  const [defaultTableCriteria, setDefaultTableCriteria] = useState<any>({})
  const [staffInfo, setStaffInfo] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [errMsgArr, setErrMsgArr] = useState<any>([])
  // 通过js手动将模板和导入按钮放到明细表上面
  const getTag = () => {
    let parentNode, addRow
    const timer = setInterval(() => {
      parentNode = document.querySelector('div[class="ele-xform-detail-table-toolbar-right-buttons"]')
      const uploadDown = document.getElementById('uploadDown') || document.createElement('div')
      addRow = document.querySelector('button[title="添加行"]')
      if (parentNode && parentNode.nodeType && addRow && addRow.nodeType) {
        parentNode?.insertBefore(uploadDown, addRow)
        uploadDown.style.display = 'block'
        clearInterval(timer)
      }
    }, 1000)
  }
  useEffect(() => {
    // init()
    let paramId = props?.match?.params?.id
    // isSupplement 1表示增补人员 0 表示订单响应人员
    let isSupplement = ''
    if (props.mode === 'add') {
      form.setFieldsValue({
        fdProjectDemand: paramId
      })
      isSupplement = props?.match?.params?.isSupplement
    } else {
      paramId = value?.fdProjectDemand?.fdId
    }
    if (paramId) {
      initData(paramId, isSupplement)
    }
    getTag()
  }, [])


  const initData = async (params, isSupplement = '') => {
    try {
      let initParam = {}
      const api = isSupplement === '1' ? apiSelect.listSuppleDetail : apiOrderResponse.listStaff
      if (isSupplement === '1') {
        initParam = { fdId: params }
      } else {
        initParam = { conditions: { 'fdProjectDemand.fdId': { '$eq': params } } }
      }
      const resStaff = await api(initParam)
      const ids = resStaff?.data?.content?.map(i => { return i.fdId })
      if (ids && ids.length > 0) {
        const newParam = {
          fdId: {
            searchKey: '$in',
            searchValue: ids
          }
        }
        setDefaultTableCriteria(newParam)
      } else {
        setDefaultTableCriteria([''])
      }
      let newSupplierData: any = []
      if (isSupplement === '1') {
        newSupplierData = resStaff?.data?.content.map(i => {
          const item = {
            label: i?.fdSupplierName,
            value: i?.fdSupplierId
          }
          return item
        })
      } else {
        newSupplierData = resStaff?.data?.content?.map(item => {
          const sup = {
            label: item?.fdSupplier.fdName,
            value: item?.fdSupplier.fdId
          }
          return sup
        })
      }
      newSupplierData = removalData(newSupplierData)
      setSupplierData(newSupplierData)
      setStaffInfo(resStaff?.data?.content)
    } catch (error) {
      Message.error(error.response?.data?.msg || '请求失败')
    }
  }

  const checkDetailWS = (val) => {
    const cmsProjectInterDetail = form.getFieldValue('cmsProjectInterDetail')
    const arr: any = []
    cmsProjectInterDetail?.values?.forEach((v, r) => {
      if (!v.fdInterviewScores) return
      const fdInterviewPass = val <= v.fdInterviewScores ? '1' : '0'
      sysProps.$$form.current.updateFormItemProps('cmsProjectInterDetail', {
        rowValue: {
          rowNum: r,
          value: {
            fdInterviewPass: fdInterviewPass,
          }
        }
      })
      const checkArr = arr.findIndex(item => item.fdId === v.fdSupplier.fdId)
      if (checkArr === -1 && fdInterviewPass === '1') {
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


  const uploadExecl = () => {
    const fdQualifiedMark = form.getFieldValue('fdQualifiedMark')
    if (!fdQualifiedMark) {
      Message.error('请输入合格分数线', 1)
      return
    }
    setVisible(true)
  }
  const handleCancel = () => {
    setVisible(false)
  }

  const downloadExecl = () => {
    window.open(mk.getResourcePath('@module:cms-out-project/desktop/static/attach/interview.xlsx'), '_blank')
  }

  const handlerChange = (data) => {
    const array = Object.values(data)
    setDetailTable(array)
    checkDetailWS('')
  }

  const getField = (str: string) => {
    return str.substring(str.lastIndexOf('/') + 1)
  }

  const checkPersonInfo = (keyVal) => {
    if (!staffInfo) {
      return
    }
    return staffInfo.find(item => item.fdName === keyVal)
  }

  const setDetailTable = (data) => {
    const valuesData = sysProps.$$form.current.getFieldsValue('cmsProjectInterDetail').values
    valuesData.length && detailForms.current.cmsProjectInterDetail.current.deleteAll()
    const fdQualifiedMark = form.getFieldValue('fdQualifiedMark')
    if (data.length > 0) {
      const errMsg: any = []
      const newValue: any = []
      data[0]?.forEach((i, index) => {
        let item: any = {}
        Object.keys(i).forEach(key => {
          const field = getField(key)
          item = {
            ...item,
            [field]: i[key],
          }
        })
        if (!item['fdInterviewName']) {
          errMsg.push(`第${index + 1}条的‘姓名’没有填写`)
        }
        const personInfo = checkPersonInfo(item['fdInterviewName'])
        if (personInfo) {
          item['fdInterviewName'] = personInfo
          const fdInterviewPass = Number(item['fdInterviewScores']) <= Number(fdQualifiedMark) ? '0' : '1'
          item = { ...item, ...personInfo, fdInterviewPass }
          newValue.push(item)
        } else {
          errMsg.push(`第${index + 1}条的人员的姓名不在外包人员列表中`)
        }
      })
      if (errMsg.length) {
        setErrMsgArr(errMsg)
      } else {
        detailForms.current.cmsProjectInterDetail.current.updateValues(newValue)
        setErrMsgArr([])
        handleCancel()
      }
    }
  }




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
                    dataPattern={'yyyy-MM-dd HH/mm'}
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
                    onChange={(v) => checkDetailWS(v)}
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
            <GridItem
              column={2}
              row={6}
              style={{
                display: 'none'
              }}
              rowSpan={1}
              columnSpan={1}
            ></GridItem>
            <div id='uploadDown' style={{ display: 'none' }}>
              <ButtonGroup amount={2} className='lui-test-btn-group' shape='link'>
                <Button onClick={() => { uploadExecl() }} type='default' label='上传' icon={<Icon type='vector' name='upload' />} />
                <Button onClick={() => { downloadExecl() }} type='default' label='下载模板' icon={<Icon type='vector' name='download' />} >
                </Button>
              </ButtonGroup>
              <XformExecl onChange={(info) => { handlerChange(info) }} handleCancel={() => { handleCancel() }} visible={visible} errMsgArr={errMsgArr} />
            </div>
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
                        key: defaultTableCriteria,
                        controlProps: {
                          apiKey: apiStaffInfo,
                          apiName: 'list',
                          defaultTableCriteria: defaultTableCriteria,
                          modalTitle: '选择人员',
                          chooseFdName: 'fdName',
                          columnsProps: outStaffInfoColumns,
                          criteriaKey: 'staffReviewUpgrade',
                          criteriaProps: ['fdStaffName.fdName', 'fdName'],
                          title: fmtMsg(':cmsProjectInterview.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
                          name: 'fdInterviewName',
                          desktop: {
                            type: CMSXformModal
                          },
                          type: CMSXformModal,
                          onChangeProps: async (v, r) => {
                            sysProps.$$form.current.updateFormItemProps('cmsProjectInterDetail', {
                              rowValue: {
                                rowNum: r,
                                value: {
                                  fdSupplier: v.fdSupplier,
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
                          range: {
                            start: 0
                          },
                          desktop: {
                            type: XformNumber
                          },
                          type: XformNumber,
                          showStatus: 'edit',
                          controlActions: {
                            'onBlur': [{
                              function: (v, r) => {
                                const fdQualifiedMark = form.getFieldValue('fdQualifiedMark')
                                if (!fdQualifiedMark) {
                                  Message.error('请输入合格分数线', 1)
                                  return
                                }
                                const fdInterviewPass = v >= fdQualifiedMark ? '1' : '0'
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
                    canImport={false}
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
