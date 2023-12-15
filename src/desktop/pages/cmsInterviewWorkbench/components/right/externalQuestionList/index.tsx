import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { response } from '../../constants'

const ExternalQuestionList = ({ onSkillWeightChange, onParametersChange }: any) => {
  const [externalQuestionsMap, setExternalQuestionsMap] = useState<any>([])
  const [activeQs, setActiveQs] = useState<number | null>(null)
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null)
  const [clickedQuestionIds, setClickedQuestionIds] = useState<Set<string>>(new Set())
  const [clickedQuestionsBySkill, setClickedQuestionsBySkill] = useState(new Map<string, Set<string>>())

  const initialSkillWeights = response.initTopic.data.reduce((acc: any, skill: any) => {
    acc[skill.skill] = 100
    return acc
  }, {})

  const [skillWeights, setSkillWeights] = useState(initialSkillWeights)

  const fetchData = async () => {
    try {
      const res = await axios.get(
        '/data/cms-out-manage/cmsOutWorkbench/topic/getNewTopic'
      )
      const { initTopic } = res?.data

      setExternalQuestionsMap(
        initTopic.data.map((topic: any) => ({
          skill: topic.skill,
          data: topic.data.map((qs: any) => ({
            key: qs.id,
            question: qs.questions,
            answer: qs.answer,
          })),
        }))
      )
    } catch (error) {
      console.error('获取外部数据时出错:', error)
      const { initTopic } = response

      setExternalQuestionsMap(
        initTopic.data.map((topic: any) => ({
          skill: topic.skill,
          data: topic.data.map((qs: any) => ({
            key: qs.id,
            question: qs.questions,
            answer: qs.answer,
          })),
        }))
      )
    }
  }

  /**
   * @description 计算权重
   * @param skill 
   * @param questionId 
   */
  const onSkillWeightChangeAndParams = (skill: string, questionId: string) => {
    // 获取当前 skill 下已经点击的问题集合
    const clickedQuestionsForSkill = clickedQuestionsBySkill.get(skill) || new Set()
  
    // 检查是否已点击过相同的问题
    if (!clickedQuestionsForSkill.has(questionId)) {
      // 记录已点击问题
      setClickedQuestionsBySkill((prevClickedQuestionsBySkill) => {
        const updatedClickedQuestionsBySkill:any = new Map(prevClickedQuestionsBySkill)
  
        if (!updatedClickedQuestionsBySkill.has(skill)) {
          updatedClickedQuestionsBySkill.set(skill, new Set())
        }
  
        updatedClickedQuestionsBySkill.get(skill).add(questionId)
  
        return updatedClickedQuestionsBySkill
      })
    }
  
    // 处理技能栈权重
    setSkillWeights((prevSkillWeights: any) => {
      const updatedSkillWeights = { ...prevSkillWeights }
  
      // 将点击的技能栈权重加100，但是如果已点击过相同的问题，不再增加权重
      if (!clickedQuestionsForSkill.has(questionId)) {
        updatedSkillWeights[skill] += 100
      }
  
      // 将其他技能栈权重减10
      Object.keys(updatedSkillWeights).forEach((key) => {
        if (key !== skill) {
          updatedSkillWeights[key] -= 10
        }
      })
  
      return updatedSkillWeights
    })
  
    // 生成参数
    const parameters = Object.entries(skillWeights).map(([skill, weight]) => ({
      skill,
      weight,
      id: Array.from(clickedQuestionsBySkill.get(skill) || []),
    }))
  
    console.log('parameters', parameters)
    const params = {
      data: parameters,
    }
    console.log('params', params)
    // 将参数传递给 ContentRight 组件
    onParametersChange(params)
  }
  
  
  

  // 在点击问题时调用更新权重的函数
  const onChangeQs = (skillIndex: number, itemIndex: number) => {
    const key: any = `${skillIndex}-${itemIndex}`
    // 如果点击的问题是已经展开的问题，则收缩它
    setExpandedQuestionIndex((prevKey: any) => (prevKey === key ? null : key))

    // 更新 activeQs，应该将 activeQs 设置为问题的唯一标识
    setActiveQs(key)

    // 调用处理权重和参数的函数
    onSkillWeightChangeAndParams(externalQuestionsMap[skillIndex].skill, externalQuestionsMap[skillIndex].data[itemIndex].key)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      {/* 渲染外部问题列表 */}
      {externalQuestionsMap.map((qs: any, skillIndex: number) => {
        return (
          <div className={'qs-item'} key={qs.skill}>
            {qs.data.map((item: any, itemIndex: number) => {
              const key: any = `${skillIndex}-${itemIndex}`
              const isAnswerVisible = expandedQuestionIndex === key

              return (
                <div
                  className={key === activeQs ? 'qs-item-active' : 'qs-item'}
                  onClick={() => onChangeQs(skillIndex, itemIndex)}
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
    </div>
  )
}

export default ExternalQuestionList
