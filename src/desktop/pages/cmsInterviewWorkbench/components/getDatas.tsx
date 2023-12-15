import axios from 'axios'
import { useState } from 'react'
export const demo = {
  'personMessage': {
    '名字': '颜丹丹',
    '岗位': '高级Java开发工程师',
    '年龄': '21',
    '工龄': '1',
    '学历': '本科',
    '手机号': '15819678374',
    '邮箱': 'yddforward@163.com'
  },
  'skillPoint': [
    'Java',
    'Nginx',
    'Spring MVC',
    'Redis',
    'Spring Boot',
  ],
  'workExperience': [
    {
      '公司名字': '北京智精灵科技有限公司',
      '工作时间': '2021.05-至今',
      '工作岗位': '高级Go开发工程师',
      '工作内容': [
        '1、参与老年患者小程序项目需求开发',
        '2、人脸情绪识别项目功能开发与上线',
        '3、参与 go 项目组对话c端对话机器人功能实现',
        '4、参与内部运营系统重构',
        '5、认知中心建设平台与认知中心培训系统开发与上线'
      ]
    },
    {
      '公司名字': '广联达科技股份有限公司',
      '工作时间': '2017.09-2021.04',
      '工作岗位': '高级GO开发工程师',
      '工作内容': [
        '1、负责技术选型，框架搭建，项目持续集成；',
        '2、项目建模，流程制定，uml 规划、核心代码的编写；',
        '3、带领小组进行需求讨论，技术难点攻克；',
        '4、解决项目中遇到的困难以及突发问题',
        '5、定期组织团队成员分享，讨论新技能，共同进步。'
      ]
    },
    {
      '公司名字': '北京天景隆软件科技有限公司',
      '工作时间': '2012.09-2017.05',
      '工作岗位': 'Golang',
      '工作内容': [
        '1、根据客户需求协助项目经理进行相关文档的编写；',
        '2、负责业务需求分析、业务数据建模和设计；',
      ]
    }
  ]
}
interface Params {
  // 附件ID
  fdFileId: string
  // 附件在服务器上存放的路径
  fdFilePath: string
  // 部门全路径(参考格式：招商总部_金融科技中心_综合业务开发部)
  fdFullOrgName: string
  // 登录名(hufeiran)
  fdOrgCode: string
  // 编码(UR10003276)
  fdOrgId: string
  // 所属部门名称(综合业务开发部)
  fdOrgName: string
  // 用户名(胡斐然)
  fdUserName: string
}
// const [data, setData] = useState<any>()

export function getDatas (params: Params) {
  // 使用async/await语法发送异步请求
  async function fetchPosts () {
    try {
      await axios.request({
        url: '/data/cms-out-manage/cmsOutWorkbench/convent',
        method: 'post',
        data: params,
        // headers: {
        //   'Content-Type': 'application/json'
        // }
      }).then((res) => {
        console.log('convent',res.data)
        return res.data
        // setData (res.data) 
      })
    } catch (error) {
      console.error(error)
    }
  }
  fetchPosts()
}

