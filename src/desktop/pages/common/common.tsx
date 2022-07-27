import React from 'react'
import Criteria from '@elem/criteria'
import { Tooltip } from '@lui/core'
// 供应商
export const supplierColumns = [
  /*供应商名称*/
  {
    title: '供应商名称',
    dataIndex: 'fdSupplierName',
    render: (value) => value
  },
  /*组织机构代码*/
  {
    title: '组织机构代码',
    dataIndex: 'fdOrgCode',
    render: (value) => value
  },
  /*组织机构代码*/
  {
    title: '所属框架',
    dataIndex: 'fdFrame',
    render: (value) => value && value.fdName
  },
  /*供应商合作状态*/
  {
    title: '供应商合作状态',
    dataIndex: 'fdCooperationStatus',
    render: (value) => {
      const options = [
        {
          value: '1',
          label: '未签合同'
        },
        {
          value: '2',
          label: '已签合同'
        },
        {
          value: '3',
          label: '合同过期'
        }
      ]
      const option = options.find((option) => option.value === value)

      if (!option) {
        return value
      }

      return option.label
    }
  },
  /*创建时间*/
  {
    title: '创建时间',
    dataIndex: 'fdCreateTime',
    render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD HH:mm')
  }
]
// 项目
export const projectColumns = [
  /*项目名称*/
  {
    title: '项目名称',
    dataIndex: 'fdName',
    render: (value) => value
  },
  /*项目编号*/
  {
    title: '项目编号',
    dataIndex: 'fdCode',
    render: (value) => value
  },
  /*项目所属框架*/
  {
    title: '项目所属框架',
    dataIndex: 'fdFrame',
    render: (value) => value && value.fdName
  },
  /*项目性质*/
  {
    title: '项目性质',
    dataIndex: 'fdProjectNature',
    render: (value) => {
      const options = [
        {
          value: '1',
          label: '项目外包'
        },
        {
          value: '2',
          label: '厂商驻场实施'
        }
      ]
      const option = options.find((option) => option.value === value)

      if (!option) {
        return value
      }

      return option.label
    }
  },
  /*所属部门*/
  {
    title: '所属部门',
    dataIndex: 'fdBelongDept',
    render: (value) => value && value.fdName
  },
  /*所属组/团队*/
  {
    title: '所属组/团队',
    dataIndex: 'fdBelongTeam',
    render: (value) => value && value.fdName
  },
  /*项目负责人*/
  {
    title: '项目负责人',
    dataIndex: 'fdProjectPrincipal',
    render: (value) => value && value.fdName
  },
  /*内部责任人*/
  {
    title: '内部责任人',
    dataIndex: 'fdInnerPrincipal',
    render: (value) => value && value.fdName
  },
  /*项目立项时间*/
  {
    title: '项目立项时间',
    dataIndex: 'fdProjectDate',
    render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD')
  },
  /*预计开始时间*/
  {
    title: '预计开始时间',
    dataIndex: 'fdStartDate',
    render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD')
  },
  /*预计结束日期*/
  {
    title: '预计结束日期',
    dataIndex: 'fdEndDate',
    render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD')
  }
]
// 外包人员信息
export const outStaffInfoColumns = [
  /*组织信息/所属供应商*/
  {
    title: '组织信息/所属供应商',
    dataIndex: 'fdSupplier',
    render: (value) => value && value.fdName
  },
  /*姓名*/
  {
    title: '姓名',
    dataIndex: 'fdName',
    render: (value) => value
  },
  /*岗位*/
  {
    title: '岗位',
    dataIndex: 'fdPost',
    render: (value) => value && value.fdName
  },
  /*定级级别*/
  {
    title: '定级级别',
    dataIndex: 'fdConfirmLevel',
    render: (value) => {
      const options = [
        {
          value: '1',
          label: '资深'
        },
        {
          value: '2',
          label: '高级'
        },
        {
          value: '3',
          label: '中级'
        },
        {
          value: '4',
          label: '初级'
        }
      ]
      const option = options.find((option) => option.value === value)

      if (!option) {
        return value
      }

      return option.label
    }
  },
  /*状态信息*/
  {
    title: '状态信息',
    dataIndex: 'fdStatusInfo',
    render: (value) => {
      const options = [
        {
          value: '1',
          label: '未参与项目'
        },
        {
          value: '2',
          label: '中选待入场'
        },
        {
          value: '3',
          label: '项目中-远程'
        },
        {
          value: '4',
          label: '项目中-驻场'
        },
        {
          value: '5',
          label: '已离场'
        },
        {
          value: '6',
          label: '已离职'
        }
      ]
      const option = options.find((option) => option.value === value)

      if (!option) {
        return value
      }

      return option.label
    }
  },
  /*当前项目*/
  {
    title: '当前项目',
    dataIndex: 'fdProject',
    render: (value) => value && value.fdName
  },
  /*首次入场时间*/
  {
    title: '首次入场时间',
    dataIndex: 'fdFirstEntranceDate',
    render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD')
  },
  /*上次调级时间*/
  {
    title: '上次调级时间',
    dataIndex: 'fdLastUpgradeDate',
    render: (value) => value && mk.getFormatTime(value, 'YYYY-MM-DD')
  },
  /*当前项目性质*/
  {
    title: '当前项目性质',
    dataIndex: 'fdCurrentProjectNature',
    render: (value) => {
      const options = [
        {
          value: '1',
          label: '项目外包'
        },
        {
          value: '2',
          label: '厂商驻场实施'
        }
      ]
      const option = options.find((option) => option.value === value)

      if (!option) {
        return value
      }

      return option.label
    }
  }
]
// 表格列定义
export const projectSelectInfocolumns = [
  /*主题*/
  {
    title: '主题',
    dataIndex: 'fdSubject',
    render: (value) => value
  },
  /*项目名称*/
  {
    title: '项目名称',
    dataIndex: 'fdProject',
    render: (value) => value?.fdName
  },
  /*中选供应商*/
  {
    title: '中选供应商',
    dataIndex: 'fdSelectedSupplier',
    render: (value) => value?.map(item=>item.fdName).join(',')
  },
  /*落选供应商*/
  {
    title: '落选供应商',
    dataIndex: 'fdFailSupplier',
    render: (value) => value?.map(item=>item.fdName).join(',')
  },
  /*当前处理环节*/
  {
    title: '当前处理环节',
    dataIndex: 'currentNodeNames',
    render (_, row) {
      const value = row?.mechanisms?.lbpmProcess?.lbpm_current_node?.currentNodeNames || '--'
      return <Tooltip title={value}>{value}</Tooltip>
    },
  },
  /*当前处理人*/
  {
    title: '当前处理人',
    dataIndex: 'currentHandlerNames',
    render (_, row) {
      const value = row?.mechanisms?.lbpmProcess?.lbpm_current_processor?.currentHandlerNames || '--'
      return <Tooltip title={value}>{value}</Tooltip>
    },
  },
  /*文档状态*/
  {
    title: '文档状态',
    dataIndex: 'fdProcessStatus',
    render: (value) => {
      const options = [
        {
          value: '00',
          label: '废弃'
        },
        {
          value: '10',
          label: '草稿'
        },
        {
          value: '11',
          label: '驳回'
        },
        {
          value: '20',
          label: '待审'
        },
        {
          value: '21',
          label: '挂起'
        },
        {
          value: '29',
          label: '异常'
        },
        {
          value: '30',
          label: '结束'
        }
      ]
      const option = options.find((option) => option.value === value)

      if (!option) {
        return value
      }

      return option.label
    }
  }
]
const renderFdSupplies = (data) => {
  const newData = data.map((i) => {
    const str = i.fdName + ','
    return str
  })
  newData[data.length - 1] = newData[data.length - 1].split(',')[0]
  return newData
}

