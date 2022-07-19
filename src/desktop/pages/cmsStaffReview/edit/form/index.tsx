import React, { useRef, createRef } from 'react'
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

const MECHANISMNAMES = {}

const XForm = (props) => {
  const detailForms = useRef({
    cmsStaffReviewDetail: createRef() as any
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
                    showStatus="edit"
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
                    showStatus="edit"
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
                    showStatus="edit"
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
                    showStatus="edit"
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
                        type: XformRelation,
                        controlProps: {
                          title: fmtMsg(':cmsStaffReview.form.!{l5j0l4chmvb5xkzogfj}', '供应商'),
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
                            type: XformRelation
                          },
                          type: XformRelation,
                          relationCfg: {
                            appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                            xformName: '供应商信息',
                            modelId: '1g777qg92w10wcf2w1jiihhv3oqp4s6nr9w0',
                            tableType: 'main',
                            tableName: 'mk_model_20220705vk0ha',
                            showFields: '$供应商名称$',
                            refFieldName: '$fd_supplier_name$'
                          },
                          showStatus: 'edit'
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
                          showStatus: 'edit'
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
                        type: XformRelation,
                        controlProps: {
                          title: fmtMsg(':cmsStaffReview.form.!{l5j0m5k1v80p3j6skmo}', '姓名'),
                          name: 'fdOutName',
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
                            type: XformRelation
                          },
                          type: XformRelation,
                          relationCfg: {
                            appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                            xformName: '外包人员信息',
                            modelId: '1g7tuuns0w13w13engw3a36caf238o0d15w0',
                            tableType: 'main',
                            tableName: 'mk_model_20220714k2uvx',
                            showFields: '$姓名$',
                            refFieldName: '$fd_name$'
                          },
                          showStatus: 'edit'
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
                          showStatus: 'edit'
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
                              label: fmtMsg(':cmsStaffReview.form.!{l5j0nahn1y66v7farvp}', '为参加笔试'),
                              value: '2'
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
                              label: fmtMsg(':cmsStaffReview.form.!{l5j0ng08dbu57pugteq}', '为参面试'),
                              value: '2'
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
                          showStatus: 'edit'
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
                        type: XformRelation,
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
                            type: XformRelation
                          },
                          type: XformRelation,
                          renderMode: 'select',
                          direction: 'column',
                          rowCount: 3,
                          modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                          isForwardView: 'no',
                          relationCfg: {
                            appCode: '1g776q10pw10w5j2w27q4fgr1u02jiv194w0',
                            xformName: '级别信息',
                            modelId: '1g777241qw10w6osw2h8p1ig2rgc7nf192w0',
                            tableType: 'main',
                            tableName: 'mk_model_20220705zz96g',
                            showFields: '$级别名称$',
                            refFieldName: '$fd_level_name$'
                          },
                          showStatus: 'edit'
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
                  <XformRelation
                    {...sysProps}
                    renderMode={'mullist'}
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
                    multi={true}
                    relationCfg={{
                      appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                      xformName: '供应商信息',
                      modelId: '1g777qg92w10wcf2w1jiihhv3oqp4s6nr9w0',
                      tableType: 'main',
                      tableName: 'mk_model_20220705vk0ha',
                      showFields: '$供应商简称$',
                      refFieldName: '$fd_supplier_simple_name$'
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
                        },
                        {
                          name: 'fd_org_code',
                          label: '组织机构代码'
                        },
                        {
                          name: 'fd_cooperation_status',
                          label: '供应商合作状态'
                        },
                        {
                          name: 'fd_supplier_email',
                          label: '供应商邮箱'
                        },
                        {
                          name: 'fd_supplier_simple_name',
                          label: '供应商简称'
                        },
                        {
                          name: 'fd_admin_account',
                          label: '开通管理员账号'
                        },
                        {
                          name: 'fd_frame',
                          label: '所属框架'
                        },
                        {
                          name: 'fd_desc',
                          label: '供应商简介'
                        }
                      ],
                      filters: [
                        {
                          name: 'fd_supplier_name',
                          label: '供应商名称'
                        },
                        {
                          name: 'fd_org_code',
                          label: '组织机构代码'
                        },
                        {
                          name: 'fd_cooperation_status',
                          label: '供应商合作状态'
                        },
                        {
                          name: 'fd_supplier_email',
                          label: '供应商邮箱'
                        },
                        {
                          name: 'fd_supplier_simple_name',
                          label: '供应商简称'
                        },
                        {
                          name: 'fd_admin_account',
                          label: '开通管理员账号'
                        },
                        {
                          name: 'fd_frame',
                          label: '所属框架'
                        },
                        {
                          name: 'fd_desc',
                          label: '供应商简介'
                        }
                      ],
                      isListThrough: true
                    }}
                    showStatus="edit"
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
            ></GridItem>
            <GridItem column={1} row={7} columnSpan={2} rowSpan={1}>
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
                    showStatus="edit"
                  ></XformRelation>
                </Form.Item>
              </XformFieldset>
            </GridItem>
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
  )
}

export default XForm
