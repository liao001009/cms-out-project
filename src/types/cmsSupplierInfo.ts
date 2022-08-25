import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*供应商信息*/
export interface ICmsSupplierInfo extends IBaseType {
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
  //供应商信息
  fdColDqya4q: string
  //供应商名称
  fdName: string
  //组织机构代码
  fdOrgCode: string
  //供应商合作状态
  fdCooperationStatus: string
  //供应商类型
  fdSupplierType: string
  //供应商邮箱
  fdSupplierEmail: string
  //供应商简称
  fdSupplierSimpleName: string
  //开通管理员账号
  fdAdminAccount: string
  //所属框架
  fdFrame: any
  //供应商简介
  fdDesc: string
}
