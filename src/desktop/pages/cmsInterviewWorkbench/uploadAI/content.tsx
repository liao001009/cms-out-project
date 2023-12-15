import React, { useEffect, useState } from 'react'
import { Message, Button, Steps } from '@lui/core'
import Icon from '@lui/icons'
import './content.scss'
import UploadPDF from '../components/uploadPDF'
import { IContentViewProps } from '@ekp-runtime/render-module'
import { getDatas } from '../components/getDatas'
// import cmsLbpm from '@/api/cmsLbpm'
import cmsApi from '@/api/cmsOutWorkbench'
import axios from 'axios'

const { Step } = Steps

const Content: React.FC<IContentViewProps> = () => {
  // 上传的附件名
  const [fileName, setfileName] = useState<any>()
  // 附件ID
  const [fdFileId, setfdFileId] = useState<any>()
  // 附件在服务器上存放的路径
  const [fdFilePath, setfdFilePath] = useState<any>()
  // 部门全路径
  const [fdFullOrgName, setfdFullOrgName] = useState<any>()
  // 登录名(hufeiran)
  const [fdOrgCode, setfdOrgCode] = useState<any>()
  // 编码(UR10003276)
  const [fdOrgId, setfdOrgId] = useState<any>()
  // 所属部门名称(综合业务开发部)
  const [fdOrgName, setfdOrgName] = useState<any>()
  // 用户名(胡斐然)
  const [fdUserName, setfdUserName] = useState<any>()
  // 性别
  const [gender, setgender] = useState<any>()
  // 当前用户fdid
  // const [userFdId, setuserFdId] = useState<any>()
  // 步骤条事件
  const [current, setCurrent] = React.useState(0)

  //页面初始化
  useEffect(() => {
    const elementDefault = document.querySelector('.ele-page-layout-default') as unknown as HTMLElement
    elementDefault.style.padding = '0px'
    // const elementRightBottom = document.querySelector('.el-plugin-container-rightBottom') as unknown as HTMLElement
    // elementRightBottom.style.display = 'none'

    getUserTopCategory()
    window.localStorage.setItem('info', '页面初始化')
    console.log('window=======',window.localStorage.getItem('info'))

  }, [])

  const getUserTopCategory = async () => {
    //mk函数获取当前用户信息
    setfdOrgCode(mk.getSysConfig().currentUser.fdLoginName)
    console.log('登录名===', fdOrgCode)

    setfdOrgId(mk.getSysConfig().currentUser['no'])
    console.log('编码===', fdOrgId)

    setfdUserName(mk.getSysConfig().currentUser.fdName)
    console.log('用户名===', fdUserName)

    setgender(mk.getSysConfig().currentUser.gender)
    console.log('性别===', gender)

    // setuserFdId(mk.getSysConfig().currentUser.fdId)
    const userFdId = mk.getSysConfig().currentUser.fdId
    console.log('当前用户fdId===', userFdId)

    /** 查询当前登录人所在一级部门 */
    // getUserTopCategory: (param) => cmsLbpm.post('/cmsLbpaCategory/getUserTopCategory', param).then(res => res?.data)

    await axios.request({
      url: '/data/sys-org/sysOrgElement/findElement',
      method: 'post',
      data: { 'targets': [userFdId], 'columns': ['fdId', 'fdName', 'fdOrgType', 'fdIsAvailable', 'fdParent', 'eosShowType', 'fdHierarchyId', 'fdInner', 'fdIsBusiness', 'fdNo', 'fdNamePinyin', 'fdVirtualizeType'] }
    }).then((res) => {
      console.log('findElement===', res.data)

      console.log('当前登录人一级部门===', res.data[0].fdParent.fdName)
      setfdOrgName(res.data[0].fdParent.fdName)

      const strLevelName = res.data[0].fdParent.fdDeptLevelName
      console.log('未处理部门全路径===', res.data[0].fdParent.fdDeptLevelName)
      const _LevelName = strLevelName.split('>').join('_')
      console.log('处理后部门全路径===', _LevelName)
      setfdFullOrgName(_LevelName)

    })
  }

  //下一步
  const next = () => {
    setCurrent(current + 1)
    console.log('下一步')

  }
  //上一步
  const prev = () => {
    setCurrent(current - 1)
  }

  //简历上传事件
  const afterUpload = (res) => {
    if (res.length > 0) {
      console.log('附件信息===', res)

      console.log('附件名称===', res[0].fullName)
      setfileName(res[0].fullName)

      const _fdFileId = res[0].fdId
      console.log('附件ID===', _fdFileId)
      setfdFileId(res[0].fdId)

      const _fdFilePath = res[0].downloadUrl
      console.log('附件在服务器上存放的路径===', _fdFilePath)
      setfdFilePath(res[0].downloadUrl)

      const params = {
        _fdFileId,
        _fdFilePath,
        fdFullOrgName,
        fdOrgCode,
        fdOrgId,
        fdOrgName,
        fdUserName
      }
      setCurrent(1)
      setTimeout(() => {
        stepping(params)
      }, 3000)
    }
  }

  //步骤条更新事件
  const stepping = (params) => {
    cmsApi.convent(params).then(res => {
      const data = res.data
      const resultData = JSON.stringify(data)
      window.localStorage.setItem('resultData', resultData)
      
      setCurrent(2)
      console.log('====成功', res)
      setTimeout(() => {
        handleInterview()
      }, 3000)
    }).catch(err => {

      Message.error('处理失败')
      console.log('====失败', err)
      setCurrent(0)
    })
  }

  const steps = [
    {
      title: '导入简历',
      content:
        (
          <UploadPDF
            labelName='pdf'
            onChange={afterUpload}
            configs={{
              accept: '.pdf',
              maxSize: 2 * 1024 * 1000
            }}
          />
        )
      ,
      //description: '描述一',
    },
    {
      title: '等待AI处理',
      content: (
        <div className='loading'>
          <div>
            <div className='loadingImage'></div>
            <div className='loadingH1'>大模型处理中，请稍后...</div>
            <div className='loadingH2'>{fileName}</div>
          </div>
        </div>
      ),
      //description: '描述二',
    },
    {
      title: '开始辅助面试',
      content: (
        <div className='finish'>
          <div>
            <div className='finishImage'></div>
            <div className='finishH1'>处理完成，即将开始辅助面试</div>
            <div className='finishH2'>{fileName}</div>
          </div>
        </div>
      ),
      //description: '描述三',
    },
  ]


  // AI面试工作台
  const handleInterview = () => {
    Message.success('跳转工作台')
    window.location.replace('/cms-out-manage/desktop/#/cmsInterviewWorkbench/interviewAI')
    // history.replaceTo('/cmsInterviewWorkbench/uploadAI')
    // mk.openLink({
    //   url: 'http://127.0.0.1:3136/cms-out-manage/desktop/#/cmsInterviewWorkbench/interviewAI',
    //   target: '_blank'
    // })
  }

  const stpsOnChange = (current) => {
    setCurrent(current)
  }

  const test = () => {
    '#'
  }
  return (
    <div className="container">
      <div className="header">
        <div className="header-logo"></div>
        <div className="header-avatar">
          <div className='header-people'></div>
          <div className='header-name'>{fdUserName}</div>
          <div className='farme'>
            <Icon name="iconCommon_surface_12_arrowDown" normalize onClick={test} />
          </div>
        </div>
      </div>
      <div className="body">
        <div className='timeline'>
          <Steps
            current={current}
            onChange={stpsOnChange}
            labelPlacement={'horizontal'}
            size={'small'}
          >
            {steps.map((item) => (
              <Step
                key={item.title}
                title={item.title}
                disabled
              //description={item.description}
              />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                上一步
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => handleInterview()}
              >
                提交
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Content