export const staffReviewColumns = [
  /*主题*/
  {
    title: '主题',
    dataIndex: 'fdSubject',
    render: (value) => value
  },
  /*项目负责人*/
  {
    title: '项目负责人',
    dataIndex: 'fdProjectLeader',
    render: (value) => value && value.fdName
  },
  /*中选供应商*/
  {
    title: '中选供应商',
    dataIndex: 'fdSupplies',
    render: (value) => value && renderFdSupplies(value)
  },
  /**文档状态 */
  {
    title: '文档状态',
    dataIndex: 'fdProcessStatus',
    render: (value) => {
      const options = [
        {
          value: '00',
          label: '废弃'
        },
        {
          value: '10',
          label: '草稿'
        },
        {
          value: '11',
          label: '驳回'
        },
        {
          value: '12',
          label: '撤回'
        },
        {
          value: '20',
          label: '待审'
        },
        {
          value: '21',
          label: '挂起'
        },
        {
          value: '29',
          label: '异常'
        },
        {
          value: '30',
          label: '结束'
        }
      ]
      const option = options.find((option) => option.value === value)

      if (!option) {
        return value
      }

      return option.label
    }
  },
  /*当前处理环节*/
  {
    title: '当前处理环节',
    dataIndex: 'currentNodeNames',
    render (_, row) {
      const value = row?.mechanisms?.lbpmProcess?.lbpm_current_node?.currentNodeNames || '--'
      return <Tooltip title={value}>{value}</Tooltip>
    },
  },
  /*当前处理人*/
  {
    title: '当前处理人',
    dataIndex: 'currentHandlerNames',
    render (_, row) {
      const value = row?.mechanisms?.lbpmProcess?.lbpm_current_processor?.currentHandlerNames || '--'
      return <Tooltip title={value}>{value}</Tooltip>
    },
  }
]
// 供应商筛选
export const supplierCriertia = () => {
  return (
    <React.Fragment>
      <Criteria.Input name="fdOrgCode" title="组织机构代码"></Criteria.Input>
      <Criteria.Criterion
        canMulti={false}
        options={[
          {
            text: '不限',
            value: ''
          },
          {
            text: '未签合同',
            value: '1'
          },
          {
            text: '已签合同',
            value: '2'
          },
          {
            text: '合同过期',
            value: '3'
          }
        ]}
        name="fdCooperationStatus"
        title="供应商合作状态"
      ></Criteria.Criterion>
      <Criteria.Input name="fdFrame.fdName" title="所属框架"></Criteria.Input>
    </React.Fragment>
  )
}
// 项目表格筛选
export const projectCriertia = () => {
  // [{
  //   name:'fdCode',
  //   title:'项目编号',
  //   type:'input',
  // },{
  //   name:'fdFrame.fdName',
  //   title:'项目所属框架',
  //   type:'input',
  // },{
  //   name:'fdProjectNature',
  //   title:'项目性质',
  //   type:'Criterion',
  //   options:[
  //     {
  //       text: '不限',
  //       value: ''
  //     },
  //     {
  //       text: '项目外包',
  //       value: '1'
  //     },
  //     {
  //       text: '厂商驻场实施 ',
  //       value: '2'
  //     }
  //   ]
  // },{
  //   name:'fdBelongDept.fdId',
  //   title:'所属部门',
  //   type:'input',
  //   orgType:2
  // }]
  return (
    <React.Fragment>
      <Criteria.Input name="fdCode" title="项目编号"></Criteria.Input>
      <Criteria.Input name="fdFrame.fdName" title="项目所属框架"></Criteria.Input>
      <Criteria.Criterion
        canMulti={false}
        options={[
          {
            text: '不限',
            value: ''
          },
          {
            text: '项目外包',
            value: '1'
          },
          {
            text: '厂商驻场实施 ',
            value: '2'
          }
        ]}
        name="fdProjectNature"
        title="项目性质"
      ></Criteria.Criterion>
      <Criteria.Org orgType={2} title="所属部门" name="fdBelongDept.fdId"></Criteria.Org>
      <Criteria.Org orgType={2} title="所属组/团队" name="fdBelongTeam.fdId"></Criteria.Org>
      <Criteria.Org orgType={8} title="项目负责人" name="fdProjectPrincipal.fdId"></Criteria.Org>
      <Criteria.Org orgType={8} title="内部责任人" name="fdInnerPrincipal.fdId"></Criteria.Org>
      <Criteria.Calendar
        options={Criteria.Calendar.buildOptions()}
        name="fdProjectDate"
        title="项目立项时间"
      ></Criteria.Calendar>
      <Criteria.Calendar
        options={Criteria.Calendar.buildOptions()}
        name="fdStartDate"
        title="预计开始时间"
      ></Criteria.Calendar>
      <Criteria.Calendar
        options={Criteria.Calendar.buildOptions()}
        name="fdEndDate"
        title="预计结束日期"
      ></Criteria.Calendar>
    </React.Fragment>
  )
}

