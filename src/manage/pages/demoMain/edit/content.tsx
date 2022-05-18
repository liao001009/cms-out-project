import React, { useEffect, useCallback } from 'react'
import moment from 'moment'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { Locale, Module } from '@ekp-infra/common'
import { Space, Button, Form, Input, InputNumber, Message, DatePicker } from '@lui/core'
import api from '@/api/demoMain'
import './index.scss'

Message.config({ maxCount: 1 })
const { formatMessage } = Locale

// 地址本选择器
const Address = Module.getComponent('sys-org', 'Address')
// 附件
const Upload = Module.getComponent('sys-attach', 'Upload')

export interface IProps {
  /** 编辑模式，add：新建、update：更新、readOnly：只读 */
  mode?: 'add' | 'update' | 'readOnly'
}

const baseClass = 'demo-detail'
const Content: React.FC<IProps & IContentViewProps> = (props) => {
  // 默认为更新模式
  const { status, data, mode = 'update', history } = props
  const [form] = Form.useForm()

  useEffect(() => {
    // 初始化 、赋值
    if (status === 'done') {
      form.setFieldsValue({
        ...data,
        fdCreateTime: data?.fdCreateTime && moment(data.fdCreateTime) || moment()
      })
    }
  }, [data])

  // 提交
  const handleSubmit = useCallback(() => {
    const submitApi = mode === 'add' ? api.add : api.update
    const value = form.getFieldsValue()
    form.validateFields().then(() => {
      Message.loading(formatMessage(`common:button.${mode === 'add' ? 'add' : 'update'}`) + '...')
      submitApi({
        ...value,
        fdCreateTime: moment.valueOf()
      }).then(() => {
        Message.success('操作成功', 1, () => {
          history.goBack()
        })
      }).catch(() => {
        Message.error('操作失败')
      })
    })
  }, [mode])

  // 取消
  const handleCancel = useCallback(() => {
    history.goBack()
  }, [])

  const readOnly = mode === 'readOnly'
  return (
    <div className={`${baseClass} ${mode}`}>
      <div className={`${baseClass}-toolbar`}>
        <div className={`${baseClass}-title`}>
          {formatMessage('demo:menu.demoMain')}
        </div>
        <Space>
          {
            mode !== 'readOnly' && (
              <Button type='primary' htmlType='button' onClick={handleSubmit}>
                {formatMessage(`common:button.${mode === 'add' ? 'save' : 'update'}`)}
              </Button>
            )
          }
          <Button htmlType='button' onClick={handleCancel}>
            {formatMessage('common:button.cancel')}
          </Button>
        </Space>
      </div>
      <div className={`${baseClass}-header`}>
        {formatMessage('demo:header.baseinfo')}
      </div>
      <div className={`${baseClass}-form`}>
        <Form
          form={form}
          labelAlign='right'
          colon={true}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 10 }}
          layout='horizontal'
          scrollToFirstError
          initialValues={{ fdOrder: 1 }}>
          {/* id */}
          <Form.Item style={{ display: 'none' }} name='fdId'>
            <Input disabled={readOnly} />
          </Form.Item>
          {/* 名称 */}
          <Form.Item
            name='fdName'
            label={formatMessage('demo:demoMain.fdName')}
            rules={[
              { required: true, message: '请输入名称!', whitespace: true },
            ]}>
            <Input placeholder={formatMessage('demo:demoMain.fdName')} disabled={readOnly} />
          </Form.Item>
          {/* 描述 */}
          <Form.Item
            name='fdDesc'
            label={formatMessage('demo:demoMain.fdDesc')}>
            <Input.TextArea placeholder={formatMessage('demo:demoMain.fdDesc')} disabled={readOnly} />
          </Form.Item>
          {/* 排序号 */}
          <Form.Item
            name='fdOrder'
            label={formatMessage('demo:demoMain.fdOrder')}>
            <InputNumber style={{ width: '100%' }} disabled={readOnly}></InputNumber>
          </Form.Item>
          {/* 创建人 */}
          <Form.Item
            name='fdCreator'
            label={formatMessage('demo:demoMain.fdCreator')}>
            <Address orgType={8} disabled={readOnly} />
          </Form.Item>
          {/* 创建时间 */}
          <Form.Item
            name='fdCreateTime'
            label={formatMessage('demo:demoMain.fdCreateTime')}>
            {
              readOnly ?
                data?.fdCreateTime
                && mk.getFormatTime(data?.fdCreateTime?.valueOf(), 'YYYY-MM-DD')
                : (<DatePicker picker='date' style={{ width: '100%' }} disabled={readOnly} />)
            }
          </Form.Item>
          {/* 附件 */}
          {
            !readOnly && (
              <Form.Item
                name='fdAttachment'
                label='附件'>
                <Upload
                  mode='file'
                  fdEntityKey='attachment'
                  fdEntityName='com.landray.demo.entity.DemoMain' />
              </Form.Item>
            )
          }
        </Form>
      </div>
    </div>
  )
}

export default Content