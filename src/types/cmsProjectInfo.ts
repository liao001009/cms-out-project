import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*项目库*/
export interface ICmsProjectInfo extends IBaseType {
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
  //项目名称
  fdName: string
  //项目库
  fdCol4qv13i: string
  //项目编号
  fdCode: string
  //项目所属框架
  fdFrame: any
  //项目性质
  fdProjectNature: string
  //项目立项时间
  fdProjectDate: number
  //预计开始时间
  fdStartDate: number
  //预计结束日期
  fdEndDate: number
  //所属部门
  fdBelongDept: Partial<IOrgElement>
  //所属组/团队
  fdBelongTeam: Partial<IOrgElement>
  //项目负责人
  fdProjectPrincipal: Partial<IOrgElement>
  //内部责任人
  fdInnerPrincipal: Partial<IOrgElement>
}