export const presonCriertia = () => {
  return (
    <React.Fragment>
      <Criteria.Input name="fdPost.fdName" title="岗位"></Criteria.Input>
      <Criteria.Criterion
        canMulti={false}
        options={[
          {
            value: '4',
            text: '初级'
          },
          {
            value: '3',
            text: '中级'
          },
          {
            value: '2',
            text: '高级'
          },
          {
            value: '1',
            text: '资深'
          }
        ]}
        name="fdConfirmLevel"
        title="定级级别"
      ></Criteria.Criterion>
      <Criteria.Input name="fdProject.fdName" title="当前项目"></Criteria.Input>
      <Criteria.Calendar
        options={Criteria.Calendar.buildOptions()}
        name="fdFirstEntranceDate"
        title="首次入场时间"
      ></Criteria.Calendar>
      <Criteria.Calendar
        options={Criteria.Calendar.buildOptions()}
        name="fdLastUpgradeDate"
        title="上次调级时间"
      ></Criteria.Calendar>
      <Criteria.Criterion
        canMulti={false}
        options={[
          {
            value: '1',
            text: '未参与项目'
          },
          {
            value: '2',
            text: '中选待入场'
          },
          {
            value: '3',
            text: '项目中-远程'
          },
          {
            value: '4',
            text: '项目中-驻场'
          },
          {
            value: '5',
            text: '已离场'
          },
          {
            value: '6',
            text: '已离职'
          }
        ]}
        name="fdStatusInfo"
        title="状态信息"
      ></Criteria.Criterion>
    </React.Fragment>
  )
}

export const projectSelectInfoCriertia = () => {
  return (
    <React.Fragment>
      <Criteria.Org orgType={8} title="创建人" name="fdCreator.fdId"></Criteria.Org>
      <Criteria.Calendar
        options={Criteria.Calendar.buildOptions()}
        name="fdCreateTime"
        title="创建时间"
      ></Criteria.Calendar>
      <Criteria.Input name="fdSubject" title="主题"></Criteria.Input>
      <Criteria.Input name="fdProject" title="项目名称"></Criteria.Input>
      <Criteria.Input name="fdSelectedSupplier" title="中选供应商"></Criteria.Input>
      <Criteria.Input name="fdFailSupplier" title="落选供应商"></Criteria.Input>
    </React.Fragment>
  )
}

export const criertiaObj = {
  supplierCriertia: supplierCriertia(),
  projectCriertia: projectCriertia(),
  presonCriertia: presonCriertia(),
  projectSelectInfoCriertia: projectSelectInfoCriertia(),

}
