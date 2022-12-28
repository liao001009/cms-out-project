import { IContentViewProps } from '@ekp-runtime/module'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Message, Modal, Table } from '@lui/core'
import Tag from '@antd/tag'
import Criteria from '@elem/criteria'
import { $reduceCriteria } from '@/desktop/shared/criteria'
import './index.scss'
import { criertiaObj } from '@/desktop/pages/common/common'
import { renderConditions } from '@/desktop/shared/util'
export enum EShowStatus {
  /** 查看 */
  'view' = 'view',
  /** 编辑 */
  'edit' = 'edit',
  /** 添加 */
  'add' = 'add',
  /** 只读 */
  'readOnly' = 'readOnly'
}

export interface IProps extends IContentViewProps {
  /** 回调调整明细表事件 */
  onChangeProps?: (v, r) => void
  /** function */
  onChange?: (v) => void
  /** 组件状态 */
  showStatus?: EShowStatus
  /** 组件数据 */
  value?: any
  /** 请求体 */
  apiRequest?: any
  /** 表格表头 */
  columnsProps?: Array<any>
  /** 选中名称 */
  chooseFdName?: string
  /** 弹窗标题 */
  modalTitle?: string
  /** 渲染筛选 */
  criteriaKey?: any
  /** apiKey */
  apiKey: any
  /** apiName */
  apiName: string
  /** 要改变的筛选项,将$eq改成$contains */
  criteriaProps?: any
  /** 行号 */
  rowIndex?: number
  /** 默认的表格列筛选 */
  defaultTableCriteria?: any
  /** 渲染底部 */
  showFooter?: boolean
  /** 多选 */
  multiple?: boolean
  /** 是否展示筛选 */
  showCriteria?: boolean
  /**接口参数(不在conditions里面的) */
  params?: any
  /** 默认列表无数据 */
  showTableData?: string
  /**是否是项目类型 */
  mark?: boolean
  /** 扩展 */
  [key: string]: any
  /**默认可以发起请求 */
  defaultSearch: boolean
  /**是否是供应商类型 */
  isSupplier?: boolean
  /**是否是项目外包类型 */
  isProjectNature?: boolean
  /**初始值 */
  initData?: any
}

