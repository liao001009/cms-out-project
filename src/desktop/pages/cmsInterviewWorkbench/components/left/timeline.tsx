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
            <div>1.</div>
            <div>2.</div>
            <div>3.</div>
            <div>4.</div>
          </div>
        ),
        title: (
          <div>HUA WEI</div>
        )
      },   
      {
        key: '2',
        content: (
          <div>
            <div>1.</div>
            <div>2.</div>
            <div>3.</div>
            <div>4.</div>
          </div>
        ),
        title: (
          <div>HUA WEI</div>
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
          title={ item?.title}
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