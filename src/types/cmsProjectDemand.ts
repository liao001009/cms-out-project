import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*项目需求*/
export interface ICmsProjectDemand extends IBaseType {
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
  //项目需求
  fdColApzu6l: string
  //项目名称
  fdProject: any
  //项目编号
  fdProjectNum: string
  //所属部门
  fdBelongDept: Partial<IOrgElement>
  //所属团队
  fdBelongTeam: Partial<IOrgElement>
  //项目负责人
  fdProjectLeader: Partial<IOrgElement>
  //内部负责人
  fdInnerLeader: Partial<IOrgElement>
  //所属框架
  fdFrame: any
  //项目性质
  fdProjectNature: string
  //供应商范围
  fdSupplierRange: string
  //是否指定供应商
  fdIsAppoint: string
  //指定供应商名称
  fdSupplier: any
  //设计类需求子类
  fdDesignDemand: string
  //订单金额
  fdOrderAmount: number
  //需求详情
  fdColN9ybva: string
  //预计入场时间
  fdAdmissionTime: number
  //要求响应时间
  fdResponseTime: number
  //评审时间
  fdApprovalTime: number
  //人数区间
  fdCol1rfdbf: string
  //至
  fdColUso4hd: string
  //人
  fdColSgzhna: string
  //人数区间下限
  fdLowPerson: number
  //人数区间上限
  fdUpPerson: number
  //发布供应商
  fdSupplies: any
}
