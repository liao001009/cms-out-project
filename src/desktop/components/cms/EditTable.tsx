import React, { useState, useEffect, useMemo } from 'react'
import { fmtMsg } from '@ekp-infra/respect'
import { Table } from '@lui/pro'
import { Select, Input, Button } from '@lui/core'
import api from '@/api/cmsProjectDemand'
import apiAuth from '@/api/sysAuth'
const { useForm } = Table
import './index.scss'
interface IProps {
  onChange?: (v) => void
  data?: any
  changePage?: (v) => void
}


const EditTable = (props: IProps) => {
  const { data, onChange: $onChange, changePage } = props

  const [listData, setListData] = useState<any>(data.content || [])
  const [editFlag, setEditFlag] = useState<boolean>(false)
  const [page, setPage] = useState<any>({
    current: Math.floor(data.offset / data.pageSize + 1),
    pageSize: data.pageSize,
    total: data.totalSize
  })
  useEffect(() => {
    setListData(data.content)
  }, [data])
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
  useEffect(() => {
    init()
  }, [])

  const columns = useMemo(() => {
    return (
      [
        {
          /**供应商名称 */
          title: '供应商名称',
          dataIndex: 'fdSupplier',
          render: (text, record) => <span>{text && text.fdName}</span>
        },
        {
          title: '姓名',
          dataIndex: 'fdOutName',
          render: (text, record) => <span>{text && text.fdName}</span>
        },
        {
          title: '岗位',
          dataIndex: 'fdPost',
          render: (text, record) => <span>{text && text.fdName}</span>
        },
        {
          title: '所属框架',
          dataIndex: 'fdFrame',
          render: (text, record) => <span>{text && text.fdName}</span>
        },
        {
          title: '自评级别',
          dataIndex: 'fdSkillLevel',
          render: (text, record) => <span>{text}</span>
        },
        {
          title: '评定级别',
          dataIndex: 'fdConfirmLevel',
          render: (text, record) => <span>{text && text.fdName}</span>
        },
        {
          title: '邮箱',
          dataIndex: 'fdEmail',
          render: (text, record) => <span>{text}</span>
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
          render: (text, record) => {
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
          render: (text, record) => {
            return (
              editFlag ? (<Input.TextArea defaultValue={text} />) : (<span className='text-area' title='车车车车车车车车车二车车车车车车车车车车车车车车车车车车车车车少时诵诗书所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所'>{text !== undefined ? '' : '车车车车车车车车车二车车车车车车车车车车车车车车车车车车车车车少时诵诗书所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所'}</span>)
            )
          }
        }
      ]
    )
  }, [editFlag])
  const onSave = async (row) => {
    const newData = [...listData]
    const index = newData.findIndex((item) => row.fdId === item.fdId)
    if (index > -1) {
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
    } else {
      newData.push(row)
    }
    setListData(newData)
    console.log('v5559row', row)
    $onChange?.(row)
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
    console.log('data5559v', data)
    console.log('v5559s', v)
    const { current, pageSize } = v.pagination
    setPage(v.pagination)
    const offset = Math.floor((current - 1) * pageSize)
    changePage?.({ offset, pageSize })
    // $onChange?.({ current, pageSize })
  }
  console.log('data5559', listData)
  console.log('data5559d', data)
  console.log('data5559d', page)
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
  const onRowClick = (v) => {
    console.log('v5559v', v)
  }
  // const queryChange = (pageNo, pageSize) => {
  //   setPage({
  //     ...page,
  //     current: pageNo,
  //     pageSize
  //   })
  // }
  const { tableProps } = useForm({
    data: listData,
    serial: 'static',
    rowSelection: false,
    columns,
    onChange,
    //@ts-ignore
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
    //@ts-ignore
    <Table {...tableProps} className={'project-demand-edit-table'} onRow={onRowClick} />
  )
}

export default EditTable