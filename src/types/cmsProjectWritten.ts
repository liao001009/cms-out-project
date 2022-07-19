import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*录入笔试分数*/
export interface ICmsProjectWritten extends IBaseType {
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
  //录入笔试成绩
  fdCol5hz0vs: string
  //笔试时间
  fdWrittenTime: number
  //合格分数线
  fdQualifiedMark: number
  //是否面试
  fdIsInterview: string
  //邮件通知供应商
  fdNoticeSupplier: string
  //邮件通知面试官
  fdNoticeInterviewer: string
  //面试官
  fdInterviewer: Partial<IOrgElement>
  //供应商
  fdSupplierTotal: any
  //项目需求
  fdProjectDemand: any
  //主题
  fdSupplier: string
  //文档状态
  fdStatus: string
}
