//import { UserOutlined, ScheduleFilled } from '@ant-design/icons'
import { Button, Avatar } from 'antd'
import '../../interviewAI/content.scss'
import TimelineDemo from './timeline'
import React, { useState } from 'react'
// import Icon from '@lui/icons'
import OnlineResume from '../../img/OnlineResume.png'
import data from './getDatas'

const ContentLeft = () => {

  const keyLists = Object.keys(data.personMessage)
  const valueLists = Object.values(data.personMessage)
  let name
  let post
  // const [name, setName] = useState('')
  // const [post, setPost] = useState('')

  const infoMap = keyLists.map((key, i) => {
    return {
      key: i,
      label: key,
      value: ''
    }
  })
  valueLists.map((value, i) => {
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

  const skillMap = data.skillPoint.map((str,i) => {
    return {
      key:i,
      label:str
    }
  })

  const infoMaps = [
    {
      key: 'age',
      label: '年龄',
      value: '31岁'
    },
    {
      key: 'workYears',
      label: '工龄',
      value: '8年'
    },
    {
      key: 'education',
      label: '学历',
      value: '本科'
    },
    {
      key: 'phone',
      label: '电话',
      value: '18612345678'
    },
    {
      key: 'email',
      label: '邮箱',
      value: '18612345678@qq.com'
    },
  ]

  const skillMaps = [
    {
      key: 'java',
      label: 'Java'
    },
    {
      key: 'spring',
      label: 'Spring'
    },
    {
      key: 'sql',
      label: 'SQL'
    },
    {
      key: 'batis',
      label: 'My Batis'
    },
  ]

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
        <div className='info-btn'>
          <Button className='btn'>
            <img src={OnlineResume} style={{ padding: '0px 6px 1px 0px' }} />
            在线简历
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
          <TimelineDemo />
        </section>
      </div>
    </div>

  )
}

export default ContentLeft