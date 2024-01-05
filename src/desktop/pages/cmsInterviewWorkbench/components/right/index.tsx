import React, { useEffect, useRef, useState } from 'react'
import { OrderedListOutlined, CaretUpOutlined, CaretDownOutlined, SyncOutlined } from '@ant-design/icons'
import '../../interviewAI/content.scss'
import Refresh from '/static/cms-out-images/Refresh.png'
import axios from 'axios'
/** constants */
// import { response } from '../constants'
/** components */
import ExternalQuestionList from './externalQuestionList'
// import { resultData } from '../constants'
import { Message } from '@lui/core'
// import { onChangeData } from '../right/onChangeDemo'
// import { log } from 'console'

const ContentRight = ({ data }: any) => {
  const [open, setOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [activeSkill, setActiveSkill] = useState('')
  const [activeSkillInfo, setActiveSkillInfo] = useState<any>(null)
  const [activeQs, setActiveQs] = useState<any>(null)
  const [skillMap, setSkillMap] = useState<any>([]) // 普通技术栈列表
  const [othersSkillMap, setOthersSkillMap] = useState<any>([]) // 其他技术栈列表
  const [questionsMap, setQuestionsMap] = useState([]) // 普通技术栈问题列表
  const [othersQuestionMap, setOthersQuestionMap] = useState<any>([]) // 其他技术栈问题列表
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([])
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null)
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null)
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number | null>(null)
  const [othersParams, setOthersParams] = useState<any>(null)
  // 新增一个状态用于保存当前 skill 下的所有 id
  const [allIds, setAllIds] = useState<number[]>([])

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

  const onChangeSkill = (key: any) => {

    setActiveSkill(key)

    // 更新 allIds 数组
    const currentSkillData: any = questionsMap.find((item: any) => item.skill === key)
    if (currentSkillData) {
      const currentIds = currentSkillData?.data.map((item: any) => item.key)
      setAllIds(currentIds)
    }

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

  const onChangeQs = (qs: any, skillIndex: number, itemIndex: number) => {
    const key: any = `${skillIndex}-${itemIndex}`
    console.log('key===', key)
    setExpandedQuestionIndex((prevKey: any) => (prevKey === key ? null : key))
    setActiveQs(key)
  }

  /**
   * 换一批
   */
  const onChangeRefresh = async () => {
    // 没有做权重选择是，初始化othersParams入参
    console.log('othersParams------', othersParams)
    console.log('当前技术栈activeSkill===', activeSkill)
    setActiveQs(null)
    setTimeout(async () => {
      try {
        let requestData: any

        if (activeSkill !== 'others') {
          // 如果不是 "others" 技能，构造 requestData
          requestData = {
            data: [{
              skill: activeSkillInfo.skill,
              id: activeSkillInfo.data.map((item: any) => item.id),
            }]
          }
        } else {
          console.log('othersParams=====', othersParams)
          // if (othersParams === null) {
          //   requestData = {data: othersQs}
          // } else {
          //   requestData = othersParams
          // }
          requestData = {
            data: othersParams
          }
        }

        console.log('getNewTopic===requestData', requestData)
        const res = await axios.post(
          '/data/cms-out-manage/cmsOutWorkbench/topic/getNewTopic',
          requestData
        )
        console.log('getNewTopic===res', res)

        onChangeOnHandleSkills(res?.data.data.data)

        if (activeSkill === 'others') {
          const resData = res?.data.data.data
          onHandleSkills(resData)
          // 在请求完成后，更新 allIds 数组
          const updatedAllIds = resData
            .filter((topic: any) => topic.skill === activeSkill)
            .flatMap((qs: any) => qs.data.map((item: any) => item.id))
          const curIsAllDone = res?.data.data.isAllDone
          // 如果 isAllDone 为 true，则重置 allIds 为 []
          if (curIsAllDone) {
            setAllIds([])
          } else {
            // 否则，合并现有的 allIds 和新获取的 id
            setAllIds((prevAllIds) => [...prevAllIds, ...updatedAllIds])
          }
        } else {
          const resData = res?.data?.data

          onHandleSkills(resData.data)

          const updatedAllIds = Array.isArray(resData)
            ? resData
              .filter((topic: any) => topic.skill === activeSkill)
              .flatMap((qs: any) => qs.data.map((item: any) => item.id))
            : []
          const curIsAllDone = res?.data?.data?.isAllDone
          // 如果 isAllDone 为 true，则重置 allIds 为 []
          if (curIsAllDone) {
            setAllIds([])
          } else {
            // 否则，合并现有的 allIds 和新获取的 id
            setAllIds((prevAllIds) => [...prevAllIds, ...updatedAllIds])
          }
        }
        // Message.success('刷新成功')
      } catch (error) {
        Message.error('刷新失败,请重试')
        console.error('刷新数据时出错:', error)
      }
    }, 1000)
  }

  // 新增函数处理技能栈权重和记录已点击问题
  const onSkillWeightChange = (params: any) => {
    // Ensure that params is an array
    console.log('onSkillWeightChange', params)
    console.log('onSkillWeightChange-othersParams', othersParams)

    if (Array.isArray(params.data)) {
      // If othersParams is not null or undefined, update it based on the previous state
      if (othersParams != null) {
        setOthersParams((prevOthersParams: any) => {
          // Ensure that prevOthersParams is an array
          if (Array.isArray(prevOthersParams)) {
            const updatedParams = [...prevOthersParams]

            console.log('updatedParams', updatedParams)

            params.data.forEach((newSkill: any) => {
              const existingSkillIndex = updatedParams.findIndex(
                (existingSkill) => existingSkill?.skill === newSkill?.skill
              )

              if (existingSkillIndex !== -1) {
                // Update existing skill data
                updatedParams[existingSkillIndex] = {
                  ...updatedParams[existingSkillIndex],
                  ...newSkill,
                }
              } else {
                // Add new skill data
                updatedParams.push(newSkill)
              }
            })

            // This will trigger the useEffect when othersParams changes
            return updatedParams
          }
          // If prevOthersParams is not an array, return the original value
          return prevOthersParams
        })
      } else {
        // If othersParams is null or undefined, directly set the new data as an array
        setOthersParams(params.data)
      }
    }
  }


  useEffect(() => {
    console.log('current-othersParams', othersParams)
  }, [othersParams])

  // 划分出普通技术栈列表和其他技术栈列表，普通技术栈问题列表，和其他技术栈问题列表
  const onHandleSkills = (dataResource: any) => {
    // 所有关于技术栈和技术栈题库
    const initTopic = dataResource?.initTopic
    // 技术栈题库
    const quesList = initTopic?.data
    const others = initTopic?.others

    if (quesList?.length > 0) {
      // 普通技术栈题库
      const commonQs = quesList.filter((item: any) => !item.weight)
      // others技术栈题库
      const othersQs = quesList.filter((item: any) => item.weight)

      setSkillMap(commonQs.map((skill: any) => ({
        id: skill,
        label: skill,
      })))

      const renderCommonMap = commonQs.map((item: any) => ({
        id: item.skill,
        label: item.skill,
      }))

      // 设置技能点数据
      setSkillMap(renderCommonMap)

      // 设置问题数据
      setQuestionsMap(
        // @ts-ignore
        commonQs.map((topic: any) => ({
          skill: topic.skill,
          data: topic.data.map((qs: any) => ({
            id: qs.id,
            questions: qs.questions,
            answer: qs.answer,
          })),
          isAllDone: topic.isAllDone
        }))
      )
      const othersInfo = others.map((skill: any) => ({
        skill,
        weight: 100, // 你可能需要根据实际情况设置weight的值
        isAllDone: false,
        data: []
      }))
      // 将initTopic中的others和data中的其他类型整合到一起
      // @ts-ignore
      const mergedArray = othersInfo.concat(othersQs)
      // 设置其他的问题列表
      setOthersQuestionMap(mergedArray)
      // 在获取数据之后设置activeSkill的初始值为第一个技能的键
      setActiveSkill(skillMap.length > 0 ? skillMap[0].id : '')
    }
  }
  const transformData = (data1: any, data2: any) => {
    const data3 = data2.map((skill2: any) => {
      if (skill2.skill === activeSkill) {
        return {
          ...skill2,
          data: [...data1],
        }
      }
      return skill2
    })
    // console.log('data3===', data3)
    return data3
  }

  const onChangeOnHandleSkills = (changeData: any) => {
    // 所有关于技术栈和技术栈题库
    // 技术栈题库
    // console.log('onChangeData===', changeData)
    const quesList = changeData
    console.log('onChangequesList===', quesList)

    if (quesList?.length > 0) {
      if (activeSkill === 'others') {
        // 设置其他问题数据
        setOthersQuestionMap(
          // @ts-ignore
          quesList.map((topic: any) => ({
            skill: topic.skill,
            data: topic.data.map((qs: any) => ({
              id: qs.id,
              questions: qs.questions,
              answer: qs.answer,
            })),
            isAllDone: topic.isAllDone
          }))
        )
      } else {
        const quesListPT = changeData[0].data
        // const quesListPT =
        //   [
        //     {
        //       'id': 876,
        //       'questions': '在设计应用架构时，你如何权衡使用传统关系型数据库和NoSQL数据库的利弊？',
        //       'answer': '关系型数据库适合需要强一致性和复杂查询的场景，而NoSQL数据库适合需要高可扩展性和灵活数据模型的场景。在权衡时，需要考虑应用的需求、数据结构和性能要求。'
        //     },
        //     {
        //       'id': 881,
        //       'questions': '当设计一个高可用性的应用架构时，你会采用哪些策略和技术来实现？',
        //       'answer': '为实现高可用性，可以采用多个数据中心部署、负载均衡、自动故障转移、容灾备份、监控报警和自动化运维等策略和技术来确保系统在面对故障时能够保持稳定运行。'
        //     }
        //   ]

        const quesListChanged = transformData(quesListPT, questionsMap)
        // console.log('quesListChanged===', quesListChanged)

        // 设置普通问题数据
        setQuestionsMap(
          // @ts-ignore
          quesListChanged.map((topic: any) => ({
            skill: topic.skill,
            data: topic.data.map((qs: any) => ({
              id: qs.id,
              questions: qs.questions,
              answer: qs.answer,
            })),
            isAllDone: topic.isAllDone
          }))
        )
      }
    }
  }

  useEffect(() => {
    if (data) {
      // console.log('右边数据=====', data)
      // 初始化所有题目
      onHandleSkills(data)
    }
  }, [data])

  useEffect(() => {
    setActiveSkill(skillMap.length > 0 ? skillMap[0].id : '')
  }, [skillMap])

  useEffect(() => {
    // 查找对应技能的信息
    const activeSkillInfo = questionsMap.find((item: any) => item.skill === activeSkill)
    setActiveSkillInfo(activeSkillInfo)
  }, [activeSkill])

  // 生产 https://ai.cmschina.com.cn/llm/chatbot#/pureChat
  // 测试 http://ai.cmstest.com/llm/chatbot#/pureChat

  return (
    <div className='content-right'>
      <div className='content-right-questions'
        style={{
          height: open ? 'calc(100vh - 342px)' : '72px',
          overflow: open ? 'hidden' : 'hidden'
        }}>
        <div className='content-all'>
          <div className='content-header'>
            <div className='header-icon'>
            </div>
            <div className='header-title'>
              智能题库
            </div>
            <div className='header-sub'>
              个性化推荐面试题
            </div>
            <div className='header-open' onClick={onChangeOpen}>
              {open ? <div><span>收起&nbsp;</span><CaretDownOutlined /></div> :
                <div><span>展开&nbsp;</span><CaretUpOutlined /></div>}
            </div>
          </div>
          <div className='content-tabs'>
            {
              skillMap.map((skill: any) => {
                return (
                  <div
                    className={
                      activeSkill === skill.id
                        ? 'skill-item-actvie'
                        : 'skill-item'
                    }
                    key={skill.id}
                    onClick={() => onChangeSkill(skill.id)}
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
              .map((qs: any, skillIndex: number) => {
                return (
                  <div className={'qs-item'} key={qs.skill}>
                    {qs.data.map((item: any, itemIndex: number) => {
                      const key: any = `${skillIndex}-${itemIndex}`
                      const isAnswerVisible = expandedQuestionIndex === key
                      return (
                        <div
                          className={key === activeQs ? 'qs-item-active' : 'qs-item'}
                          onClick={() => onChangeQs(qs.skill, skillIndex, itemIndex)}
                          key={item.id}
                        >
                          <div className='qs-item-question'>
                            <span>{(itemIndex + 1) + '.' + item.questions}</span>
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
            {activeSkill === 'others' && <ExternalQuestionList data={othersQuestionMap} onParametersChange={onSkillWeightChange} />}
          </div>
        </div>
        <div className='refresh' onClick={onChangeRefresh}>
          <img src={Refresh} className='refreshImage' />
          换一批
        </div>
      </div>
      <div className='content-right-chatBot'
        style={{
          height: chatOpen ? 'calc(114vh - 351px)' : '200px',
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
          <iframe className='chatBotIframe' src="https://ai.cmschina.com.cn/llm/chatbot#/pureChat" frameBorder="0"
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
