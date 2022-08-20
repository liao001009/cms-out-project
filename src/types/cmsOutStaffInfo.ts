import { IBaseType } from '@ekp-infra/common/dist/types'
import { IOrgElement } from '@ekp-infra/common/dist/types'

/*外包人员信息*/
export interface ICmsOutStaffInfo extends IBaseType {
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
  //外包人员信息
  fdCol2cmn0f: string
  //个人照片
  fdPhoto: string
  //姓名
  fdCol9mzs5p: string
  //身份证号
  fdColLddvfu: string
  //手机号
  fdColJant3n: string
  //出生日期
  fdColMw1yjc: number
  //自评技能级别
  fdSkillLevel: string
  //技能
  fdSkill: string
  //简历附件
  fdResumeAtt: string
  //岗位
  fdPost: any
  //最高学历
  fdHighestEducation: string
  //专业
  fdMajor: string
  //学历证明附件
  fdSchoolingAtt: string
  //性别
  fdSex: string
  //姓名拼音
  fdNamePinyin: string
  //状态信息
  fdStatusInfo: string
  //当前项目
  fdCurrentProject: string
  //当前项目性质
  fdCurrentProjectNature: string
  //当前所属招证内部团队
  fdInnerTeam: string
  //首次入场时间
  fdFirstEntranceDate: number
  //上次调级时间
  fdLastUpgradeDate: number
  //邮箱
  fdEmail: string
  //工作地
  fdWorkAddress: string
  //组织信息/所属供应商
  fdSupplier: any
  //定级级别
  fdConfirmLevel: string
  //参加工作日期
  fdEntryWorkDate: number
}
