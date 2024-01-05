import React, { useEffect, useState } from 'react'
import { Message, Button, Steps } from '@lui/core'
import Icon from '@lui/icons'
import './content.scss'
import UploadPDF from '../components/uploadPDF'
import { IContentViewProps } from '@ekp-runtime/render-module'
// import cmsLbpm from '@/api/cmsLbpm'
import cmsApi from '@/api/cmsOutWorkbench'
import axios from 'axios'
// import { resultData } from '../components/constants'

const { Step } = Steps

const Content: React.FC<IContentViewProps> = () => {

  // 图片样式
  const containerStyle = {
    padding: '24px',
    background: '#eee',
    backgroundImage: `url(${mk.getResourcePath('@module:cms-out-project/desktop/static/cms-out-images/background1.png')})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  }
  const logoStyle = {
    width: '151px',
    height: '24px',
    backgroundImage: `url(${mk.getResourcePath('@module:cms-out-project/desktop/static/cms-out-images/cmsLogo.png')})`,
    backgroundSize: '151px'
  }
  const loadingImageStyle = {
    height: '120px',
    flexShrink: 0,
    backgroundImage: `url(${mk.getResourcePath('@module:cms-out-project/desktop/static/cms-out-images/loading.gif')})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '120px',
    backgroundPosition: 'center center',
  }
  // 初始数据获取结束
  // const [initializationData, setInitializationData] = useState<any>([])
  // 上传的附件名
  const [fileName, setfileName] = useState<any>()
  // 附件ID
  const [fdFileId, setfdFileId] = useState<any>()
  // 附件在服务器上存放的路径
  const [fdFilePath, setfdFilePath] = useState<any>()

  // 登录名(hufeiran)
  const [fdOrgCode, setfdOrgCode] = useState<any>()
  // 编码(UR10003276)
  const [fdOrgId, setfdOrgId] = useState<any>()
  // 用户名(胡斐然)
  const [fdUserName, setfdUserName] = useState<any>()
  // 性别
  const [gender, setgender] = useState<any>()
  // 当前用户fdid
  // const [userFdId, setuserFdId] = useState<any>()


  // 所属部门名称(综合业务开发部)
  const [fdOrgName, setfdOrgName] = useState<any>()
  // let fdOrgName: any
  // 部门全路径
  const [fdFullOrgName, setfdFullOrgName] = useState<any>()
  // let fdFullOrgName: any

  // 步骤条事件
  const [current, setCurrent] = React.useState(0)

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

    /** 查询当前登录人部门信息 */
    await axios.request({
      url: '/data/sys-org/sysOrgElement/findElement',
      method: 'post',
      data: { 'targets': [userFdId], 'columns': ['fdId', 'fdName', 'fdOrgType', 'fdIsAvailable', 'fdParent', 'eosShowType', 'fdHierarchyId', 'fdInner', 'fdIsBusiness', 'fdNo', 'fdNamePinyin', 'fdVirtualizeType'] }
    }).then((res) => {
      console.log('findElement===', res.data.data)

      // fdOrgName = res.data.data[0].fdParent.fdName
      setfdOrgName(res.data.data[0].fdParent.fdName)
      console.log('当前登录人一级部门===', fdOrgName)

      const strLevelName = res.data.data[0].fdParent.fdDeptLevelName
      console.log('未处理部门全路径===', res.data.data[0].fdParent.fdDeptLevelName)
      const _LevelName = strLevelName.split('>').join('_')
      console.log('处理后部门全路径===', _LevelName)
      setfdFullOrgName(_LevelName)
      // fdFullOrgName = _LevelName
      console.log('部门全路径===', fdFullOrgName)

    })
  }

  //下一步
  // const next = () => {
  //   setCurrent(current + 1)
  //   console.log('下一步')
  // }
  //上一步
  // const prev = () => {
  //   setCurrent(current - 1)
  // }

  //简历上传事件
  const afterUpload = async (res) => {
    if (res.length > 0) {
      console.log('附件信息===', res)

      console.log('附件名称===', res[0].fullName)
      setfileName(res[0].fullName)

      const fdFileId = res[0].fdId
      console.log('附件ID===', fdFileId)
      setfdFileId(res[0].fdId)

      const fdFilePath = res[0].downloadUrl
      console.log('附件在服务器上存放的路径===', fdFilePath)
      setfdFilePath(res[0].downloadUrl)

      const userFdId = mk.getSysConfig().currentUser.fdId
      /** 查询当前登录人部门信息 */
      await axios.request({
        url: '/data/sys-org/sysOrgElement/findElement',
        method: 'post',
        data: { 'targets': [userFdId], 'columns': ['fdId', 'fdName', 'fdOrgType', 'fdIsAvailable', 'fdParent', 'eosShowType', 'fdHierarchyId', 'fdInner', 'fdIsBusiness', 'fdNo', 'fdNamePinyin', 'fdVirtualizeType'] }
      }).then((res) => {
        console.log('findElement===', res.data.data)

        const fdOrgName = res.data.data[0].fdParent.fdName
        console.log('当前登录人一级部门===', fdOrgName)

        const strLevelName = res.data.data[0].fdParent.fdDeptLevelName
        console.log('未处理部门全路径===', res.data.data[0].fdParent.fdDeptLevelName)
        const _LevelName = strLevelName.split('>').join('_')
        console.log('处理后部门全路径===', _LevelName)

        const fdFullOrgName = _LevelName
        console.log('部门全路径===', fdFullOrgName)

        const params = {
          fdFileId,
          fdFilePath,
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
      }).catch((err) => {
        console.log('findElement失败===', err)
        Message.error('当前用户信息获取失败')
        // const resultDataStr = JSON.stringify(resultData)
        // window.localStorage.setItem('resultData', resultDataStr)
      })

    }
  }

  // 大模型处理步骤更新事件
  const stepping = (params) => {
    cmsApi.key(params).then(resKey => {
      console.log('resKey成功====', resKey)
      const fdKeyPerson = {
        fdKey: resKey.data,
        fdOperationType: 'person'
      }
      const fdKeySkill = {
        fdKey: resKey.data,
        fdOperationType: 'skill'
      }
      const fdKeyExperience = {
        fdKey: resKey.data,
        fdOperationType: 'experience'
      }
      const fdKeyTopic = {
        fdKey: resKey.data,
        fdOperationType: 'topic'
      }

      // 1、获取大模型处理结果——个人信息
      cmsApi.convents(fdKeyPerson).then(resPerson => {
        console.log('resPerson====', resPerson)
        const personMessage = resPerson.data.personMessage

        // 2、获取大模型处理结果——技能点
        cmsApi.convents(fdKeySkill).then(resSkill => {
          console.log('resSkill====', resSkill)
          const skillPoint = resSkill.data.skillPoint

          // 3、获取大模型处理结果——工作经历
          cmsApi.convents(fdKeyExperience).then(resExperience => {
            console.log('resExperience====', resExperience)
            const workExperience = resExperience.data.workExperience

            // 4、获取大模型处理结果——智能题库
            cmsApi.convents(fdKeyTopic).then(resTopic => {
              console.log('resTopic====', resTopic)
              const topic = resTopic.data.initTopic
              const resultData = {
                personMessage: personMessage,
                skillPoint: skillPoint,
                workExperience: workExperience,
                initTopic: topic
              }
              console.log('resultData====', resultData)
              const resultDataString = JSON.stringify(resultData)
              window.localStorage.setItem('resultData', resultDataString)
              setCurrent(2)
              Message.success('处理完成')
              setTimeout(() => {
                handleInterview()
              }, 3000)
            }).catch(err => {
              console.log('失败====', err)
              Message.error('智能题库获取失败')
              setCurrent(0)
            })
            
          }).catch(err => {
            console.log('失败====', err)
            Message.error('工作经历信息提取失败，正在获取智能题库数据')
            // setCurrent(0)
            //工作经历获取失败时，直接跳转到下一步获取题库后跳转
            cmsApi.convents(fdKeyTopic).then(resTopic => {
              console.log('resTopic====', resTopic)
              const topic = resTopic.data.initTopic
              const resultData = {
                personMessage: personMessage,
                skillPoint: skillPoint,
                workExperience: [],
                initTopic: topic
              }
              console.log('resultData====', resultData)
              const resultDataString = JSON.stringify(resultData)
              window.localStorage.setItem('resultData', resultDataString)
              setCurrent(2)
              Message.success('处理完成')
              setTimeout(() => {
                handleInterview()
              }, 3000)
            }).catch(err => {
              console.log('失败====', err)
              Message.error('智能题库获取失败')
              setCurrent(0)
            })

          })
        }).catch(err => {
          console.log('失败====', err)
          Message.error('技术栈信息提取失败')
          setCurrent(0)
        })
      }).catch(err => {
        console.log('失败====', err)
        Message.error('个人信息提取失败')
        setCurrent(0)
      })

    }).catch(err => {
      console.log('失败====', err)
      Message.error('大模型key获取失败')
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
            <div className='loadingImage' style={loadingImageStyle}></div>
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
    window.location.replace('/web/cms-out-manage/desktop/#/cmsInterviewWorkbench/interviewAI')
  }

  const stpsOnChange = (current) => {
    setCurrent(current)
  }

  const test = () => {
    '#'
  }

  //页面初始化
  useEffect(() => {
    const elementDefault = document.querySelector('.ele-page-layout-default') as unknown as HTMLElement
    elementDefault.style.padding = '0px'
    getUserTopCategory()
  }, [])

  return (
    <div className="container" style={containerStyle}>
      <div className="header">
        <div className="header-logo" style={logoStyle}></div>
        <div className="header-avatar">
          <div className='header-people'>
            <div className='header-name'>
              {fdUserName}
              {/* <Icon name="iconCommon_surface_12_arrowDown" normalize onClick={test} style={{ paddingLeft: '2px' }} /> */}
            </div>
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
          {/* <div className="steps-action">
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
          </div> */}
        </div>
      </div>
    </div>
  )
}
export default Content