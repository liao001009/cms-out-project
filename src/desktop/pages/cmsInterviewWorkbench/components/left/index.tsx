//import { UserOutlined, ScheduleFilled } from '@ant-design/icons'
import { Button, Avatar } from 'antd'
import '../../interviewAI/content.scss'
import TimelineDemo from './timeline'
import React, { useEffect, useState } from 'react'
// import Icon from '@lui/icons'
import OnlineResume from '/static/cms-out-images/OnlineResume.png'
// import {demo} from '../getDatas'
import _ from 'lodash'

const ContentLeft = (data) => {
  const [keyLists, setKeyLists] = useState<any[]>([])
  const [valueLists, setValueLists] = useState<any[]>([])
  const [skillMap, setSkillMap] = useState<any[]>([])
  const [workExperience, setWorkExperience] = useState<any>()

  const getInitData = async () => {
    console.log('左边数据personMessage======', data.data.personMessage)
    setKeyLists(Object.keys(data.data.personMessage))
    setValueLists(Object.values(data.data.personMessage))

    console.log('左边数据skillPoint======', data.data.skillPoint)
    const skill = data.data.skillPoint.map((str, i) => {
      return {
        key: i,
        label: str
      }
    })
    setSkillMap(skill)

    console.log('左边数据workExperience======', data.data.workExperience)
    setWorkExperience(data.data.workExperience)
  }
  let name
  let post

  const infoMap = keyLists.map((key, i) => {
    return {
      key: i,
      label: key,
      value: ''
    }
  })
  valueLists.map((value: any, i) => {
    infoMap.forEach((obj) => {
      if (i === obj.key) {
        obj!.value = value
      }
    })
  })

  for (let i = 0; i < infoMap.length; i++) {
    if (infoMap[i].label === '名字') {
      name = infoMap[i].value
      infoMap.splice(i, 1)
    }
    if (infoMap[i].label === '岗位') {
      post = infoMap[i].value
      infoMap.splice(i, 1)
    }
  }
  console.log('个人信息======', infoMap)

  useEffect(() => {
    if (data.data) {
      console.log('左边数据======', data.data)
      getInitData()
    }
  }, [data.data])

  return (
    <div className='content-left'>
      <div className='content-left-info'>
        <section className='info-left'>
          {/* <Avatar shape="square" size={100} icon={<UserOutlined />} /> */}
        </section>
        <section className='info-main'>
          <div className='info-main-title'>
            <span className='main-title'>{name}</span>
            <span className='sub-title'>{post}</span>
          </div>
          <div className='info-main-detail'>
            {
              infoMap.map((info: any) => {
                return (
                  <div className='detail-item' key={info.key}>
                    <span className='info-label'>{info.label + '：'}</span>
                    <span className='info-value'>{info.value + ''}</span>
                  </div>
                )
              })
            }
          </div>
        </section>
        <div className='info-btn' style={{display: 'none'}}>
          <Button className='btn'>
            <div>
              <img src={OnlineResume} style={{ float: 'left', padding: '3px 6px 0px 14px' }} />
            </div>
            <span style={{float: 'left'}}>在线简历</span>
          </Button>
        </div>
      </div>
      <div className='content-left-skills'>
        <section className='content-title'>
          <div className='title-icon'>
          </div>
          <div className='title-content'>
            <span>个人技术栈</span>
          </div>
        </section>
        <section className='skills-content'>
          {
            skillMap.map((skill: any) => {
              return (
                <div className='skill-item' key={skill.key}>
                  <span className='skill-label'>{skill.label}</span>
                </div>
              )
            })
          }
        </section>
      </div>
      <div className='content-left-history'>
        <section className='content-title'>
          <div className='title-icon'>
          </div>
          <div className='title-content'>
            <span>工作经历</span>
          </div>
        </section>
        <section className='history-content'>
          <TimelineDemo data={workExperience} />
        </section>
      </div>
    </div>

  )
}

export default ContentLeft