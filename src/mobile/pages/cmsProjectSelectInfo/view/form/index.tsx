import React, { useRef, createRef, useState, useEffect } from 'react'
import './index.scss'
import { fmtMsg } from '@ekp-infra/respect'
import { Form } from '@lui/core'
import { useApi, useSystem } from '@/mobile/shared/formHooks'
import XformAppearance from '@/mobile/components/form/XformAppearance'
import XformMDescription from '@/mobile/components/form/XformMDescription'
import XformFieldset from '@/mobile/components/form/XformFieldset'
import XformMInput from '@/mobile/components/form/XformMInput'
import XformMAddress from '@/mobile/components/form/XformMAddress'
import XformMRtf from '@/mobile/components/form/XformMRtf'
import XformMDetailTable from '@/mobile/components/form/XformMDetailTable'
import XformMTextarea from '@/mobile/components/form/XformMTextarea'
import apiLevelInfo from '@/api/cmsLevelInfo'
import XformModal from '@/desktop/components/cms/XformModal'
import apiSupplier from '@/api/cmsSupplierInfo'
import XformSelect from '@/desktop/components/form/XformSelect'
import XformInput from '@/desktop/components/form/XformInput'

const MECHANISMNAMES = {}
const baseCls = 'view-page'
const XForm = (props) => {
  const detailForms = useRef({
    cmsProjectStaffList: createRef() as any
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
  const [fdLevelData, setFdLevelData] = useState<any>([])
  const [fdSupplierData, setfdSupplier] = useState<any>([])

  useEffect(() => {
    getInfo(apiLevelInfo.list, setFdLevelData)
    getInfo(apiSupplier.listSupplierInfo, setfdSupplier)
  }, [])

  const getInfo = async (api, set) => {
    try {
      const res = await api({})
      const newArr = res.data.content.map(i => {
        const item = {
          value: i.fdId,
          label: i.fdName,
          ...i
        }
        return item
      })

      set(newArr)
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <div className={`${baseCls}`}>
      <div className="mui-xform">
        <Form form={form} colPadding={false} onValuesChange={onValuesChange}>
          <XformAppearance>
            <XformFieldset compose={true}>
              <Form.Item name={'fdColUv007g'}>
                <XformMDescription
                  {...sysProps}
                  defaultTextValue={fmtMsg(':cmsProjectSelectInfo.form.!{l5luqhawfcol72uxfme}', '发布中选信息')}
                  controlValueStyle={{
                    fontSize: 20,
                    fontWeight: 'bold'
                  }}
                  showStatus="view"
                ></XformMDescription>
              </Form.Item>
            </XformFieldset>
            <XformFieldset
              labelTextAlign={'left'}
              mobileContentAlign={'left'}
              title={fmtMsg(':cmsProjectSelectInfo.form.!{l5luvc6l7kcfxu610qi}', '主题')}
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
                <XformMInput
                  {...sysProps}
                  placeholder={fmtMsg(':cmsProjectSelectInfo.form.!{l5luvc6m0fjjfi00tpz6}', '请输入')}
                  showStatus="view"
                ></XformMInput>
              </Form.Item>
            </XformFieldset>
            <XformFieldset
              mobileContentAlign={'left'}
              title={fmtMsg(':cmsProjectSelectInfo.form.!{l5luujunniw1ehkz4od}', '项目名称')}
              layout={'horizontal'}
            >
              <Form.Item name={'fdProject'}>
                <span>{value?.fdProject?.fdName}</span>
              </Form.Item>
            </XformFieldset>
            <XformFieldset
              labelTextAlign={'left'}
              mobileContentAlign={'left'}
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
                <XformMInput
                  {...sysProps}
                  placeholder={fmtMsg(':cmsProjectSelectInfo.form.!{l5luy97m7eih0soi5ai}', '请输入')}
                  showStatus="view"
                ></XformMInput>
              </Form.Item>
            </XformFieldset>
            <XformFieldset
              labelTextAlign={'left'}
              mobileContentAlign={'left'}
              title={fmtMsg(':cmsProjectSelectInfo.form.!{l5luypqfsx8hpajwtvq}', '项目负责人')}
              layout={'horizontal'}
            >
              <Form.Item name={'fdProjectLeader'}>
                <XformMAddress
                  {...sysProps}
                  org={{
                    orgTypeArr: ['8'],
                    defaultValueType: 'null'
                  }}
                  range={'all'}
                  preSelectType={'fixed'}
                  layout={'horizontal'}
                  showStatus="view"
                ></XformMAddress>
              </Form.Item>
            </XformFieldset>
            <XformFieldset
              labelTextAlign={'left'}
              mobileContentAlign={'left'}
              title={fmtMsg(':cmsProjectSelectInfo.form.!{l5lv9ncd9rasnnkldum}', '中选供应商')}
              layout={'horizontal'}
            >
              <Form.Item name={'fdSelectedSupplier'}>
                <span>{value?.fdSelectedSupplier?.map(i => i.fdName).join(',')}</span>
              </Form.Item>
            </XformFieldset>
            <XformFieldset
              labelTextAlign={'left'}
              mobileContentAlign={'left'}
              title={fmtMsg(':cmsProjectSelectInfo.form.!{l5lv9ttgp5tnh2aaym}', '落选供应商')}
              layout={'horizontal'}
            >
              <Form.Item name={'fdFailSupplier'}>
                <span>{value?.fdFailSupplier?.map(i => i.fdName).join(',')}</span>
              </Form.Item>
            </XformFieldset>
            <XformFieldset
              labelTextAlign={'left'}
              mobileContentAlign={'left'}
              title={fmtMsg(':cmsProjectSelectInfo.form.!{l5m0dspgq56rtvxth9}', '描述说明')}
              layout={'horizontal'}
              className={'fdDesc'}
            >
              <Form.Item name={'fdDesc'} >
                <XformMRtf
                  {...sysProps}
                  height={400}
                  resize={true}
                  defaultValueFormulaVO={{
                    type: 'Eval',
                    script:
                      '"根据面试结果，恭喜贵公司成为本项目的承接供应商。\\r\\n请收到本流程信息后请尽快根据中选人员名单要求与项目负责人确定后续事宜，谢谢"',
                    vo: {
                      mode: 'formula',
                      content:
                        '"根据面试结果，恭喜贵公司成为本项目的承接供应商。\\r\\n请收到本流程信息后请尽快根据中选人员名单要求与项目负责人确定后续事宜，谢谢"'
                    }
                  }}
                  viewPageSet={{
                    isSystem: true,
                    displayMode: 'adaptive'
                  }}
                  layout={'horizontal'}
                  showStatus="view"
                ></XformMRtf>
              </Form.Item>
            </XformFieldset>
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
                <XformMDetailTable
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
                      type: XformModal,
                      controlProps: {
                        modalTitle: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvypnlzsscq0s59bm}', '姓名'),
                        chooseFdName: 'fdName',
                        title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvypnlzsscq0s59bm}', '姓名'),
                        name: 'fdOutName',
                        renderMode: 'singlelist',
                        direction: 'column',
                        rowCount: 3,
                        modelName: 'com.landray.sys.xform.core.entity.design.SysXFormDesign',
                        isForwardView: 'no',
                        desktop: {
                          type: XformModal
                        },
                        type: XformModal,
                        relationCfg: {
                          appCode: '1g777p56rw10wcc6w21bs85ovbte761sncw0',
                          xformName: '外包人员信息',
                          modelId: '1g7tuuns0w13w13engw3a36caf238o0d15w0',
                          tableType: 'main',
                          tableName: 'mk_model_20220714k2uvx',
                          showFields: '$姓名$',
                          refFieldName: '$fd_name$'
                        },
                        showStatus: 'view'
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
                      type: XformSelect,
                      controlProps: {
                        title: fmtMsg(':cmsProjectSelectInfo.form.!{l5lvyw442h1gb4vaxv6}', '供应商名称'),
                        name: 'fdSupplier',
                        options: fdSupplierData,
                        placeholder: fmtMsg(':cmsStaffReviewUpgrade.form.!{l3sb91q7vi4t09qtc6f}', '请输入'),
                        desktop: {
                          type: XformSelect
                        },
                        type: XformSelect,
                        showStatus: 'view'
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
                        showStatus: 'view'
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
                        showStatus: 'view'
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
                        showStatus: 'view'
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
                  canExport={true}
                  showStatus="view"
                ></XformMDetailTable>
              </Form.Item>
            </XformFieldset>
            <XformFieldset
              labelTextAlign={'left'}
              mobileContentAlign={'left'}
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
                <XformMTextarea
                  {...sysProps}
                  placeholder={fmtMsg(':cmsProjectSelectInfo.form.!{l5lvnd7uknt2pxu03br}', '请输入')}
                  height={3}
                  layout={'horizontal'}
                  showStatus="view"
                ></XformMTextarea>
              </Form.Item>
            </XformFieldset>

          </XformAppearance>
        </Form>
      </div>
    </div>
  )
}

export default XForm