const XformModal: React.FC<IProps> = (props) => {
  const {
    onChange,
    showStatus,
    value,
    criteriaKey,
    query = {},
    history,
    chooseFdName = '',
    columnsProps = [],
    modalTitle = '标题',
    apiKey,
    apiName,
    onChangeProps,
    criteriaProps = [],
    rowIndex = 0,
    defaultTableCriteria = {},
    showFooter = false,
    multiple = false,
    showCriteria = true,
    otherData = {},
    showOther = false,
    params = {},
    showTableData = '',
    mark = false,
    defaultSearch = false,
    isSupplier = false,
    isProjectNature = false,
    initData = value,
  } = props

  const [listData, setListData] = useState<any>([])
  const [page, setPage] = useState<any>({ total: 0, pageSize: 10 })
  const [visible, setVisible] = useState<boolean>(false)
  const [fdName, setFdName] = useState<string>(initData?.fdName || '')
  // 选中的筛选项
  const [selectParams, setSelectedParams] = useState<any>({})
  // 多选时，选中的数据
  const [selectedRowsData, setSelectedRows] = useState<any>([])
  // 表单传过来的初始值，为了点击取消时，还原数据
  const [initSelectedArr, setInitSelectArr] = useState<any>([])
  const initValue = useMemo(() => {
    return initData
  }, [initData])
  useEffect(() => {
    if (!selectedRowsData?.length && showTableData) {
      setListData([])
    }
    if (!visible) {
      setSelectedParams({})
    }
  }, [visible])
  useEffect(() => {
    setFdName(initValue?.fdName || '')
    if (multiple) {
      setSelectedRows(initValue && initValue.map(i => i.fdId))
    }
    setInitSelectArr(initValue)
  }, [initValue])

  /** 组装表格列头筛选项 */
  const getDefaultTableColumns = () => {
    if (Object.keys(defaultTableCriteria).length <= 0) return {}
    const newConditions = {}
    Object.keys(defaultTableCriteria).forEach(key => {
      const newConditionsKey = {}
      newConditionsKey[defaultTableCriteria[key]['searchKey']] = defaultTableCriteria[key]['searchValue']
      newConditions[key] = defaultTableCriteria[key]['searchValue'] && newConditionsKey
    })
    if (params && Object.keys(params).length) {
      return {
        conditions: { ...newConditions },
        ...params
      }
    }
    return {
      conditions: { ...newConditions }
    }
  }
  /** 为了兼容特殊筛选组装表格列头筛选项如外包人员评审调级，调级结果弹窗筛选 */
  const getOtherDefaultTableColumns = () => {
    const postData = props.$$form.current.getFieldsValue()[props.$$tableName].values.length && props.$$form.current.getFieldsValue()[props.$$tableName].values[rowIndex]
    if (!postData.fdPost) return {}
    const postFilter = otherData.length && otherData?.find(item => item.value === postData.fdPost.fdId)
    if (Object.keys(defaultTableCriteria).length <= 0) return {}
    const newConditions = {}
    Object.keys(defaultTableCriteria).forEach(key => {
      const newConditionsKey = {}
      newConditionsKey[defaultTableCriteria[key]['searchKey']] = postFilter.fdFrame.fdName || ''
      newConditions[key] = postFilter.fdFrame.fdName && newConditionsKey
    })
    return {
      conditions: { ...newConditions }
    }
  }

  useEffect(() => {
    if (showStatus === EShowStatus.add || showStatus === EShowStatus.edit) {
      if (!showOther) {
        getListData({
          ...getDefaultTableColumns()
        })
      }
      if (showOther && visible) {
        const postData = props.$$form.current.getFieldsValue()[props.$$tableName].values.length && props.$$form.current.getFieldsValue()[props.$$tableName].values[rowIndex]
        if (!postData.fdPost) {
          Message.warning('请选择姓名')
          return
        }
        getListData({
          ...getOtherDefaultTableColumns()
        })
      }
    }
  }, [JSON.stringify(defaultTableCriteria), JSON.stringify(otherData), showOther, visible])


  // 检验默认筛选项是否有值
  const checkFlag = () => {
    let flag = false
    flag = Object.values(defaultTableCriteria).every((i: any) => {
      if (i['searchValue'] && Object.values(i['searchValue']).length) {
        return true
      } else {
        return false
      }
    })
    return flag
  }

  const getListData = async (data) => {
    if (showTableData) {
      if (!data.conditions) {
        setListData([])
        return
      }
      if ((!data.conditions[showTableData]) || (!data.conditions[showTableData]['$contains'])) {
        setListData([])
        return
      }
    }
    try {
      if (!showOther) {
        if (Object.keys(defaultTableCriteria).length && !checkFlag()) {
          if (!defaultSearch) {
            setListData([])
            return
          }
        }
      }
      setSelectedParams(data)
      const res = await apiKey[apiName](data)
      setPage({
        ...page,
        total: res.data.totalSize,
      })
      const newData = res.data.content?.map((i, index) => {
        const item = {
          ...i,
          index: index + 1,
          key: i.fdId
        }
        return item
      })
      setListData(newData)
    } catch (error) {
      Message.error(error.response.data.msg || '请求失败')
    }
  }
  // 表格列定义
  const columns = useMemo(() => {
    const flag = columnsProps.findIndex(i => i.dataIndex === 'index')
    if (flag !== -1) {
      return columnsProps
    } else {
      columnsProps.unshift({ title: '序号', dataIndex: 'index' })
      return columnsProps
    }
  }, [])
  const onSelectChange = (key: React.Key[]) => {
    setSelectedRows(key)
  }

  const handlePage = (pageNo: number, pageSize: number) => {
    getListData({ ...selectParams, ...query, offset: (pageNo - 1) * pageSize, pageSize })
  }


  // 行点击
  const onRowClick = useCallback(
    (record) => {
      return !multiple ? {
        onClick: () => {
          onChange && onChange(record)
          setVisible(false)
          setFdName(record[chooseFdName])
          // @ts-ignore
          onChangeProps && onChangeProps(record, rowIndex)
        }
      } : {}
    },
    [history]
  )
  /** 筛选 */
  const handleCriteriaChange = useCallback(
    (value, values) => {
      let conditions = $reduceCriteria(query, values)
      conditions = renderConditions({ ...selectParams?.conditions, ...conditions }, values, criteriaProps)
      const newParams = { ...selectParams, conditions }
      getListData({
        ...query,
        ...newParams
      })
    },
    [query, selectParams]
  )
  const handleSearch = (value) => {
    const newParams = { ...selectParams, conditions: { ...selectParams?.conditions, 'fdName': { '$contains': value.trim() } } }
    getListData({ ...query, ...newParams })

  }
  // 确定按钮
  const handleOk = useCallback(async () => {
    setVisible(false)
    if (selectedRowsData && selectedRowsData.length) {
      try {
        const res = await apiKey[apiName]({ conditions: { fdId: { '$in': selectedRowsData } } })
        setInitSelectArr(res.data.content)
        onChange && onChange(res.data.content)
      } catch (error) {
        Message.error(error.response?.data?.msg || '请求失败')
      }
    } else {
      setInitSelectArr([])
      onChange && onChange([])
    }
  }, [selectedRowsData])

  // const renderTag = () => {
  //   if (initSelectedArr && initSelectedArr.length) {
  //     return initSelectedArr.map(i => {
  //       return <Tag key={i.fdId}>{i.fdName}</Tag>
  //     })
  //   } else {
  //     return <span style={{ color: '#c3c3c3' }}>请选择</span>
  //   }
  // }

  const handleCloseTag = (e) => {
    e.stopPropagation()
    setFdName('')
    onChange?.(undefined)
  }

  const handleCloseMutilTag = (e, val) => {
    e.stopPropagation()
    const newData = initSelectedArr.filter(i => i.fdId !== val.fdId)
    setInitSelectArr(newData)
    onChange?.(newData)
  }

  const renderTag = () => {
    if (initSelectedArr && initSelectedArr.length) {
      return initSelectedArr.map(i => {
        return <Tag key={i.fdId} closable onClose={(e) => handleCloseMutilTag(e, i)} className={'modal-tag'}>{i.fdName}</Tag>
      })
    } else {
      return (
        <React.Fragment>
          {fdName ? <Tag closable onClose={handleCloseTag} className={'modal-tag'}>{fdName}</Tag> : null}
        </React.Fragment>
      )
    }
  }
  const handleCancel = () => {
    setVisible(false)
    if (multiple) {
      setSelectedRows(initSelectedArr?.length ? initSelectedArr.map(i => i.fdId) : [])
      // onChange && onChange(initSelectedArr)
    }
  }

  const handleStaffSearch = (value) => {
    const newParams = { ...selectParams, conditions: { ...selectParams?.conditions, 'fdName': { '$contains': value.trim() } } }
    getListData({ ...query, ...newParams })
  }

  const rowSelection: any = multiple ? {
    fixed: 'left',
    selectedRowKeys: selectedRowsData,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true
  } : false

  const readOnlyStyle = {
    'background': '#f5f5f5',
    'color': 'rgba(0,0,0,.25)',
    'cursor': 'not-allowed',
    'pointerEvents': 'none'
  } as any
  return (
    <React.Fragment>
      <div>
        {/* {
          showStatus === 'edit' || showStatus === 'add' || showStatus === 'readOnly' ? (multiple && initValue?.length) ? (
            <div className='multiple-input' style={showStatus === 'readOnly' ? readOnlyStyle : {}} onClick={() => setVisible(true)}>
              {renderTag()}
            </div>
          ) : (
            <Input placeholder='请输入' readOnly disabled={showStatus === 'readOnly'} onClick={() => setVisible(true)} value={fdName} />
          ) : (
            <span>
              {
                Array.isArray(initValue) ? initValue.map(item => item.fdName).join(',') : initValue && initValue[chooseFdName]
              }
            </span>
          )
        } */}
        {
          showStatus === 'edit' || showStatus === 'add' || showStatus === 'readOnly' ? (
            <div className='multiple-input' style={showStatus === 'readOnly' ? readOnlyStyle : {}} onClick={() => setVisible(true)}>
              {renderTag()}
            </div>
          ) : (
            <span>
              {
                Array.isArray(initValue) ? initValue.map(item => item.fdName).join(',') : initValue && initValue[chooseFdName]
              }
            </span>
          )
        }
      </div>
      <Modal
        visible={visible}
        destroyOnClose={true}
        title={modalTitle}
        mask={true}
        width={'1100px'}
        className='record-modal'
        cancelText='取消'
        onCancel={() => handleCancel()}
        onOk={() => handleOk()}
        footer={showFooter ? undefined : null}
      >
        <div className="lui-template-list-table">
          {
            mark || isSupplier ? (<div className='lui-template-list-table-search'><span className='lui-template-list-table-search-title'>{mark ? '项目名称' : isSupplier ? '供应商名称' : ''}:</span><Input.Search onSearch={handleSearch} allowClear /></div>) : null
          }
          {
            isProjectNature ? (<div className='lui-template-list-table-search'><span className='lui-template-list-table-search-title'>姓名:</span><Input.Search onSearch={handleStaffSearch} allowClear /></div>) : null
          }
          {
            showCriteria ? (
              <Criteria key="criteria" expandable={true} onChange={handleCriteriaChange}>
                {
                  criteriaKey ? criertiaObj[criteriaKey] : null
                }
              </Criteria>
            ) : null
          }

          <Table
            dataSource={listData}
            columns={columns}
            onRow={onRowClick}
            rowSelection={rowSelection}
            pagination={{
              position: ['bottomCenter'],
              total: page.total,
              pageSize: page.pageSize,
              showSizeChanger: false,
              onChange: handlePage
            }}
          />
        </div>
      </Modal>
    </React.Fragment >
  )
}

export default XformModal
