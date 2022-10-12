import { useImperativeHandle, useRef, Ref, useEffect, useMemo, useCallback } from 'react'
import { FormInstance } from 'rc-field-form'

type IApi = {
  // 表单对外暴露对象
  formRef: Ref<any>
  // 表单内部对象
  form: FormInstance
  // 机制数据信息
  MECHANISMNAMES: Record<string, string>
  // 值集合
  value: {
    // 机制数据
    mechanisms: Record<string, any>
    // 表单值
    values: Record<string, any>
  }
}

type ISystem = {
  // 数据集合
  props
  // 表单内部对象
  form: FormInstance
  // 明细表对象
  detailForms: React.MutableRefObject<any>
}

// 内置系统属性
export const useSystem = (payload: ISystem) => {
  const { props, form, detailForms } = payload
  const { moduleCode, entityName, value, onValuesChange: $onValuesChange } = props

  // 此玩意为了兼容旧的表单联动，禁止改动
  const $$form = useRef({
    // 高代码标志
    highCode: true,
    // 不实现
    $: () => {
      return
    },
    deleteCustomEvent: () => {
      return
    },
    forceUpdateForm: () => {
      return
    },
    getCmptByKey: () => {
      return
    },
    getRef: () => {
      return
    },
    init: () => {
      return
    },
    registerFormItems: () => {
      return
    },
    replace: () => {
      return
    },
    resetFormConfig: () => {
      return
    },
    setFieldsValue: () => {
      return
    },
    swapFieldset: () => {
      return
    },
    switchControlInvalid: () => {
      return
    },
    traverseForm: () => {
      return
    },
    validateFields: () => {
      return
    },
    getFormConfigs: () => {
      return
    },
    getFormConfig: () => {
      return
    },
    getFormConfigByType: () => {
      return
    },
    updateGlobalFormConfig: () => {
      return
    },
    // TODO 二维码用到
    updateFormItemOptions: () => {
      return
    },
    registeredFormItems: {},

    // 监听控件值变化
    customOnChanges: {} as Record<string, (values) => void>,
    customOnChange: (callback: Record<string, (values: Record<string, any>) => void>) => {
      Object.assign($$form.current.customOnChanges, callback)
      return {
        deleteCustomEvent: () => {
          Object.keys(callback).forEach((key) => {
            delete $$form.current.customOnChanges[key]
          })
        }
      }
    },

    // 获取值
    getFieldsValue: (name?: string) => {
      return name ? form.getFieldValue(name) : form.getFieldsValue()
    },
    // 更新控件属性
    updateFormItemProps: (name: string, props: Record<string, any>) => {
      Object.keys(props).forEach((key) => {
        const value = props[key]
        switch (key) {
          // 设置值
          case 'value': {
            form.setFieldsValue({ [name]: value })
            break
          }
          // 设置明细表行数据
          case 'rowValue': {
            detailForms.current?.[name]?.current?.updateRowValue(value)
            break
          }
          default:
            break
        }
      })
    }
  })

  // 监听值变更
  const onValuesChange = useCallback(
    (values) => {
      // 此逻辑禁止移除与修改
      Object.keys($$form.current.customOnChanges).forEach((key) => {
        $$form.current.customOnChanges[key](values)
      })
      $onValuesChange?.(values) // 以下自定义值变化逻辑
    },
    [$$form, $onValuesChange]
  )

  // 模板ID
  const templateId = useMemo(() => {
    return value?.fdTemplte?.fdId
  }, [value])

  // 控件长度校验函数
  const lengthValidator = useCallback((length: number) => {
    return (_rule, value) => {
      // 字符串类型，一个中文等于三个英文字符
      if (typeof value === 'string') {
        value = value.replace(/[^\x00-\xff]/g, '***')
        return value.length <= length ? Promise.resolve() : Promise.reject(new Error(`超出${length}个英文字符限制`))
      }
      return Promise.resolve()
    }
  }, [])

  return {
    $$form,
    moduleCode,
    templateId,
    entityName,
    $$tableType: 'main',
    $$tableName: 'cmsProjectInfo',
    onValuesChange,
    lengthValidator
  }
}

// 数据处理器
const VALUE_EXECUTOR = {
  attachmentDict: {
    // mechanisms数据包对应key
    key: 'attachment',
    // 初始化
    set: (values, mechanisms, name) => {
      const names = name.split('.')
      const attachment = mechanisms?.[VALUE_EXECUTOR.attachmentDict.key]
      if (!attachment) {
        return
      }
      // 明细表
      if (names.length > 1) {
        const [tableName, colName] = names
        values[tableName]?.forEach((value) => {
          const mechanismKey = value[colName]
          if (!mechanismKey) {
            return
          }
          const attachs = attachment?.filter((attach) => attach.fdEntityKey === mechanismKey)
          if (!attachs || attachs.length === 0) {
            return
          }
          value[colName] = {
            mechanismKey,
            mechanismValue: attachment?.filter((attach) => attach.fdEntityKey === mechanismKey)
          }
        })
        // 主表
      } else {
        const attachs = attachment?.filter((attach) => attach.fdEntityKey === values[name])
        if (!attachs) {
          return
        }
        values[name] = attachs
      }
    },
    // 获取值
    get: (values, mechanisms, name, flag) => {
      const names = name.split('.')
      let targetMechanisms: Array<object> = []
      // 明细表
      if (names.length > 1) {
        if (flag) return
        const [tableName, colName] = names
        const newData = Array.isArray(values[tableName]) ? values[tableName] : values[tableName]?.values
        newData?.length && newData.forEach((value) => {
          if (typeof value[colName] !== 'object') return
          const { mechanismValue, mechanismKey } = value[colName]
          targetMechanisms.push(...mechanismValue)
          value[colName] = mechanismKey
        })
        // 主表
      } else {
        const value = values[name]
        if (!value) {
          return
        }
        targetMechanisms = value
        values[name] = name
      }
      if (!mechanisms[VALUE_EXECUTOR.attachmentDict.key]) {
        mechanisms[VALUE_EXECUTOR.attachmentDict.key] = []
      }
      mechanisms[VALUE_EXECUTOR.attachmentDict.key].push(...targetMechanisms)
    }
  }
}

// 对外暴露接口
export const useApi = (payload: IApi) => {
  const { form, formRef, value, MECHANISMNAMES } = payload

  // 初始化表单
  useEffect(() => {
    if (!value) {
      return
    }
    const { mechanisms, ...values } = value
    Object.keys(MECHANISMNAMES).forEach((name) => {
      const dict = MECHANISMNAMES[name]
      if (VALUE_EXECUTOR[dict]) {
        VALUE_EXECUTOR[dict].set(values, mechanisms, name)
      }
    })
    form.setFieldsValue(values)
  }, [form, value])

  useImperativeHandle(
    formRef,
    () => ({
      // TODO 提交前拦截
      beforeSubmit: () => {
        return
      },
      // 提交校验
      validate: () => {
        return form.validateFields()
      },
      // 获取表单值
      getValue: (flag = false) => {
        const values = form.getFieldsValue() || {}
        const newValue = JSON.parse(JSON.stringify(values))
        const mechanisms = {}
        Object.keys(MECHANISMNAMES).forEach((name) => {
          const dict = MECHANISMNAMES[name]
          if (VALUE_EXECUTOR[dict]) {
            VALUE_EXECUTOR[dict].get(newValue, mechanisms, name, flag)
          }
        })
        return Object.assign(newValue, { mechanisms })
      }
    }),
    [form]
  )
}
