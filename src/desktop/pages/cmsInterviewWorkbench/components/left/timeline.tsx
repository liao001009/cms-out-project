/* eslint-disable react/display-name */
import { Timeline, Radio } from '@lui/core'
import React, { useState } from 'react'
// import './demo.scss'


const TimelineDemo = () => {
  const [mode, setMode] = useState<'left' | 'alternate' | 'right'>('left')
  const onChange = (e) => {
    setMode(e.target.value)
  }
  const renderItem = () => {

    // const res =  dataResource.map((resource) => {
    //     return {
    //         key: resource.id,
    //         content： [
    //             XXXX
    //         ],

    //     }
    // })

    const timeArray = [
      {
        key: '1',
        content: (
          <div>
            【工作内容】 1、在软件项目经理的领导下，配合完成程序设计和开发 2、按产品需求进行软件设计和编码实现，确保安全、质量和性能 3、参与内部测试、部署、实施等工作 4、分析并解决软件开发过程中的问题
          </div>
        ),
        title: (
          <div>华为技术有限公司</div>
        )
      },
      {
        key: '2',
        content: (
          <div>
            【工作内容】 1、在软件项目经理的领导下，配合完成程序设计和开发 2、按产品需求进行软件设计和编码实现，确保安全、质量和性能 3、参与内部测试、部署、实施等工作 4、分析并解决软件开发过程中的问题
          </div>
        ),
        title: (
          <div>深圳市腾讯计算机系统有限公司</div>
        )
      },
    ]

    return timeArray.map((item) => {
      return (
        // eslint-disable-next-line react/jsx-key
        <Timeline.Item
          //   key={item}
          //   color={item === '15:00' ? 'primary' : 'gray'}
          timing={`2022-10-26 ${item}`}
          title={item?.title}
          description={item?.content}
        />
      )
    })
  }
  return (
    <div className="demo-timeline">
      <Timeline mode={mode}>{renderItem()}</Timeline>
    </div>
  )
}

export default TimelineDemo