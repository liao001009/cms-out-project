import React, { useState, useEffect, useMemo } from 'react'
import { fmtMsg } from '@ekp-infra/respect'
import { Table } from '@lui/pro'
import { Select, Input } from '@lui/core'
import api from '@/api/cmsProjectDemand'
import apiAuth from '@/api/sysAuth'
import apiOrder from '@/api/cmsOrderResponse'
import { Module } from '@ekp-infra/common'
import apiStaffInfo from '@/api/cmsOutStaffInfo'

const Upload = Module.getComponent('sys-attach', 'Attachment')

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
        {
          title: '简历',
          dataIndex: 'fdAtt',
          render: (text: any, record) => {
            console.log('text5559', text)
            console.log('record5559', record)
            return (
              <Upload value={[text]} multiple={false} itemType={'card'} mode='file' viewStatus={true} showStatus={'view'} />
            )
          }
        },
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
          saveEvent: 'blur',
          render: (text) => {
            return (
              editFlag ? (<Input.TextArea defaultValue={text} placeholder='请输入' />) : (<span className='text-area' title=''>{text !== undefined ? '' : text}</span>)
            )
          }
        }
      ]
    )
  }, [editFlag, orderDetailList])

  const conactStaffInfo = async (list) => {
    const newData: any = await Promise.all(list.map((i) => {
      return (async () => {
        const res = await apiStaffInfo.get({ fdId: i.fdOutName.fdId, mechanisms: { load: '*' } })
        return res
      })()
    }))
    if (newData.length) {
      const newList = JSON.parse(JSON.stringify(list))
      const res = newList.map((k, v) => {
        k.fdAtt = newData[v].data.mechanisms.attachment.find(i => i.fdEntityKey === 'fdResumeAtt')
        return k
      })
      setOrderDetailList(res)
    }
  }

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
      conactStaffInfo(res.data.content)
    } catch (error) {
      console.log('error', error)
    }
  }

  console.log('orderDetailList5559', orderDetailList)
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

  // const formPorps = useMemo(() => (), [orderDetailList, page])
  const { tableProps } = useForm({
    data: orderDetailList || [],
    serial: 'static' as 'static',
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