import React, { useEffect, useState } from 'react'
import { OrderedListOutlined, CaretUpOutlined, CaretDownOutlined, SyncOutlined } from '@ant-design/icons'
import '../../index.css'
import axios from 'axios'
/** constants */
import { response } from '../constants'
/** components */
import ExternalQuestionList from './externalQuestionList'

const ContentRight = ({ data }) => {
  const [open, setOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [activeSkill, setActiveSkill] = useState('')
  const [activeQs, setActiveQs] = useState<any>(1)
  const [skillMap, setSkillMap] = useState<any>([])
  const [questionsMap, setQuestionsMap] = useState([])
  // Add a state to hold selected skill IDs
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null)
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null)
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number | null>(null)
  const [othersParams, setOthersParams] = useState<any>(null)


  const getInitData = async () => {
    // 请求接口数据
    const { skillPoint, initTopic } = data
    // 设置技能点数据
    // @ts-ignore
    setSkillMap(skillPoint.map((skill: any) => ({
      key: skill,
      label: skill,
    })))

    setActiveSkill(skillMap[0]?.key)

    // 设置问题数据
    setQuestionsMap(
      // @ts-ignore
      initTopic.data.map((topic: any) => ({
        skill: topic.skill,
        data: topic.data.map((qs: any) => ({
          key: qs.id,
          question: qs.questions,
          answer: qs.answer,
        })),
      }))
    )

    // Set the initial value of activeSkill to the key of the first skill
    setActiveSkill(skillMap.length > 0 ? skillMap[0].key : '')

  }

  const onChangeOpen = () => {
    const curOpen = open
    setOpen(!curOpen)
  }
  const onChangeChatOpen = () => {
    const curOpen = chatOpen
    setOpen(false)
    setChatOpen(!curOpen)
  }
  const fetchData = async () => {
    try {
      const res = await axios.get(
        '/data/cms-out-manage/cmsOutWorkbench/convent'
      )
      const { skillPoint, initTopic } = res?.data || response

      // 设置技能点数据
      setSkillMap(
        skillPoint.map((skill: any) => ({
          key: skill,
          label: skill,
        }))
      )

      // 设置问题数据
      setQuestionsMap(
        initTopic.data.map((topic: any) => ({
          skill: topic.skill,
          data: topic.data.map((qs: any) => ({
            key: qs.id,
            question: qs.questions,
            answer: qs.answer,
          })),
        }))
      )

      // 在获取数据之后设置activeSkill的初始值为第一个技能的键
      setActiveSkill(skillMap.length > 0 ? skillMap[0].key : '')
    } catch (error) {
      console.error('获取数据时出错:', error)
      const { skillPoint, initTopic } = response

      // 设置技能点数据
      setSkillMap(
        skillPoint.map((skill: any) => ({
          key: skill,
          label: skill,
        }))
      )

      // 设置问题数据
      setQuestionsMap(
        // @ts-ignore
        initTopic.data.map((topic: any) => ({
          skill: topic.skill,
          data: topic.data.map((qs: any) => ({
            key: qs.id,
            question: qs.questions,
            answer: qs.answer,
          })),
        }))
      )

      // 在获取数据之后设置activeSkill的初始值为第一个技能的键
      setActiveSkill(skillMap.length > 0 ? skillMap[0].key : '')
    }
  }

  // 每当activeSkill更改时获取数据
  useEffect(() => {
    fetchData()
  }, [])

  const onChangeSkill = (key: any) => {
    setActiveSkill(key)
    // Update the selectedSkillIds array
    // @ts-ignore
    setSelectedSkillIds((prevSelectedSkillIds: any) => {
      // @ts-ignore
      if (prevSelectedSkillIds.length > 0 && !prevSelectedSkillIds?.includes(key)) {
        return [...prevSelectedSkillIds, key]
      } else {
        return prevSelectedSkillIds
      }
    })

    setSelectedSkillIndex(key)
    setExpandedQuestionIndex(null)

    // If the selected skill is 'others', manually add its ID
    if (key === 'others') {
      // @ts-ignore
      setSelectedSkillIds((prevSelectedSkillIds: any) => {
        if (prevSelectedSkillIds.length > 0 && !prevSelectedSkillIds?.includes('其他')) {
          return [...prevSelectedSkillIds, '其他']
        } else {
          return prevSelectedSkillIds
        }
      })
    }
  }

  const onChangeQs = (qs: any, key: number) => {
    setSelectedQuestionIndex(key - 1)
    // If the selected skill is 'others', expand the question by setting the expanded index
    if (activeSkill === 'others') {
      setExpandedQuestionIndex(key - 1)
    }

    // Update the selectedSkillIds array using an object for better management
    // @ts-ignore
    setSelectedSkillIds((prevSelectedSkillIds: any) => {
      const selectedSkillId: any = activeSkill === 'others' ? '其他' : activeSkill
      const selectedQuestionId = qs.data[key - 1].key
      const updatedSkillIds: any = { ...prevSelectedSkillIds }
      if (!updatedSkillIds[selectedSkillId]) {
        updatedSkillIds[selectedSkillId] = []
      }
      // Check if the ID is already in the array
      const isIdSelected = updatedSkillIds[selectedSkillId].includes(selectedQuestionId)
      // Only add the ID if it's not already in the array
      if (!isIdSelected) {
        updatedSkillIds[selectedSkillId].push(selectedQuestionId)
      }

      return updatedSkillIds
    })
  }

  /**
   * 换一批
   */
  const onChangeRefresh = async () => {
    try {
      let requestData: any

      if (activeSkill !== 'others') {
        requestData = {
          data: Object.entries(selectedSkillIds).map(([skill, questionIds]) => {
            const selectedQuestions = questionsMap
              .filter((qs: any) => qs.skill === skill)
              .flatMap((qs: any) =>
                qs.data.filter((item: any) => questionIds.includes(item.key))
              )

            if (selectedQuestions.length > 0) {
              return {
                skill: skill === '其他' ? 'others' : skill,
                weight: skill === '其他' ? 100 : 100,
                id: selectedQuestions.map((item: any) => item.key),
              }
            } else {
              return null
            }
          }).filter(Boolean),
        }
      } else {
        requestData = othersParams
      }

      console.log('requestData:换一批接口数据====', requestData)

      const res = await axios.post(
        '/data/cms-out-manage/cmsOutWorkbench/topic/getNewTopic',
        requestData
      )

      const { initTopic } = res?.data
      setQuestionsMap(
        initTopic.data.map((topic: any) => ({
          skill: topic.skill,
          data: topic.data.map((qs: any) => ({
            key: qs.id,
            question: qs.questions,
            answer: qs.answer,
          })),
        }))
      )

      // Reset activeQs to 1
      // Handle isAllDone property
      if (initTopic.isAllDone) {
        // If isAllDone is true, reset the selectedSkillIds
        setSelectedSkillIds([])
      }
      setActiveQs(1)
    } catch (error) {
      console.error('刷新数据时出错:', error)
    }
  }

  // 新增函数处理技能栈权重和记录已点击问题
  const onSkillWeightChange = (params: any) => {
    // console.log("contentRight-", params)
    // console.log("activeSkill", activeSkill) // others
    setOthersParams(params)
  }


  useEffect(() => {
    if (data) {
      getInitData()
    }
  }, [data])

  // Set the initial value of activeSkill to the key of the first skill
  useEffect(() => {
    setActiveSkill(skillMap.length > 0 ? skillMap[0].key : '')
  }, [skillMap])

  return (

    <div className='content-right'>
      <div className='content-right-questions'
        style={{
          height: open ? 'calc(100vh - 342px)' : '72px',
          overflow: open ? 'hidden' : 'hidden'
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
            {open ? <CaretDownOutlined /> : <CaretUpOutlined />}
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
          <div className={activeSkill === 'others' ? 'skill-item-actvie' : 'skill-item-other'} onClick={() => onChangeSkill('others')}>
            <span>其他</span>
          </div>
        </div>
        <div className='content-list'>
          {/* 渲染内部问题列表 */}
          {questionsMap
            .filter((qs: any) => qs.skill === activeSkill) // 根据 activeSkill 进行筛选
            .map((qs: any, index: number) => {
              return (
                <div className={'qs-item'} key={qs.skill}>
                  {qs.data.map((item: any, itemIndex: number) => {
                    const isAnswerVisible = selectedQuestionIndex === itemIndex
                    return (
                      <div
                        className={index + 1 === activeQs ? 'qs-item-active' : 'qs-item'}
                        onClick={() => onChangeQs(qs, itemIndex + 1)}
                        key={item.key}
                      >
                        <div className='qs-item-question'>
                          <span>{(itemIndex + 1) + '.' + item.question}</span>
                        </div>
                        <div className={`qs-item-answer ${isAnswerVisible ? 'answer-visible' : ''}`}>
                          <span>{item.answer}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          {/* 渲染外部问题列表 */}
          {activeSkill === 'others' && <ExternalQuestionList onParametersChange={onSkillWeightChange} />}
        </div>
        <div className='content-reset' onClick={onChangeRefresh}>
          <span className='content-reset-icon'>
            <SyncOutlined />
          </span>
          <span className='content-reset-text'>换一批</span>
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
          <iframe className='chatBotIframe' src="http://ai.cmstest.com/llm/chatbot#/pureChat" frameBorder="0"
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
