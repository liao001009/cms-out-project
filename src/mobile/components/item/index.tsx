// 列表项组件
import React, { useMemo } from 'react'
import './style.scss'

export interface IItemColumn {
  // 字段名
  dataIndex: string
  // 字段名
  title: string
  // 字段类型
  //  'subject'(标题) | 'infos'(摘要信息) | 'status'(状态戳)
  type?: string
  // 字段渲染方式
  render: (value) => React.ReactNode | string
}

export interface IProps {
  /** 数据项定义 */
  columns: Array<IItemColumn>
  /** 数据值 */
  data: any
  /** 点击回调 */
  onRowClick?: (data: any) => void
}

const baseClass = 'mui-item-default'
const Item: React.FC<IProps> = props => {
  const { columns, data, onRowClick } = props
  const [subject, status, infos] = useMemo(() => {
    let subject = ''
    let status = ''
    const infos: any[] = []
    columns.forEach((column) => {
      const type = column.type || 'infos'
      switch (type) {
        case 'subject':
          subject = column.render(data[column.dataIndex]) as string
          break
        case 'status':
          status = column.render(data[column.dataIndex]) as string
          break
        case 'infos':
          infos.push(column)
      }
    })
    return [subject, status, infos]
  }, [data, columns])

  return (
    <div className={baseClass} onClick={(event) => {
      event.stopPropagation()
      onRowClick && onRowClick(data)
    }}>
      <div className={`${baseClass}-subject`}>
        {subject}
      </div>
      <div className={`${baseClass}-content`}>
        {/* TODO 状态戳显示 */}
        {/* <div className={`${baseClass}-status`}>
          {status}
        </div> */}
        {
          infos && infos.length && (
            <div className={`${baseClass}-infos`}>
              {
                infos.map(info => (
                  <div key={info.dataIndex} className={`${baseClass}-infos-item`}>
                    <span className={`${baseClass}-infos-item-label`}>
                      {info.title}
                    </span>
                    <span className={`${baseClass}-infos-item-value`}>
                      {info.render(data[info.dataIndex])}
                    </span>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Item
