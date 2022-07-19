import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*发布中选信息*/
export interface ICmsProjectSelectInfo extends IBaseType {
  //创建人
  fdCreator: Partial<IOrgElement>
  //创建时间
  fdCreateTime: number
  //创建人部门
  fdCreatorDept: Partial<IOrgElement>
  //修改人
  fdAlter: Partial<IOrgElement>
  //修改时间
  fdAlterTime: number
  //拥有者
  fdOwner: Partial<IOrgElement>
  //拥有者部门
  fdOwnerDept: Partial<IOrgElement>
  //文档状态
  fdProcessStatus: string
  //发布时间
  fdPublishedTime: number
  //流程模板ID
  fdProcessTemplateId: string
  //应用表单ID
  fdXformId: string
  //对应版本
  fdVersion: string
  //主键ID
  fdId: string
  //发布中选信息
  fdColUv007g: string
  //项目名称
  fdProject: any
  //主题
  fdSubject: string
  //项目编号
  fdProjectNum: string
  //项目负责人
  fdProjectLeader: Partial<IOrgElement>
  //中选供应商
  fdSelectedSupplier: any
  //落选供应商
  fdFailSupplier: any
  //供应商确认
  fdConfirm: string
  //描述说明
  fdDesc: string
  //项目需求
  fdProjectDemand: any
}
