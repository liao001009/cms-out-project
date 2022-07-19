import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*外包人员评审*/
export interface ICmsStaffReview extends IBaseType {
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
  //文档标题
  fdSubject: string
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
  //外包人员评审
  fdColNiac8a: string
  //实际笔试时间
  fdRealWritTime: number
  //实际面试时间
  fdRealViewTime: number
  //面试官
  fdInterviewer: Partial<IOrgElement>
  //项目负责人
  fdProjectLeader: Partial<IOrgElement>
  //中选供应商
  fdSupplies: any
  //项目需求
  fdProjectDemand: any
}
