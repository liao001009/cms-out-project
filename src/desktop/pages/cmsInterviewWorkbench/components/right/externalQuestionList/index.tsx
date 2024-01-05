import React, { useEffect, useState } from 'react'
// import axios from 'axios'

const ExternalQuestionList = ({ data, onParametersChange }: any) => {
  const [externalQuestionsMap, setExternalQuestionsMap] = useState<any>([])
  const [activeQs, setActiveQs] = useState<number | null>(null)
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null)
  const [clickedQuestionIds, setClickedQuestionIds] = useState<Set<string>>(new Set())
  const [clickedQuestionsBySkill, setClickedQuestionsBySkill] = useState(new Map<string, Set<string>>())
  const [skillWeights, setSkillWeights] = useState([])
  const [allIds, setAllIds] = useState<any>([])

  const fetchData = async () => {
    setExternalQuestionsMap(
      data.map((topic: any) => ({
        skill: topic.skill,
        data: topic.data.map((qs: any) => ({
          id: qs.id,
          question: qs.questions,
          answer: qs.answer,
        })),
      }))
    )
  }

  /**
   * @description 计算权重
   * @param skill 
   * @param questionId 
   */
  const onSkillWeightChangeAndParams = (skill: string, questionId: string) => {
    setSkillWeights((prevSkillWeights: any) => {
      const clickedQuestionsForSkill = clickedQuestionsBySkill.get(skill) || new Set()
      const isSkillUpdated = !clickedQuestionsForSkill.has(questionId)
      // 更新权重
      const updatedSkillWeights = { ...prevSkillWeights }
      updatedSkillWeights[skill] += 100

      // 仅执行一次，将其他技能栈的权重减去10
      Object.keys(updatedSkillWeights).forEach((key) => {
        if (key !== skill && updatedSkillWeights[key] >= 10) {
          updatedSkillWeights[key] -= 10
        }
      })

      // 记录点击的问题
      clickedQuestionsForSkill.add(questionId)
      setClickedQuestionsBySkill((prevClickedQuestionsBySkill) => {
        const updatedClickedQuestionsBySkill = new Map(prevClickedQuestionsBySkill)
        updatedClickedQuestionsBySkill.set(skill, clickedQuestionsForSkill)
        return updatedClickedQuestionsBySkill
      })

      return updatedSkillWeights
      // if (isSkillUpdated) {
      //   // 更新权重
      //   const updatedSkillWeights = { ...prevSkillWeights }
      //   updatedSkillWeights[skill] += 100

      //   // 仅执行一次，将其他技能栈的权重减去10
      //   Object.keys(updatedSkillWeights).forEach((key) => {
      //     if (key !== skill && updatedSkillWeights[key] >= 10) {
      //       updatedSkillWeights[key] -= 10
      //     }
      //   })

      //   // 记录点击的问题
      //   clickedQuestionsForSkill.add(questionId)
      //   setClickedQuestionsBySkill((prevClickedQuestionsBySkill) => {
      //     const updatedClickedQuestionsBySkill = new Map(prevClickedQuestionsBySkill)
      //     updatedClickedQuestionsBySkill.set(skill, clickedQuestionsForSkill)
      //     return updatedClickedQuestionsBySkill
      //   })

      //   return updatedSkillWeights
      // }

      // return prevSkillWeights
    })
  }

  useEffect(() => {
    // 生成参数
    const parameters = Object.entries(skillWeights).map(([skill, weight]) => ({
      skill,
      weight,
      id: Array.from(clickedQuestionsBySkill.get(skill) || []),
    }))

    const apiParams = mergeIdsAndWeights(allIds, parameters)
    // 处理id为[]的skill下的weight
    const resParams = onHanldeNoIdweight(apiParams)
    const params = {
      data: resParams,
    }

    // 在 skillWeights 更新后，执行相关操作
    console.log('parameters===', parameters)

    console.log('params===', params)

    // 将参数传递给 ContentRight 组件
    onParametersChange(params)
  }, [skillWeights])

  // 在点击问题时调用更新权重的函数
  const onChangeQs = (skill: string, skillIndex: number, itemIndex: number) => {
    const key: any = `${skillIndex}-${itemIndex}`
    console.log('key===', key)

    // 如果点击的问题是已经展开的问题，则收缩它
    setExpandedQuestionIndex((prevKey: any) => (prevKey === key ? null : key))

    // 更新 activeQs，应该将 activeQs 设置为问题的唯一标识
    setActiveQs(key)

    // 调用处理权重和参数的函数
    onSkillWeightChangeAndParams(externalQuestionsMap[skillIndex].skill, externalQuestionsMap[skillIndex].data[itemIndex].key)
  }
  const transformDataIds = () => {
    const newDataIds = data.map((skillData: any) => ({
      skill: skillData.skill,
      id: skillData.isAllDone ? [] : skillData.data.map((item: any) => item.id),
    }))

    setAllIds((prevAllIds: any) => {
      const oldAllIds = prevAllIds

      const updatedAllIds = newDataIds.map((newItem: any) => {
        const oldItem = oldAllIds.find((item: any) => item.skill === newItem.skill)
        return {
          skill: newItem.skill,
          id: oldItem ? [...oldItem.id, ...newItem.id] : newItem.id,
        }
      })

      return updatedAllIds
    })
  }

  const onHanldeNoIdweight = (dataRes: any) => {
    const newDataRes = dataRes.map((item: any) => {
      if (item.id.length === 0) {
        return { ...item, weight: 100 }
      }
      return item
    })

    return newDataRes
  }

  const mergeIdsAndWeights = (dataIds: any, dataWeights: any) => {
    // 合并 dataIds 和 dataWeights
    const mergedData = dataIds.map((dataId: any) => {
      const matchingWeight = dataWeights.find((dataWeight: any) => dataWeight.skill === dataId.skill)
      return {
        skill: dataId.skill,
        weight: matchingWeight ? matchingWeight.weight : 100,
        id: dataId.id
      }
    })

    return mergedData
  }

  useEffect(() => {
    fetchData()
    setActiveQs(null)
  }, [data])

  useEffect(() => {
    console.log('data2====', data)
    const initialSkillWeights = data.reduce((acc: any, skill: any) => {
      acc[skill.skill] = 100
      return acc
    }, {})
    transformDataIds()
    setSkillWeights(initialSkillWeights)
  }, [data])

  let numOthers = 0
  return (
    <div>
      {/* 渲染外部问题列表 */}
      {externalQuestionsMap.map((qs: any, skillIndex: number) => {
        return (
          <div className={'qs-item'} key={qs.skill}>
            {qs.data.map((item: any, itemIndex: number) => {
              numOthers++
              const key: any = `${skillIndex}-${itemIndex}`
              const isAnswerVisible = expandedQuestionIndex === key
              return (
                <div
                  className={key === activeQs ? 'qs-item-active' : 'qs-item'}
                  onClick={() => onChangeQs(qs.skill, skillIndex, itemIndex)}
                  key={item.id}
                >
                  <div className='qs-item-question'>
                    <span>{numOthers + '.' + item.question + '(' + qs.skill + ')'}</span>
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
