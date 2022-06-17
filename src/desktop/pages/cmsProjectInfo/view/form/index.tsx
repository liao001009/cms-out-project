import React, { useRef } from 'react'
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
import XformSelect from '@/desktop/components/form/XformSelect'
import XformDatetime from '@/desktop/components/form/XformDatetime'

const MECHANISMNAMES = {}

const XForm = (props) => {
  const detailForms = useRef({})
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
                <Form.Item name={'fdCol4qv13i'}>
                  <XformDescription
                    {...sysProps}
                    defaultTextValue={fmtMsg(':cmsProjectInfo.form.!{l470kiqmfuah40n41sq}', '项目库')}
                    controlValueStyle={{
                      fontWeight: 'bold',
                      fontSize: 20
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
            <GridItem column={1} row={2}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l470jwldimflokpfrzh}', '项目名称')}
                layout={'horizontal'}
                required={true}
              >
                <Form.Item
                  name={'fdName'}
                  rules={[
                    {
                      validator: lengthValidator(100)
                    }
                  ]}
                >
                  <XformInput
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectInfo.form.!{l470jwlpnq3xw2ch55}', '请输入')}
                    showStatus="view"
                  ></XformInput>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            <GridItem column={2} row={2}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l470lkjy8xm11z9ta7t}', '项目编号')}
                layout={'horizontal'}
              >
                <Form.Item
                  name={'fdCode'}
                  rules={[
                    {
                      validator: lengthValidator(100)
                    }
                  ]}
                >
                  <XformInput
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectInfo.form.!{l470lkk38gp25ho2dum}', '请输入')}
                    showStatus="view"
                  ></XformInput>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            <GridItem column={1} row={3}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l47sjaxpzb906zmknn}', '所属部门')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdBelongDept'}>
                  <XformAddress
                    {...sysProps}
                    org={{
                      orgTypeArr: ['2'],
                      defaultValueType: 'null'
                    }}
                    range={'all'}
                    preSelectType={'fixed'}
                    showStatus="view"
                  ></XformAddress>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            <GridItem column={2} row={3}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l47sjboxx5zvzn3c1kg}', '所属组/团队')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdBelongTeam'}>
                  <XformAddress
                    {...sysProps}
                    org={{
                      orgTypeArr: ['2'],
                      defaultValueType: 'null'
                    }}
                    range={'all'}
                    preSelectType={'fixed'}
                    showStatus="view"
                  ></XformAddress>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            <GridItem column={1} row={4}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l47sjd9hp4ye7ccl0b}', '项目负责人')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdProjectPrincipal'}>
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
            <GridItem column={2} row={4}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l47sjeg41qyf3n63q5g}', '内部责任人')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdInnerPrincipal'}>
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
            <GridItem column={1} row={5}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l47s8bsqziln6fgdbd}', '项目所属框架')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdFrame'}>
                  <span>{value.fdFrame.fdName}</span>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            <GridItem column={2} row={5}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l47sfd36r349zf59xxg}', '项目性质')}
                layout={'horizontal'}
              >
                <Form.Item
                  name={'fdProjectNature'}
                  rules={[
                    {
                      validator: lengthValidator(50)
                    }
                  ]}
                >
                  <XformSelect
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectInfo.form.!{l47sfd3bplubk8x7ajm}', '请输入')}
                    options={[
                      {
                        label: fmtMsg(':cmsProjectInfo.form.!{l47sfrrrok1nmlb0tw}', '项目外包'),
                        value: '1'
                      },
                      {
                        label: fmtMsg(':cmsProjectInfo.form.!{l47sfrrsm8set33swh8}', '厂商驻场实施'),
                        value: '2'
                      }
                    ]}
                    optionSource={'custom'}
                    showStatus="view"
                  ></XformSelect>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            <GridItem column={1} row={6} columnSpan={2} rowSpan={1}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l47sgez8tcuawseqs2a}', '项目立项时间')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdProjectDate'}>
                  <XformDatetime
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectInfo.form.!{l47sgezcgg3tpw1payl}', '请输入')}
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
            ></GridItem>
            <GridItem column={1} row={7}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l47sgg0zn6wzc3ukv7}', '预计开始时间')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdStartDate'}>
                  <XformDatetime
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectInfo.form.!{l47sgg12fckhecvwwho}', '请输入')}
                    dataPattern={'yyyy-MM-dd'}
                    showStatus="view"
                  ></XformDatetime>
                </Form.Item>
              </XformFieldset>
            </GridItem>
            <GridItem column={2} row={7}>
              <XformFieldset
                labelTextAlign={'left'}
                mobileContentAlign={'right'}
                title={fmtMsg(':cmsProjectInfo.form.!{l47sgh46l1ahpgby3cb}', '预计结束日期')}
                layout={'horizontal'}
              >
                <Form.Item name={'fdEndDate'}>
                  <XformDatetime
                    {...sysProps}
                    placeholder={fmtMsg(':cmsProjectInfo.form.!{l47sgh496ph195ayp68}', '请输入')}
                    dataPattern={'yyyy-MM-dd'}
                    showStatus="view"
                  ></XformDatetime>
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
