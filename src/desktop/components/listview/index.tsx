import React, { useCallback, useEffect, useState } from 'react'
import Table, { useTable } from '@elem/mk-table'
import { Pagination } from '@lui/core'
import './index.scss'

export interface IProps {
  /** 请求体 */
  apiRequest: any
  /**请求参数 */
  params? : any
  /** 表格列定义 */
  columns : any
  /**点击行跳转路径 */
  onRowUrl? : string 
}

const baseCls = 'lui-template-list'

const ContractListView: React.FC<IProps> = (props) => {
  const { apiRequest, params, columns, onRowUrl } = props
  const [listParam, setListParam] = useState<any>({
    ...params,
    // sorts: { fdCreateTime: 'desc' }
  })
  const [listData, setListData] = useState<any>({})
  const [tableStatus, setTableStatus] = useState<boolean>(false)

  const { totalSize, pageSize } = listData

  useEffect(() => {
    getDataInfo(listParam)
  }, [])

  
  // 表格hook
  const { tableProps } = useTable({
    // 数据源
    // data: content,
    // 数据源
    data: (listData?.content || []).map((d, i) =>
      Object.assign({}, d, { fdIndex: i })
    ),
    // 显示序号列
    serial: false,
    // 列定义
    columns,
    // 支持行选择
    rowSelection: false,
    // 表格搜索，含筛选、排序
    onChange: (newQuery) => {
      const params = {
        ...listParam,
        sorts: newQuery['sorts']
      }
      setListParam(params)
      getDataInfo(params)
    }
  })


  const getDataInfo = async (listParam) => {
    setTableStatus(true)
    try {
      const res = await apiRequest(listParam)
      setTableStatus(false)
      if (res && res?.success) {
        setListData(res?.data || {})
      }
    } catch (error) {
      setTableStatus(false)
    }
  }

  /** 分页操作 */
  const handlePage = (pageNo, pageSize) => {
    const offset = (pageNo - 1) * pageSize
    const params = {
      ...listParam,
      offset, pageSize, pageNo
    }
    setListParam(params)
    setListData(params)
  }

  const onRowClick = useCallback(
    (record) => {
      return {
        onClick: () => {
          if(onRowUrl){
            window.open(mk.getSysConfig('modulesUrlPrefix')+`${onRowUrl}${record.fdId}`,'_blank')
          }
          //暂时不知道跳转那里
          //history.goto(`/cmsContractInfo/view/${record.fdId}`)
          // mk.openLink({collectParam:{url:mk.getSysConfig('modulesUrlPrefix')+`${onRowUrl}${record.fdId}`, target: '_blank', title: title }})
        }
      }
    },
    [history]
  )

  return (
    <React.Fragment>
      <div className={`${baseCls}`}>
        <div className={`${baseCls}-table`}>
          <Table loading={tableStatus} {...tableProps} onRow={onRowClick} />
        </div>
        <div className={`${baseCls}-page`}>
          {totalSize ? (
            <Pagination
              showQuickJumper
              showSizeChanger
              refresh={true}
              total={totalSize}
              pageSize={pageSize}
              onChange={handlePage}
              onRefresh={()=>{getDataInfo(listParam)}}
            />
          ) : null}
        </div>
      </div>
    </React.Fragment>
  )
}
export default ContractListView