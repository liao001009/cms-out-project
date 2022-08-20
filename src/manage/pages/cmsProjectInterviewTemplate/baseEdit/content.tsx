import React, { useEffect, useImperativeHandle, useRef } from 'react'
import { Button, Form, Input, Message } from '@lui/core'
import api from '@/api/cmsProjectInterviewTemplate'

export interface IProps {
  // 模板id
  templateId?: string
  // 编辑模式
  mode?: 'add' | 'update'
  // ref
  wrappedComponentRef: any
}

Message.config({ maxCount: 1 })
const Content: React.FC<IProps> = (props) => {
  const { templateId, mode, wrappedComponentRef } = props
  const [form] = Form.useForm()
  const valuesRef = useRef({})

  useImperativeHandle(
    wrappedComponentRef,
    () => ({
      // 提交逻辑
      handleOk: (callback: Function) => {
        form.validateFields().then((values) => {
          values = Object.assign({}, valuesRef.current, values)
          const submitApi = mode === 'add' ? api.add : api.update
          const hide = Message.loading(mode === 'add' ? '新建中...' : '更新中...', 0)
          submitApi(values!)
            .then(() => {
              hide()
              Message.success(mode === 'add' ? '新建成功' : '更新成功', 1.5, () => {
                callback(values)
              })
            })
            .catch(() => {
              hide()
              Message.error(mode === 'add' ? '新建失败' : '更新失败', 1.5)
              callback()
            })
        })
      }
    }),
    [templateId]
  )

  useEffect(() => {
    // 初始化逻辑
    const initPromise = mode === 'add' ? api.init({ mechanisms: { load: '*' } }) : api.get({ fdId: templateId })
    initPromise.then((values) => {
      valuesRef.current = values?.data
      form.setFieldsValue(values?.data)
    })
  }, [templateId, mode])

  return (
    <Form
      form={form}
      labelAlign="right"
      colon={true}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      scrollToFirstError
    >
      {/* id */}
      <Form.Item style={{ display: 'none' }} name="fdId">
        <Input />
      </Form.Item>
      {/* 模板名称 */}
      <Form.Item name="fdName" label="模板名称" rules={[{ required: true, message: '请输入名称!', whitespace: true }]}>
        <Input placeholder="模板名称" />
      </Form.Item>
      {/* 模板编码 */}
      <Form.Item label="模板编码">
        <Input.Group compact={true}>
          <Form.Item
            noStyle
            name="fdCode"
            initialValue={`template_${Math.random().toString(36).slice(-6)}`}
            rules={[
              {
                required: true,
                message: '模板编码不允许为空'
              },
              {
                max: 15,
                message: '最大长度为15'
              }
            ]}
          >
            <Input
              type="text"
              disabled={form.getFieldValue('fdEnable') || mode === 'update'}
              style={{ width: '70%', display: 'inline-block' }}
            />
          </Form.Item>
          <Form.Item noStyle>
            <Button
              type="primary"
              disabled={form.getFieldValue('fdEnable')}
              onClick={() => {
                form.setFieldsValue({
                  fdCode: `template_${new Date().getTime().toString(36).slice(-6)}`
                })
              }}
              style={{ width: '30%', display: 'inline-block' }}
            >
              自动填充
            </Button>
          </Form.Item>
        </Input.Group>
      </Form.Item>
      {/* 状态 */}
      {/* <Form.Item
        name='fdEnable'
        label='状态'>
        {form.getFieldValue('fdEnable') === true || mode ==='add' ? '启用' : '禁用'}
      </Form.Item> */}
      {/* 模板描述 */}
      <Form.Item name="fdDesc" label="模板描述">
        <Input.TextArea placeholder="模板描述" />
      </Form.Item>
    </Form>
  )
}

export default Content
