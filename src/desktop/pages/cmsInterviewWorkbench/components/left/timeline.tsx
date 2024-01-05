/* eslint-disable react/display-name */
import { Timeline, Radio } from '@lui/core'
import React, { useEffect, useState } from 'react'
import _ from 'lodash'
// import './demo.scss'
// import { demo } from '../getDatas'

const TimelineDemo = ({ data }) => {

  const [timeArray, setTimeArray] = useState<any>()

  const getInitData = async () => {
    data.forEach((item) => {
      item.工作内容.splice(0, 0, '【工作内容】')
    })
    const timeArray = data.map((arr, i) => {
      return {
        key: i,
        company: arr.公司名字,
        workPost: arr.工作岗位,
        workTime: arr.工作时间,
        title: (
          <div className='history-title'>
            <span className='history-title-h1' >{arr.公司名字}</span>丨
            <span className='history-title-h2' >{arr.工作岗位}</span>丨
            <span className='history-title-h3' >{arr.工作时间}</span>
          </div>
        ),
        content: (
          arr.工作内容.map((cont: any, i) => {
            return (
              <div className='history-content' key={i}>{cont}</div>
            )
          }))
      }
    })
    console.log('timeArray=====', timeArray)
    setTimeArray(timeArray)

  }
  const [mode, setMode] = useState<'left' | 'alternate' | 'right'>('left')
  const onChange = (e) => {
    setMode(e.target.value)
  }
  const renderItem = () => {
    if (!_.isEmpty(timeArray)) {
      return timeArray.map((item) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <Timeline.Item
            key={item.key}
            //   color={item === '15:00' ? 'primary' : 'gray'}
            timing={item.title}
            //title={item.company}
            description={item.content}
          />
        )
      })
    }
  }
  useEffect(() => {
    if (data) {
      console.log('工作经历=====', data)
      getInitData()
    }
  }, [data])
  return (
    <div className="demo-timeline">
      <Timeline mode={mode}>{renderItem()}</Timeline>
    </div>
  )
}

export default TimelineDemo