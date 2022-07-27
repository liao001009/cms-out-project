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
import XformAddress from '@/desktop/components/form/XformAddress'
import XformRichText from '@/desktop/components/form/XformRichText'
import XformDetailTable from '@/desktop/components/form/XformDetailTable'
import XformTextarea from '@/desktop/components/form/XformTextarea'
import CMSXformModal from '@/desktop/components/cms/XformModal'
import { outStaffInfoColumns, projectColumns, supplierColumns } from '@/desktop/pages/common/common'
import apiProject from '@/api/cmsProjectInfo'
import apiSupplier from '@/api/cmsSupplierInfo'
import apiLevelInfo from '@/api/cmsLevelInfo'
import apiStaffInfo from '@/api/cmsOutStaffInfo'
import XformSelect from '@/desktop/components/form/XformSelect'

const MECHANISMNAMES = {}
const baseCls = 'project-selectInfo-form'
const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectStaffList: createRef() as any
  })
  const { formRef: formRef } = props
  let { value:value } = props  
  value = {
    ...value,
    fdSubject:value.fdProjectDemand.fdName
  }
  const [form] = Form.useForm()
  const [fdLevelData, setFdLevelData] = useState<any>([])
  useEffect(()=>{
    getLevelData()
  },[])
  const getLevelData = async () => {
    try {
      const res = await apiLevelInfo.list({})
      const newArr = res.data.content.map(i => {
        const item = {
          value: i.fdId,
          label: i.fdName,
          ...i
        }
        return item
      })

      setFdLevelData(newArr)
    } catch (error) {
      console.log('error', error)
    }
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
    <div className={baseCls}>
      <div className="lui-xform">
        <Form form={form} colPadding={false} onValuesChange={onValuesChange}>
          <XformAppearance>
            <LayoutGrid columns={2} rows={10}>
              <GridItem
                column={1}
                row={1}
                style={{
                  textAlign: 'center',
                  justifyContent: 'center'
                }}
                rowSpan={1}
                columnSpan={2}
              >
                <XformFieldset compose={true}>
                  <Form.Item name={'fdColUv007g'}>
                    <XformDescription
                      {...sysProps}
                      defaultTextValue={fmtMsg(':cmsProjectSelectInfo.form.!{l5luqhawfcol72uxfme}', '发布中选信息')}
                      controlValueStyle={{
                        fontSize: 20,
                        fontWeight: 'bold'
                      }}
                      showStatus="edit"
                    ></XformDescription>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={2} rowSpan={1} columnSpan={2}>
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
                    <XformInput
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectSelectInfo.form.!{l5luvc6m0fjjfi00tpz6}', '请输入')}
                      showStatus="readOnly"
                    ></XformInput>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={3} rowSpan={1} columnSpan={2}>
                <XformFieldset
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectSelectInfo.form.!{l5luujunniw1ehkz4od}', '项目名称')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdProject'}>
                    <CMSXformModal
                      {...props}
                      columnsProps={projectColumns}
                      chooseFdName='fdName'
                      apiKey={apiProject}
                      apiName={'listProjectInfo'}
                      showStatus='readOnly'
                      modalTitle='项目名称选择'
                      criteriaKey='projectCriertia'
                      criteriaProps={['fdFrame.fdName']}
                    />
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={4} rowSpan={1} columnSpan={1}>
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
                    <XformInput
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectSelectInfo.form.!{l5luy97m7eih0soi5ai}', '请输入')}
                      showStatus="readOnly"
                    ></XformInput>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={2} row={4} rowSpan={1} columnSpan={1}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectSelectInfo.form.!{l5luypqfsx8hpajwtvq}', '项目负责人')}
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
              <GridItem column={1} row={5} rowSpan={1} columnSpan={2}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectSelectInfo.form.!{l5lv9ncd9rasnnkldum}', '中选供应商')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdSelectedSupplier'}>
                    <CMSXformModal
                      {...props}
                      columnsProps={supplierColumns}
                      chooseFdName='fdSupplierName'
                      apiKey={apiSupplier}
                      apiName={'listSupplierInfo'}
                      criteriaKey='supplierCriertia'
                      showStatus='readOnly'
                      modalTitle='供应商选择'
                      showFooter={true}
                      multiple={true}
                      criteriaProps={['fdOrgCode', 'fdFrame.fdName']}
                    />
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={6} rowSpan={1} columnSpan={2}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectSelectInfo.form.!{l5lv9ttgp5tnh2aaym}', '落选供应商')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdFailSupplier'}>
                    <CMSXformModal
                      {...props}
                      columnsProps={supplierColumns}
                      chooseFdName='fdSupplierName'
                      apiKey={apiSupplier}
                      apiName={'listSupplierInfo'}
                      criteriaKey='supplierCriertia'
                      showStatus='readOnly'
                      modalTitle='供应商选择'
                      showFooter={true}
                      multiple={true}
                      criteriaProps={['fdOrgCode', 'fdFrame.fdName']}
                    />
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={7} rowSpan={1} columnSpan={2}>
                <XformFieldset
                  labelTextAlign={'left'}
                  mobileContentAlign={'right'}
                  title={fmtMsg(':cmsProjectSelectInfo.form.!{l5m0dspgq56rtvxth9}', '描述说明')}
                  layout={'horizontal'}
                >
                  <Form.Item name={'fdDesc'}>
                    <XformRichText
                      {...sysProps}
                      height={400}
                      resize={true}
                      defaultValue={'根据面试结果，恭喜贵公司成为本项目的承接供应商。<br />请收到本流程信息后请尽快根据中选人员名单要求与项目负责人确定后续事宜，谢谢'}
                      viewPageSet={{
                        isSystem: true,
                        displayMode: 'adaptive'
                      }}
                      showStatus="edit"
                    ></XformRichText>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={8} rowSpan={1} columnSpan={2}>
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
                    <XformDetailTable
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
                          type: CMSXformModal,
                          controlProps: {
                            title: fmtMsg(':cmsOrderResponse.form.!{l5q589q6ciz2z821u6r}', '姓名'),
                            apiKey: apiStaffInfo,
                            apiName: 'list',
                            chooseFdName: 'fdName',
                            name: 'fdOutName',
                            criteriaKey: 'presonCriertia',
                            columnsProps: outStaffInfoColumns,
                            renderMode: 'singlelist',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            desktop: {
                              type: CMSXformModal
                            },
                            onChangeProps: (v, r) => {
                              console.log('vlaues',v)
                              sysProps.$$form.current.updateFormItemProps('cmsProjectStaffList', {
                                rowValue: {
                                  rowNum: r,
                                  value: {
                                    fdSupplier: v.fdSupplier.fdName,
                                    fdSupplierObj: v.fdSupplier,
                                    fdConfirmLevel: v.fdConfirmLevel,
                                    fdOutName: { ...v },
                                    fdEmail:v.fdEmail,
                                    fdPhone:v.fdMobile
                                  }
                                }
                              })
                            },
                            type: CMSXformModal,
                            relationCfg: {
                              appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                              xformName: '外包人员信息',
                              modelId: '1g7tuuns0w13w13engw3a36caf238o0d15w0',
                              tableType: 'main',
                              tableName: 'mk_model_20220714k2uvx',
                              showFields: '$姓名$',
                              refFieldName: '$fd_name$'
                            },
                            showStatus: 'readOnly'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvypnlzsscq0s59bm}', '姓名'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvypnlzsscq0s59bm}', '姓名')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvyw442h1gb4vaxv6}', '供应商名称'),
                            name: 'fdSupplier',
                            placeholder: fmtMsg(':cmsStaffReviewUpgrade.form.!{l3sb91q7vi4t09qtc6f}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            type: XformInput,
                            showStatus: 'readOnly'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvyw442h1gb4vaxv6}', '供应商名称'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvyw442h1gb4vaxv6}', '供应商名称')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtg32atyhhmqjuqb}', '邮箱'),
                            maxLength: 100,
                            name: 'fdEmail',
                            placeholder: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtg35kok5qkk5j6o}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            showStatus: 'readOnly'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtg32atyhhmqjuqb}', '邮箱'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtg32atyhhmqjuqb}', '邮箱')
                        },
                        {
                          type: XformInput,
                          controlProps: {
                            title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtjaa6nyvxtjubli}', '电话'),
                            maxLength: 100,
                            name: 'fdPhone',
                            placeholder: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtjab5yc3bokqmpx}', '请输入'),
                            desktop: {
                              type: XformInput
                            },
                            showStatus: 'readOnly'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtjaa6nyvxtjubli}', '电话'),
                            desktop: {
                              layout: 'vertical'
                            }
                          },
                          label: fmtMsg(':cmsProjectSelectInfo.form.!{l5lwtjaa6nyvxtjubli}', '电话')
                        },
                        {
                          type: XformSelect,
                          controlProps: {
                            title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvz3us0mcivqan3zxi}', '级别'),
                            name: 'fdConfirmLevel',
                            renderMode: 'select',
                            direction: 'column',
                            rowCount: 3,
                            modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                            isForwardView: 'no',
                            options: fdLevelData,
                            desktop: {
                              type: XformSelect
                            },
                            type: XformSelect,
                            relationCfg: {
                              appCode: '1g776q10pw10w5j2w27q4fgr1u02jiv194w0',
                              xformName: '级别信息',
                              modelId: '1g777241qw10w6osw2h8p1ig2rgc7nf192w0',
                              tableType: 'main',
                              tableName: 'mk_model_20220705zz96g',
                              showFields: '$级别名称$',
                              refFieldName: '$fd_level_name$'
                            },
                            showStatus: 'readOnly'
                          },
                          labelProps: {
                            title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvz3us0mcivqan3zxi}', '级别'),
                            desktop: {
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
                    ></XformDetailTable>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
              <GridItem column={1} row={9} rowSpan={1} columnSpan={2}>
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
                    <XformTextarea
                      {...sysProps}
                      placeholder={fmtMsg(':cmsProjectSelectInfo.form.!{l5lvnd7uknt2pxu03br}', '请输入')}
                      height={3}
                      showStatus="edit"
                    ></XformTextarea>
                  </Form.Item>
                </XformFieldset>
              </GridItem>
            </LayoutGrid>
          </XformAppearance>
        </Form>
      </div>
    </div>
  )
}

export default XForm
