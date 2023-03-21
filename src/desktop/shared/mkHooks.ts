
import { useEffect, useRef, useState } from 'react'
import Axios from 'axios'
import apiLbpm from '@/api/cmsLbpm'
import { ESysLbpmProcessStatus } from '@/desktop/shared/util'
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


export const useMater = (data) => {
  const [materialVis, setMaterialVis] = useState<boolean>(true)
  /** 获取资料上传节点 */
  const getCurrentNode = async () => {
    try {
      const nodeInfosData = await apiLbpm.getCurrentNodeInfo({
        processInstanceId: data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
      })
      const url = mk.getSysConfig('apiUrlPrefix') + '/cms-out-manage/cmsOutManageCommon/loadNodeExtendPropertiesOnProcess'
      const processData = await Axios.post(url, {
        fdId: data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
      })
      if (nodeInfosData.data.currentNodeCards.length && processData.data.length) {
        const newArr = processData.data.filter(item => {
          return nodeInfosData.data.currentNodeCards.find(item2 => item.nodeId === item2.fdNodeId && item2.fdCurrentHandlers.some(item3 => item3.id === mk.getSysConfig('currentUser').fdId))
        })
        setMaterialVis(newArr.length ? newArr[0].extendProperty.supplierApprove === 'false' ? false : true : false)
      } else {
        setMaterialVis(false)
      }
    } catch (error) {
      setMaterialVis(false)
    }
  }
  useEffect(() => {
    getCurrentNode()
  }, [])
  return { materialVis, setMaterialVis }
}

export const useApprove = (data) => {
  const [visible, setVisible] = useState<boolean>(false)
  const userId = mk.getSysConfig().currentUser.fdId
  apiLbpm.getCurrentNodeInfo({
    processInstanceId: data?.mechanisms && data.mechanisms['lbpmProcess']?.fdProcessId
  }).then(res => {
    let currentIds: string[] = []
    res.data.currentNodeCards.forEach(i => {
      if (i.fdCurrentHandlers && i.fdCurrentHandlers.length) {
        const newIds = i.fdCurrentHandlers.map(i => i.id)
        currentIds = currentIds.concat(newIds)
      }
    })
    setVisible(currentIds.includes(userId))
  })
  return { visible }
}

// 暂存按钮
export const useDraftBtn = (data, router, handleSave) => {
  const { visible } = useApprove(data)

  if (!visible) return
  if (data.fdProcessStatus === ESysLbpmProcessStatus.COMPLETED) return
  console.log('router', router)

  return {
    name: '暂存',
    action: () => {
      handleSave(true)
    },
    // auth: {
    //   authModuleName: 'cms-out-manage',
    //   authURL: `/${router}/save`,
    // }
  }
}

// 编辑按钮
export const useEditBtn = (data, router, params, history) => {
  // const { materialVis } = useMater(data)
  // if (!materialVis) return
  if (data.fdProcessStatus === ESysLbpmProcessStatus.COMPLETED) return
  const authParams = {
    vo: { fdId: params['id'] }
  }
  return {
    name: '编辑',
    action: () => { history.goto(`/${router}/edit/${data.fdId}`) },
    auth: {
      authModuleName: 'cms-out-manage',
      authURL: `/${router}/edit`,
      params: authParams,
    }
  }
}