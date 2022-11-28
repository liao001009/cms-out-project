import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*中选确认*/
export interface ICmsSelectConfirm extends IBaseType {
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
  //主题
  fdSubject: string
  //项目名称
  fdProject: any
  //项目编号
  fdProjectNum: string
  //中选供应商
  fdSupplier: any
  //中选信息
  fdColFavvya: string
  //描述说明
  fdDesc: string
  //供应商确认
  fdConfirmSupplier: string
  //中选信息
  fdSelectedMation: any
}
