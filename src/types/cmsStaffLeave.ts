import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*离场申请*/
export interface ICmsStaffLeave extends IBaseType {
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
  //离场申请
  fdColW8681j: string
  //联系电话
  fdMobile: string
  //所属系统/项目
  fdProject: any
  //所属部门
  fdBelongDept: Partial<IOrgElement>
  //所属组/团队
  fdBelongTeam: Partial<IOrgElement>
  //资源、账号、权限注销
  fdCol1j39ya: string
  //云主机账号
  fdCloudHost: string
  //悟空账号
  fdWukong: string
  //码云账号
  fdGitee: string
  //物理机主机设备编号
  fdPhysicalMachineNo: string
  //桌面助手账号
  fdDesktopAide: string
  //coding账号
  fdCoding: string
  //VPN账号
  fdVpn: string
  //网络权限
  fdNetworkPrem: string
  //工位
  fdStation: string
  //门禁
  fdEntranceGuard: string
  //具体说明
  fdSpecify: string
  //项目负责人
  fdProjectPrincipal: Partial<IOrgElement>
  //内部负责人
  fdInnerPrincipal: Partial<IOrgElement>
  //项目性质
  fdProjectNature: string
  //云主机设备编号
  fdCloudHostNo: string
}
