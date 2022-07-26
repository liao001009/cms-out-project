import React from 'react'
import { cloneDeep } from 'lodash'
import LBPMEditor from '@/manage/components/lbpm'
import { ICmsStaffReviewTemplate } from '@/types/cmsStaffReviewTemplate'

/** 路由组件定义 */
export interface IRouteComponent {
  /** 模板id */
  id: string
  /** 组件加载完成 */
  onLoaded?: () => void
  /** ref */
  wrappedComponentRef?: React.RefObject<any>
  /** 其它透传属性 */
  [key: string]: any
}

/** 路由校验定义 */
export interface IRouteValidate {
  /** 错误信息 */
  msg: string
}

export interface IRouteProps<T = ICmsStaffReviewTemplate> {
  /** 路由名 */
  name: string
  /** 路径 */
  path: string
  /** 组件 */
  component: React.FC<IRouteComponent>
  /** 组件生命周期 */
  lifecycle?: {
    /** 组件获取数据 */
    getDerivedValueFromTemplate?: (value: Partial<T>) => object
    /** 组件挂载 */
    componentDidMount?: () => void
    /** 组件卸载 */
    componentWillUnmount?: (
      // 组件当前值
      value: object,
      // 完整模板数据
      templateData: Partial<T>
    ) => Partial<T>
  }
  /** 组件校验 */
  validate?: (templateData: Partial<T>, currentRf?: React.RefObject<any>) => Promise<Array<IRouteValidate>>
  /** 组件保存前 */
  beforeSubmit?: (templateData: Partial<T>, options: any) => Partial<T>
}

export default [
  // 流程设计
  {
    name: '流程设计',
    path: 'lbpm',
    component: LBPMEditor,
    lifecycle: {
      getDerivedValueFromTemplate: (value) => {
        try {
          if (value && value.mechanisms && value.mechanisms['lbpmTemplate']) {
            const lbpmTemplate = value.mechanisms['lbpmTemplate'] as any
            const lbpmTemplateContent = JSON.parse(lbpmTemplate[0].fdContent)
            return {
              templateData: lbpmTemplate[0],
              fdLbpmTemplateId: lbpmTemplate[0] && lbpmTemplate[0].fdId,
              elements: lbpmTemplateContent.elements,
              moduleCode: 'cms-out-manage-staffReview',
              innerForm: [
                {
                  fdSystemCode: 'INNER_SYSTEM', // 系统标示
                  fdModuleCode: 'cms-out-manage-staffReview' // 模块标识
                }
              ]
            }
          }
        } catch {}
        return {}
      },
      componentWillUnmount: (value, templateData) => {
        templateData.mechanisms = templateData.mechanisms || {}
        const lbpmTemplate = templateData.mechanisms['lbpmTemplate'] || []
        lbpmTemplate[0] = { ...lbpmTemplate[0], ...value['values'] }
        templateData.mechanisms['lbpmTemplate'] = lbpmTemplate
        return cloneDeep(templateData)
      }
    },
    beforeSubmit: (templateData, options) => {
      const { isDraft } = options
      if (templateData && templateData.mechanisms && templateData.mechanisms['lbpmTemplate']) {
        const lbpmTemplate = templateData.mechanisms['lbpmTemplate'] as any
        if (lbpmTemplate[0]) {
          lbpmTemplate[0].isDraft = isDraft
        }
      }
      return templateData
    }
  }
] as IRouteProps[]
