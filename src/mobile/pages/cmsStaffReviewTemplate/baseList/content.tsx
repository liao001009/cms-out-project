import React, { useCallback, useState } from 'react'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { InfiniteScroll, Radio } from '@mui/core'
import { ToolBarButton, BottomContainer } from '@mui/core'
import List, { useDataSource } from '@/mobile/components/list'
import './index.scss'

export interface IProps extends IContentViewProps {
  callback: Function
}

const Content: React.FC<IProps> = (props) => {
  const { status, data, queryChange, query, callback } = props
  const { content, totalSize, pageSize, offset } = data

  const { data: allData } = useDataSource({ data: content })
  const [selectedRow, setSelectedRow] = useState<string>()

  // 确定
  const handleOk = useCallback(
    (event) => {
      event.stopPropagation()
      callback(selectedRow ? selectedRow : undefined)
    },
    [selectedRow]
  )

  return (
    <div className="mui-template-list">
      <div className="mui-template-body" style={{ height: window.innerHeight - 75, overflowY: 'scroll' }}>
        <div className={'mui-template-list-list'}>
          {/* 列表 */}
          <List>
            {allData.map((item, index: number) => (
              <List.Item key={index}>
                <div onClick={() => setSelectedRow(item.fdId)}>
                  <Radio checked={selectedRow === item.fdId} />
                  {item.fdName}
                </div>
              </List.Item>
            ))}
          </List>
          <InfiniteScroll
            hasMore={offset + pageSize <= totalSize && status === 'done'}
            loadMore={async () => {
              return new Promise((resolve) => {
                queryChange({ ...query, pageNo: (offset + pageSize) / pageSize + 1, pageSize })
                resolve()
              })
            }}
          />
        </div>
      </div>
      {/* 操作 */}
      <div className={'mui-template-list-footer'}>
        <BottomContainer>
          <ToolBarButton
            data={[
              {
                type: 'button',
                item: '确定',
                buttonColor: 'primary' as 'primary',
                onClick: handleOk
              }
            ]}
          />
        </BottomContainer>
      </div>
    </div>
  )
}

export default Content
