import React, { useState } from 'react'
import { OrderedListOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import '../../interviewAI/content.scss'
import Refresh from '../../img/Refresh.png'

const ContentRight = () => {
  const [open, setOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
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

  const onChangeOpen = () => {
    const curOpen = open
    setChatOpen(false)
    setOpen(!curOpen)
  }

  const onChangeChatOpen = () => {
    const curOpen = chatOpen
    setOpen(false)
    setChatOpen(!curOpen)
  }

  const onChangeSkill = (key: string) => {
    setActiveSkill(key)
  }

  const onChangeQs = (key: number) => {
    setActiveQs(key)
  }

  const oclRefresh = () => {
    console.log('刷新')
  }

  return (

    <div className='content-right'>
      <div className='content-right-questions'
        style={{
          height: open ? 'calc(100vh - 342px)' : '72px',
          overflow: open ? 'hidden' : 'hidden'
        }}>
        <div className='content-header'>
          <div className='header-icon'></div>
          <div className='header-title'>智能题库</div>
          <div className='header-sub'>个性化推荐面试题</div>
          <div className='header-open' onClick={onChangeOpen}>
            {
              open ? <div><span>收起&nbsp;</span><CaretDownOutlined /></div> :
                <div><span>展开&nbsp;</span><CaretUpOutlined /></div>
            }
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
        <div>
          <div className='refresh' onClick={oclRefresh}>
            <img src={Refresh} className='refreshImage' />
            换一批
          </div>
        </div>

      </div>
      <div className='content-right-chatBot'
        style={{
          height: chatOpen ? 'calc(114vh - 342px)' : '200px',
          overflow: chatOpen ? 'hidden' : 'hidden'
        }}
      >
        <div className='chatBot-header'>
          <div className='chatBot-icon'></div>
          <div className='chatBot-title'>ChatBot</div>
          <div className='chatBot-sub'>与AI交流面试问题</div>
          <div className='chatBot-open' onClick={onChangeChatOpen}>
            {
              chatOpen ? <div><span>收起&nbsp;</span><CaretDownOutlined /></div> :
                <div><span>展开&nbsp;</span><CaretUpOutlined /></div>
            }
          </div>
        </div>
        <div>
          <iframe className='chatBotIframe' src="https://www.runoob.com" frameBorder="0"
            style={{
              height: chatOpen ? 'calc(104vh - 347px)' : '106px',
              overflow: chatOpen ? 'hidden' : 'hidden'
            }}
          >
          </iframe>
        </div>

      </div>
    </div>

  )
}

export default ContentRight