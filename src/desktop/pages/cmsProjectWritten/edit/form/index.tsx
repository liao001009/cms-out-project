import apiOrderResponse from '@/api/cmsOrderResponse'
import apiStaffInfo from '@/api/cmsOutStaffInfo'
import XformExecl from '@/desktop/components/cms/XformExecl'
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
import { Button, Form, Message, ButtonGroup } from '@lui/core'
import React, { createRef, useEffect, useRef, useState } from 'react'
import XformDescription from '@/desktop/components/form/XformDescription'

import Icon from '@lui/icons'
import './index.scss'
import moment from 'moment'
import { formatDate, removalData } from '@/utils/util'

const MECHANISMNAMES = {}


const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectWrittenDe: createRef() as any
  })
  const { formRef: formRef, value: value } = props
  const [form] = Form.useForm()
  const [ivVisible, setIvVisible] = useState<string>(value.fdIsInterview || '1')
  const [nSVisible, setNSVisible] = useState<string>(value.fdNoticeSupplier || '1')
  const [supplierData, setSupplierData] = useState<any>([])
  const [defaultTableCriteria, setDefaultTableCriteria] = useState<any>({})
  const [staffInfo, setStaffInfo] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [errMsgArr, setErrMsgArr] = useState<any>([])


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
    let paramId = props?.match?.params?.id
    if (props.mode === 'add') {
      form.setFieldsValue({
        fdProjectDemand: paramId,
        fdNoticeSupplier: ['1'],
        fdIsInterview: ['1'],
        fdNoticeInterviewer: ['1']
      })
    } else {
      // 后端数据结构是字符串，要求前端用checkbox，所以只能转换
      value.fdIsInterview = [value.fdIsInterview]
      value.fdNoticeSupplier = [value.fdNoticeSupplier]
      value.fdNoticeInterviewer = [value.fdNoticeInterviewer]
      paramId = value.fdProjectDemand.fdId
    }
    if (paramId) {
      initData(paramId)
    }
    getTag()
  }, [])

  const initData = async (params) => {
    try {
      const initParam = { conditions: { 'fdProjectDemand.fdId': { '$eq': params } } }
      const resStaff = await apiOrderResponse.listStaff(initParam)
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
      let rtnSupplier = resStaff?.data?.content?.map(item => {
        const sup = {
          ...item?.fdSupplier,
          label: item?.fdSupplier.fdName,
          value: item?.fdSupplier.fdId
        }
        return sup
      })
      rtnSupplier = removalData(rtnSupplier)
      setSupplierData(rtnSupplier)
      setStaffInfo(resStaff?.data?.content)
    } catch (error) {
      console.error(error)
    }
  }

  const checkDetailWS = (val) => {
    const cmsProjectWrittenDe = form.getFieldValue('cmsProjectWrittenDe')
    const arr: any = []
    cmsProjectWrittenDe?.values?.forEach((v, r) => {
      if (!v.fdWrittenScores) return
      const fdWrittenPass = val <= v.fdWrittenScores ? '1' : '0'
      sysProps.$$form.current.updateFormItemProps('cmsProjectWrittenDe', {
        rowValue: {
          rowNum: r,
          value: {
            fdWrittenPass: fdWrittenPass,
          }
        }
      })
      const checkArr = arr.findIndex(item => item.fdId === v.fdSupplier.fdId)
      if (checkArr === -1 && fdWrittenPass === '1') {
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

  useEffect(() => {
    columns()
  }, [ivVisible])

  const columns = () => {
    const data: any[] = [
      {
        type: CMSXformModal,
        key: defaultTableCriteria,
        controlProps: {
          apiKey: apiStaffInfo,
          apiName: 'list',
          defaultTableCriteria: defaultTableCriteria,
          chooseFdName: 'fdName',
          columnsProps: outStaffInfoColumns,
          criteriaKey: 'staffReviewUpgrade',
          criteriaProps: ['fdStaffName.fdName', 'fdName'],
          title: fmtMsg(':cmsProjectWritten.form.!{l5i2iuv598u3ufwarkj}', '姓名'),
          name: 'fdInterviewName',
          desktop: {
            type: CMSXformModal
          },
          type: CMSXformModal,
          onChangeProps: async (v, r) => {
            sysProps.$$form.current.updateFormItemProps('cmsProjectWrittenDe', {
              rowValue: {
                rowNum: r,
                value: {
                  fdSupplier: v.fdSupplier,
                  fdMajor: v.fdHighestEducation,
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
                const fdWrittenPass = fdQualifiedMark <= v.target.value ? '1' : '0'
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
    ]
    if (ivVisible === '1') {
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
            dataPattern: 'yyyy-MM-dd HH/mm',
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
        })
    }
    return data
  }




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
    window.open(mk.getResourcePath('@module:cms-out-project/desktop/static/attach/written.xlsx'), '_blank')
  }


  const handlerChange = (data) => {
    const array = Object.values(data)
    setDetailTable(array)
    checkDetailWS('')
  }

  const getField = (str: string) => {
    return str.substring(str.lastIndexOf('/') + 1)
  }

  // const getStaffInfo = async () => {
  //   try {
  //     // const conditions = { conditions: { 'fdName': { '$eq': keyVal } } }
  //     const res = await apiStaffInfo.list({})
  //     setStaffInfo(res?.data?.content)
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }

  const checkPersonInfo = (keyVal) => {
    if (!staffInfo) {
      return
    }
    return staffInfo.find(item => item.fdName === keyVal)
  }


  const setDetailTable = (data) => {
    const valuesData = sysProps.$$form.current.getFieldsValue('cmsProjectWrittenDe').values
    valuesData.length && detailForms.current.cmsProjectWrittenDe.current.deleteAll()
    const fdQualifiedMark = form.getFieldValue('fdQualifiedMark')
    if (data.length > 0) {
      const errMsg: any = []
      const newValue: any = []
      data[0]?.map(i => {
        let item: any = {}
        Object.keys(i).forEach(key => {
          const field = getField(key)
          item = {
            ...item,
            [field]: i[key],
          }
        })
        const personInfo = checkPersonInfo(item['fdInterviewName'])
        if (personInfo) {
          item['fdInterviewName'] = personInfo
          const fdBeginTime = moment(formatDate(item['fdBeginTime'], '-'))
          const fdEndTime = moment(formatDate(item['fdEndTime'], '-'))
          const fdWrittenPass = Number(item['fdWrittenScores']) <= Number(fdQualifiedMark) ? '0' : '1'
          item = { ...item, ...personInfo, fdWrittenPass, fdBeginTime, fdEndTime }
          newValue.push(item)
        } else {
          errMsg.push(item['fdInterviewName'])
        }
      })
      setErrMsgArr(errMsg)
      detailForms.current.cmsProjectWrittenDe.current.updateValues(newValue)
      if (errMsg.length <= 0) {
        handleCancel()
      }
    }
  }


  return (
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
                    defaultTextValue={'录入笔试成绩'}
                    controlValueStyle={{
                      fontSize: 20,
                      fontWeight: 'bold'
                    }}
                    showStatus="edit"
                  ></XformDescription>
                </Form.Item>
              </XformFieldset>
            </GridItem>
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
                    onChange={(v) => checkDetailWS(v)}
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
                      defaultValueType: 'null'
                    }}
                    range={'all'}
                    preSelectType={'fixed'}
                    showStatus={EShowStatus.readOnly}
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
                  // defaultValueType='now'
                  // defaultValue={new Date().getTime()}
                  ></XformDatetime>
                </Form.Item>
              </XformFieldset>
            </GridItem>
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
                    columns={columns()}
                    canAddRow={true}
                    canDeleteRow={true}
                    canImport={false}
                    showStatus="edit"
                  ></XformDetailTable>

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
                    onChange={(v) => {
                      setIvVisible(v[v.length - 1])
                      // form.setFieldsValue({
                      //   fdInterviewer: [],
                      //   fdSupplierTotal: []
                      // })
                    }}
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
                hidden={ivVisible !== '1'}
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
                hidden={ivVisible !== '1'}
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
                    showStatus="edit"
                    onChange={(v) => {
                      setNSVisible(v[v.length - 1])
                      // form.setFieldsValue({
                      //   fdSupplierTotal: []
                      // })
                    }}
                  ></XformCheckbox>
                </Form.Item>
              </XformFieldset>
            </GridItem>

            <GridItem column={2} row={6} columnSpan={1} rowSpan={1}
            >
              <XformFieldset
                hidden={nSVisible !== '1' || ivVisible !== '1'}
              >
                <Form.Item name={'fdSupplierTotal'}
                  hidden={nSVisible !== '1' || ivVisible !== '1'}
                >
                  <XformSelect
                    {...sysProps}
                    multi={true}
                    placeholder={fmtMsg(':cmsOutStaffInfo.form.!{l3mpxl7izzanc6s2rh}', '请输入')}
                    options={supplierData}
                    optionSource={'custom'}
                    showStatus={EShowStatus.readOnly}
                  ></XformSelect>
                </Form.Item>
              </XformFieldset>
            </GridItem>



            <GridItem column={1} row={7} columnSpan={1} rowSpan={1}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectWritten.form.!{l5hzkx122azhemlsism}', '邮件通知面试官')}
                layout={'horizontal'}
                hidden={ivVisible !== '1'}
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

            <GridItem column={2} row={7} columnSpan={1} rowSpan={1}
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


          </LayoutGrid>
        </XformAppearance>
      </Form>
    </div>
  )
}

export default XForm
