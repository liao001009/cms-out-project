// 通用“筛选”逻辑

/**
 * 整合筛选数据
 * @param originQuery 旧的查询条件
 * @param newValue 新的查询条件
 */
export const $reduceCriteria = (originQuery, newValue) => {
  const newConditions = {
    ...originQuery.conditions,
    ...newValue.reduce((acc, cur) => {
      const { name, value } = cur
      if (value && value.length > 0) {
        if (value.length === 1) {
          // 单选
          if(value[0].value){
            if(typeof value[0].value === 'string'){
              acc[name] = { $contains: value[0].value || undefined }
            }else{
              acc[name] = { $gte: value[0].value[0].value,$lte: value[0].value[1].value,}
            }
          }else{
            acc[name] = null
          }
        } else {
          // 多选
          acc[name] = { $contains: { $or: value.map((_value) => _value.value) } }
        }
      } else {
        acc[name] = null
      }
      return acc
    }, {})
  }
  for (const key in newConditions) {
    if (newConditions[key] === null) {
      newConditions[key] = undefined
    }
  }
  return newConditions
}
