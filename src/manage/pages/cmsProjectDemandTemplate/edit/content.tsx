import React, { createRef, useRef, useEffect, useState, useMemo, useCallback, createElement as h } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Router } from '@ekp-infra/common'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { ICmsProjectDemandTemplate } from '@/types/cmsProjectDemandTemplate'
import api from '@/api/cmsProjectDemandTemplate'
import Icon from '@lui/icons'
import { Loading, Message } from '@lui/core'
import EditComponent from '../baseEdit'
import subRouters from './router'
import './index.scss'

Message.config({ maxCount: 1 })
const Content: React.FC<IContentViewProps> = (props) => {
  const { match, history } = props
  const id = match.params['id'] // 模板id
  const componentRefs = useRef<{ [key: string]: any }>({})
  const [templateData, setTemplateData] = useState<Partial<ICmsProjectDemandTemplate>>() // 模板数据

  const [editComponentVisible, setEditComponentVisible] = useState(false) // 编辑弹窗

  useEffect(() => {
    api.get({ fdId: id, mechanisms: { load: '*' } }).then((response) => {
      const templateData = response.data
      if (!templateData) return
      setTemplateData(templateData)
    })
  }, [id])

  // 2级路由
  const routers = useMemo(() => {
    const parent = match.url
    return subRouters.map((router) => {
      const Component = router.component
      !componentRefs.current[router.path] && (componentRefs.current[router.path] = createRef())
      const getValue = router.lifecycle && router.lifecycle.getDerivedValueFromTemplate
      const otherProps = (templateData && getValue && getValue(templateData)) || {}
      return {
        key: router.path,
        name: router.name,
        path: `${parent}/${router.path}`,
        component: () =>
          h(Component, {
            id,
            validateImmediate: true,
            wrappedComponentRef: componentRefs.current[router.path],
            ...props,
            ...otherProps
          })
      }
    })
  }, [match.url, templateData])

  // 获取当前选中路由key
  const getCurrentRouteKey = useCallback(() => {
    // 暂时没有更好的方案，先从hash中获取route key
    const regExp = new RegExp(`${id}/([^\/]+)(\/[^\/]+)?`)
    const __match = location.hash.match(regExp)
    let currentKey = 'lbpm'
    if (__match && __match[1]) {
      currentKey = __match[1]
    }
    return currentKey
  }, [id])

  // 根据key值获取路由
  const getRouterByKey = useCallback((key: string) => {
    for (let i = 0; i < subRouters.length; i++) {
      if (subRouters[i].path === key) {
        return subRouters[i]
      }
    }
    return null
  }, [])

  // 点击菜单逻辑
  const switchMenu = useCallback((router) => {
    const run = async () => {
      const currentKey = getCurrentRouteKey()
      const { key, path } = router
      if (currentKey === key) {
        return
      }
      if (componentRefs.current[currentKey]) {
        const currentRef = componentRefs.current[currentKey]
        if (currentRef.current) {
          const getValue = currentRef.current.getValue
          const currentRouter = getRouterByKey(currentKey)
          const unmount = currentRouter && currentRouter.lifecycle && currentRouter.lifecycle.componentWillUnmount
          if (getValue && unmount) {
            // 如果存在获取值，本地缓存
            const value = await getValue()
            const newTemplateData = unmount(value, templateData!)
            setTemplateData(newTemplateData)
          }
        }
      }
      history.replace(path)
    }
    run()
  }, [])

  // 通用保存逻辑
  const _save = useCallback(
    (publishData?: {
      // 是否生成新版本
      fdBuildNew: boolean
      // 版本描述
      fdDesc?: string
    }) => {
      const run = async () => {
        const currentKey = getCurrentRouteKey()
        const currentRouter = getRouterByKey(currentKey)
        const currentRef = componentRefs.current[currentKey]
        let newTemplateData = templateData
        if (currentRef && currentRef.current) {
          const getValue = currentRef.current.getValue
          const unmount = currentRouter && currentRouter.lifecycle && currentRouter.lifecycle.componentWillUnmount
          if (getValue && unmount) {
            const value = await getValue()
            newTemplateData = unmount(value, newTemplateData || {})
          }
        }
        publishData && (newTemplateData = { ...newTemplateData, ...publishData })
        // 模板保存前，给各个机制最后的机会调整自己的机制数据
        subRouters.forEach((subRouter) => {
          if (subRouter.beforeSubmit)
            newTemplateData = subRouter.beforeSubmit(newTemplateData!, {
              isDraft: false
            })
        })
        const newLbpmTemplate = newTemplateData?.mechanisms.lbpmTemplate.map(i => {
          i.fdTemplateForms[0].fdSystemName = 'MK-Pass内部系统'
          i.fdModuleCode = i.fdTemplateForms[0].fdModuleCode
          i.fdSystemCode = i.fdTemplateForms[0].fdSystemCode
          i.fdSystemName = 'MK-Pass内部系统'
          return i
        })
        //@ts-ignore
        newTemplateData?.mechanisms.lbpmTemplate = newLbpmTemplate
        const requestApi = publishData ? api.publish : api.update
        const requestLoadingText = publishData ? '发布中' : '保存中'
        const hide = Message.loading(requestLoadingText, 0)
        requestApi(newTemplateData!)
          .then(() => {
            const templateData = { ...newTemplateData }
            setTemplateData(templateData)
            hide()
            Message.success(publishData ? '发布成功' : '保存成功', 3, () => {
              if (publishData) {
                // 发布才跳回到列表页面
                history.goto('/cmsProjectDemandTemplate/list')
              }
            })
          })
          .catch(() => {
            hide()
            Message.error(publishData ? '发布失败' : '保存失败', 3)
          })
      }
      run()
    },
    [templateData]
  )

  // 保存
  const update = useCallback(() => _save(), [_save])

  // 发布
  // const publish = useCallback(() => {
  //   _save({ fdBuildNew: true, fdDesc: '' })
  // }, [_save])

  return !templateData ? (
    <Loading />
  ) : (
    <React.Fragment>
      <div className="lui-template-admin">
        <div className="lui-template-admin-header">
          <div className="left">
            <Icon name="iconCommon_line_12_arrowLeft" normalize={true} onClick={() => history.goBack()} />
            <span className="label">{templateData.fdName}</span>
            <Icon name="setting" onClick={() => setEditComponentVisible(true)} />
            <EditComponent
              visible={editComponentVisible}
              callback={() => setEditComponentVisible(false)}
              mode="update"
              templateId={templateData.fdId}
            />
          </div>
          <ul className="menu">
            {routers.map((router) => {
              const pathname = history.location.pathname
              // 是否选中
              const isActive = pathname.indexOf(router.path) > -1
              const activeClass = isActive ? 'active' : ' '
              return h(
                'li',
                {
                  key: router.path,
                  className: `menu-item ${activeClass}`,
                  onClick: () => switchMenu(router)
                },
                router.name
              )
            })}
          </ul>
          <div className="right">
            {/* <span onClick={() => publish()}>
              <Icon name="xform-publish" type="vector" />发布
            </span> */}
            <span onClick={() => update()}>
              <Icon name="xform-save" type="vector" />
              保存
            </span>
          </div>
        </div>
        <div className="lui-template-admin-content">
          <Switch>
            <Route path={match.url} exact={true} render={() => <Redirect to={`${match.url}/lbpm`}></Redirect>}></Route>
            <Router.RenderRoutes routes={routers} />
          </Switch>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Content
