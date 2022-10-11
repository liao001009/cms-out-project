import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { fmtMsg } from '@ekp-infra/respect'
import { Table } from '@lui/pro'
import { Select, Input, Message } from '@lui/core'
import api from '@/api/cmsProjectDemand'
import apiOrder from '@/api/cmsOrderResponse'
import { Module } from '@ekp-infra/common'
import apiStaffInfo from '@/api/cmsOutStaffInfo'
const Upload = Module.getComponent('sys-attach', 'Attachment')

const { useForm } = Table
import './index.scss'

interface IProps {
  param?: any
  onchange?: any
  onExport?: any
  // 编辑权限
  editFlag: boolean
}

const EditTable = (props: IProps) => {
  const { param, onchange: $onChange, onExport, editFlag } = props
  const [orderDetailList, setOrderDetailList] = useState<any>([])
  const [selectedRowsData, setSelectedRows] = useState<any>([])
  const [page, setPage] = useState<any>({
    current: 1,
    pageSize: 10,
    total: 0
  })
  useEffect(() => {
    hasChangedData()
  }, [orderDetailList])

  useEffect(() => {
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
          width: 120,
          render: (text) => <span title={text && text.fdName}>{text && text.fdName}</span>
        },
        {
          title: '姓名',
          dataIndex: 'fdOutName',
          width: 120,
          render: (text) => <span title={text && text.fdName}>{text && text.fdName}</span>
        },
        {
          title: '岗位',
          dataIndex: 'fdPost',
          width: 120,
          render: (text) => <span title={text && text.fdName}>{text && text.fdName}</span>
        },
        {
          title: '所属框架',
          dataIndex: 'fdFrame',
          width: 120,
          render: (text) => <span title={text && text.fdName}>{text && text.fdName}</span>
        },
        {
          title: '自评级别',
          dataIndex: 'fdSkillLevel',
          width: 120,
          render: (text) => <span title={text}>{text}</span>
        },
        {
          title: '评定级别',
          dataIndex: 'fdConfirmLevel',
          width: 120,
          render: (text) => <span title={text && text.fdName}>{text && text.fdName}</span>
        },
        {
          title: '邮箱',
          dataIndex: 'fdEmail',
          width: 120,
          render: (text) => <span title={text}>{text}</span>
        },
        {
          title: '电话',
          dataIndex: 'fdPhone',
          width: 120,
          render: (text) => <span title={text}>{text}</span>
        },
        {
          title: '简历',
          dataIndex: 'fdAtt',
          width: 200,
          render: (text: any) => {
            return (
              <Fragment>
                {
                  text ? (
                    <Upload
                      value={[text]}
                      multiple={false}
                      itemType={'card'}
                      mode='file'
                      viewStatus={true}
                      showStatus={'view'}
                      operationDisplayConfig={{
                        showDownload: true,
                        showRemove: false,
                        showChange: false,
                        showEdit: false
                      }}
                      ItemDisplayConfig={{
                        showOrder: false,
                        showHeader: true
                      }}
                    />
                  ) : null
                }
              </Fragment>
            )
          }
        },
        {
          title: '是否合格',
          width: 120,
          dataIndex: 'fdIsQualified',
          key: 'fdIsQualified',
          editable: false,
          saveEvent: 'change',
          render: (text, record) => {
            return editFlag ? (
              <Select onSelect={(val) => handleChangeValue(val, record, 'fdIsQualified')} defaultValue={text} style={{ width: '100px' }}>
                <Select.Option value={'0'}>否</Select.Option>
                <Select.Option value={'1'}>是</Select.Option>
              </Select>
            ) : (<span>{text === '0' ? '否' : '是'}</span>)
          }
        },
        {
          title: '备注',
          dataIndex: 'fdRemarks',
          key: 'fdRemarks',
          width: 200,
          editable: !editFlag,
          saveEvent: 'blur',
          render: (text, record) => {
            return <Input.TextArea defaultValue={text} placeholder='请输入' onChange={(text) => handleChangeValue(text, record, 'fdRemarks')} />
          }
        }
      ]
    )
  }, [editFlag, orderDetailList])

  const conactStaffInfo = async (list) => {
    const result = list.map(i => {
      return apiStaffInfo.get({ fdId: i.fdOutName.fdId, mechanisms: { load: '*' } })
    })
    const newData = await Promise.all(result)
    if (newData.length) {
      const newList = JSON.parse(JSON.stringify(list))
      const res = newList.map((k, v) => {
        //@ts-ignore
        k.fdAtt = newData[v].data.mechanisms.attachment.find(i => i.fdEntityKey === 'fdResumeAtt')
        return k
      })
      setOrderDetailList(res)
    } else {
      setOrderDetailList(list)
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


  const handleChangeValue = (val, record, type) => {
    const newData = [...orderDetailList]
    if (type === 'fdRemarks') {
      record[type] = val.target.value
    } else {
      record[type] = val
    }
    const index = newData.findIndex((item) => record.fdId === item.fdId)
    if (index > -1) {
      const item = newData[index]
      record.changed = true
      newData.splice(index, 1, {
        ...item,
        ...record,
      })
    } else {
      record.changed = true
      newData.push(record)
    }
    setOrderDetailList(newData)
  }

  const onSave = async (row) => {
    console.log('row5559', row)
  }

  const handleBtnClick = async (e) => {
    try {
      const res = await api.sendRemind({
        fdId: e.fdId
      })
      if (res.success) {
        Message.success('发送成功')
      }
    } catch (error) {
      Message.error(error.response.data.msg || '发送失败')
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

  const { tableProps, selectedRows } = useForm({
    data: orderDetailList || [],
    serial: 'static' as 'static',
    rowSelection: {
      selectedRowKeys: selectedRowsData,
    },
    columns,
    onChange,
    operations: editFlag ? operations : undefined,
    onSave,
    pagination: {
      total: page.total,
      pageSize: page.pageSize,
      current: page.current,
      showTotal: (total) => (`共${total}条`),
    }
  })
  const getSelectData = (arr) => {
    let newData = orderDetailList.filter(i => arr.includes(i.fdId))
    newData = renderData(newData)
    return newData
  }
  useEffect(() => {
    setSelectedRows([...selectedRows])
    onExport?.(getSelectData(selectedRows), columns, ['fdAtt'], selectedRows)
  }, [selectedRows])

  // 将数据转变为需要导出的格式
  const renderData = (data) => {
    const newDate = data.map(i => {
      for (const key in i) {
        if (key === 'fdAtt' || key === 'dynamicProps') continue
        if (key === 'fdIsQualified') {
          i.fdIsQualified = i['fdIsQualified'] > 0 ? '是' : '否'
        }
        if (typeof i[key] === 'object') {
          i[key] = i[key].fdName
        }
      }
      return i
    })
    return newDate
  }
  return (
    <div>
      <Table {...tableProps} className={'project-demand-edit-table'} />
    </div>
  )
}

export default EditTable