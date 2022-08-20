
import { useEffect, useRef, useState } from 'react'


const GRAB = '_GRAB'
/**
 * 获取数据
 * @param key 要监听的事件key
 * @param callback 事件触发后的回调事件
 * @param dependecies 其他的依赖值
 * */
export const useMkGetData = (key: string, callback?, dependecies?: any[]) => {
  const [value, setValue] = useState<any>()
  useEffect(() => {
    const getDataCallback = (value) => {
      setValue(value)
      callback?.(value)
    }
    mk.on(key, getDataCallback)
    mk.emit(key + GRAB, null)
    return () => {
      mk.off(key, getDataCallback)
    }
  }, [key, ...(dependecies || [])])
  return [value]
}

/**
 * 发送数据
 * @param key 要监听的事件key
 * @param callback 事件触发后的回调事件
 * @param dependecies 其他的依赖值
 * */
export const useMkSendData = (key: string, dependecies?: any[]) => {
  const prevValueRef = useRef<any>()
  const emitValue = (value) => {
    prevValueRef.current = value
    mk.emit(key, value)
  }
  useEffect(() => {
    let didCancel
    const callback = () => {
      if (!didCancel && typeof prevValueRef.current !== 'undefined') {
        emitValue(prevValueRef.current)
      }
    }
    mk.on(key + GRAB, callback)
    return () => {
      didCancel = true
      mk.off(key, callback)
    }
  }, [key, ...(dependecies || [])])
  return { emitValue }
}
