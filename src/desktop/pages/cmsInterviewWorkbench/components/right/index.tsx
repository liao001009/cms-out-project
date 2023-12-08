import React, { useState } from 'react'
import { OrderedListOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import '../../interviewAI/content.css'

const ContentRight = () => {
  const [open, setOpen] = useState(true)
  const [activeSkill, setActiveSkill] = useState('java')
  const [activeQs, setActiveQs] = useState(1)

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

  const questionsMap = [
    {
      key: 'qs1',
      question: '这是一条关于Java的技术性面试问题，问题描述文案内容有可能很长，当一行展示不下时自动换行展示。',
      answer: '这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。'
    },
    {
      key: 'qs2',
      question: '这是一条关于Java的技术性面试问题，问题描述文案内容有可能很长，当一行展示不下时自动换行展示。',
      answer: '这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。'
    },
    {
      key: 'qs3',
      question: '这是一条关于Java的技术性面试问题，问题描述文案内容有可能很长，当一行展示不下时自动换行展示。',
      answer: '这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。'
    },
    {
      key: 'qs4',
      question: '这是一条关于Java的技术性面试问题，问题描述文案内容有可能很长，当一行展示不下时自动换行展示。',
      answer: '这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。'
    },
    {
      key: 'qs5',
      question: '这是一条关于Java的技术性面试问题，问题描述文案内容有可能很长，当一行展示不下时自动换行展示。',
      answer: '这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。'
    },
    {
      key: 'qs6',
      question: '这是一条关于Java的技术性面试问题，问题描述文案内容有可能很长，当一行展示不下时自动换行展示。',
      answer: '这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。'
    },
    {
      key: 'qs7',
      question: '这是一条关于Java的技术性面试问题，问题描述文案内容有可能很长，当一行展示不下时自动换行展示。',
      answer: '这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。这里是一段对于上面问题的答案内容，内容有可能很长很长很长，一行展示不下时自动换行展示。'
    },
  ]

  const onChangeOpen= () => {
    const curOpen = open
    setOpen(!curOpen)
  }

  const onChangeSkill = (key: string) => {
    setActiveSkill(key)
  }

  const onChangeQs= (key: number) => {
    setActiveQs(key)
  }

  return (

    <div className='content-right'>
      <div className='content-right-questions' 
        style={{ 
          height: open ? 'calc(100vh - 342px)' : '20px',
          overflow: open ? 'auto' : 'hidden' 
        }}>
        <div className='content-header'>
          <div className='header-icon'>
            <OrderedListOutlined />
          </div>
          <div className='header-title'>
              智能题库
          </div>
          <div className='header-sub'>
              个性化推荐面试题
          </div>
          <div className='header-open' onClick={onChangeOpen}>
            <span>收起</span>
            { open ? <CaretDownOutlined /> : <CaretUpOutlined /> }
          </div>
        </div>
        <div className='content-tabs'>
          {
            skillMap.map((skill: any) => {
              return (
                <div 
                  className={ 
                    activeSkill === skill.key 
                      ? 'skill-item-actvie' 
                      : 'skill-item' 
                  } 
                  key={skill.key}
                  onClick={() => onChangeSkill(skill.key)}
                >
                  <span>{skill.label}</span>
                </div>
              )
            })
          }
          <div className='skill-item-other'>
            <span>其他</span>
          </div>
        </div>
        <div className='content-list'>
          {questionsMap.map((qs: any, index: number) => {
            return (
            // @ts-ignore
            // eslint-disable-next-line react/jsx-key
              <div 
                className={ 
                  index + 1 === activeQs ? 'qs-item-active' : 'qs-item' 
                }
                onClick={() => onChangeQs(index + 1)}
              >
                <div className='qs-item-question'>
                  <span>{(index + 1) + '.' + qs.question}</span>
                </div>
                <div className='qs-item-answer'>
                  <span>{qs.answer}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='content-right-chatBot'>
        <div className='content-icon'></div>
        <div className='content-title'>chatBot</div>
      </div>
    </div>
    
  )
}

export default ContentRight