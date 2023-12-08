import React from 'react'
import { UserOutlined, ScheduleFilled } from '@ant-design/icons'
import { Button, Avatar } from 'antd'
import '../../interviewAI/content.css'
import TimelineDemo from './timeline'

const ContentLeft = () => {
  const infoMap = [
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

  const skillMap = [
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
          <Avatar shape="square" size={100} icon={<UserOutlined />} />
        </section>
        <section className='info-main'>
          <div className='info-main-title'>
            <span className='main-title'>王小军</span>
            <span className='sub-title'>高级JAVA开发工程师</span>
          </div>
          <div className='info-main-detail'>
            {
              infoMap.map((info: any) => {
                return (
                  <div className='detail-item' key={info.key}>
                    <span className='info-label'>{info.label + '：'}</span>
                    <span className='info-value'>{info.value + '：'}</span>
                  </div>
                )
              })
            }
          </div>
        </section>
        <div className='info-btn'>
          <Button className='btn'>在线简历</Button>
        </div>
      </div>
      <div className='content-left-skills'>
        <section className='content-title'>
          <div className='title-icon'>
            <ScheduleFilled />
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
            <ScheduleFilled />
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