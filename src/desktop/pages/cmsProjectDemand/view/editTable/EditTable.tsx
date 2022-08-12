import React, { useState, useEffect, useMemo } from 'react'
import { fmtMsg } from '@ekp-infra/respect'
import { Table } from '@lui/pro'
import { Select, Input } from '@lui/core'
import api from '@/api/cmsProjectDemand'
import apiAuth from '@/api/sysAuth'
import apiOrder from '@/api/cmsOrderResponse'

const { useForm } = Table
import './index.scss'

interface IProps {
  param?: any
  onchange?: any
}

const EditTable = (props: IProps) => {
  const { param, onchange: $onChange } = props
  const [orderDetailList, setOrderDetailList] = useState<any>([])
  const [editFlag, setEditFlag] = useState<boolean>(false)
  const [page, setPage] = useState<any>({
    current: 1,
    pageSize: 10,
    total: 0
  })
  useEffect(() => {
    hasChangedData()
  }, [orderDetailList])

  useEffect(() => {
    init()
    getOrderDetail({ pageSize: 1000 })
  }, [])

  const hasChangedData = () => {
    const newData = orderDetailList.filter(i => i.changed)
    $onChange?.(newData)
  }

  const columns = useMemo(() => {
    return (
      [
        {
          /**供应商名称 */
          title: '供应商名称',
          dataIndex: 'fdSupplier',
          render: (text) => <span>{text && text.fdName}</span>
        },
        {
          title: '姓名',
          dataIndex: 'fdOutName',
          render: (text) => <span>{text && text.fdName}</span>
        },
        {
          title: '岗位',
          dataIndex: 'fdPost',
          render: (text) => <span>{text && text.fdName}</span>
        },
        {
          title: '所属框架',
          dataIndex: 'fdFrame',
          render: (text) => <span>{text && text.fdName}</span>
        },
        {
          title: '自评级别',
          dataIndex: 'fdSkillLevel',
          render: (text) => <span>{text}</span>
        },
        {
          title: '评定级别',
          dataIndex: 'fdConfirmLevel',
          render: (text) => <span>{text && text.fdName}</span>
        },
        {
          title: '邮箱',
          dataIndex: 'fdEmail',
          render: (text) => <span>{text}</span>
        },
        // {
        //   title: '简历',
        //   dataIndex: '',
        //   editable: false,
        //   saveEvent: 'enter',
        //   render: text, record => <Input allowClear />
        // },
        {
          title: '是否合格',
          dataIndex: 'fdIsQualified',
          editable: false,
          saveEvent: 'change',
          render: (text) => {
            return (
              editFlag ? (
                <Select defaultValue={text}>
                  <Select.Option value={'0'}>否</Select.Option>
                  <Select.Option value={'1'}>是</Select.Option>
                </Select>
              ) : (<span>{text === undefined ? '' : text === '0' ? '否' : '是'}</span>)
            )
          }
        },
        {
          title: '备注',
          dataIndex: 'fdRemarks',
          editable: false,
          saveEvent: 'change',
          render: (text) => {
            return (
              editFlag ? (<Input.TextArea defaultValue={text} />) : (<span className='text-area' title='车车车车车车车车车二车车车车车车车车车车车车车车车车车车车车车少时诵诗书所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所'>{text !== undefined ? '' : '车车车车车车车车车二车车车车车车车车车车车车车车车车车车车车车少时诵诗书所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所'}</span>)
            )
          }
        }
      ]
    )
  }, [editFlag])

  const getOrderDetail = async (pageParms = {}) => {
    try {
      const res = await apiOrder.listOrderDetail({
        conditions: {
          'fdMain.fdProjectDemand.fdId': {
            '$eq': param.id
          }
        },
        ...pageParms
      })
      setOrderDetailList(res.data.content)
    } catch (error) {
      console.log('error', error)
    }
  }

  const init = async () => {
    try {
      const res = await apiAuth.roleCheck([{
        status: 'checking',
        key: 'auth0',
        role: 'ROLE_CMSOUTMANAGE_FRAME_ADMIN'
      }])
      setEditFlag(res.data.auth0)
    } catch (error) {
      console.log('error', error)
    }
  }

  const onSave = async (row) => {
    const newData = [...orderDetailList]
    const index = newData.findIndex((item) => row.fdId === item.fdId)
    if (index > -1) {
      const item = newData[index]
      row.changed = true
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
    } else {
      row.changed = true
      newData.push(row)
    }
    setOrderDetailList(newData)
  }

  const handleBtnClick = async (e) => {
    try {
      await api.sendRemind({
        fdId: e.fdId
      })
    } catch (error) {
      console.error('error', error)
    }
  }
  const onChange = (v) => {
    setPage(v.pagination)
  }

  const operations = useMemo(() => {
    return [
      {
        title: `${fmtMsg(':cmsProjectDemand.form.!{l5j284egz9yczrzil9}', '发送提醒')}`,
        handler (v) {
          handleBtnClick(v)
        }
      }
    ]
  }, [])

  const { tableProps } = useForm({
    data: orderDetailList || [],
    serial: 'static',
    rowSelection: false,
    columns,
    onChange,
    operations,
    onSave,
    pagination: {
      total: page.total,
      pageSize: page.pageSize,
      current: page.current,
      showTotal: (total) => (`共${total}条`),
    }
  })

  return (
    <Table {...tableProps} className={'project-demand-edit-table'} />
  )
}

export default EditTable